import { useState } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { Text, Button, TextInput } from 'react-native-paper'
import { useTheme } from '@/useTheme'
import { useStore } from '@/useStore'
import * as ImagePicker from 'expo-image-picker'
import { push, ref, set, update } from 'firebase/database'
import { database } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase'

export default function DeckCreation({ goBack, onSelect }: { goBack: () => void, onSelect: (deck: Deck) => void }) {
    const theme = useTheme()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])

    const [decks, setDecks] = useStore(state => [state.decks, state.setDecks])

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        })

        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets].slice(0, 4))
        }
    }

    const handleSubmit = async () => {
        if (images.length < 2 || !title) return

        try {
            const newDeckId = Date.now().toString()
            const uploadPromises = images.map(async (image) => {
                const response = await fetch(image.uri)
                const blob = await response.blob()
                const fileName = `${newDeckId}/image-${image.uri.split('/').pop()}`
                const fileRef = storageRef(storage, fileName)
                await uploadBytes(fileRef, blob)
                return `gs://lightupyourmemory.firebasestorage.app/${fileName}`
            })

            const newDeck: Deck = {
                id: newDeckId,
                title,
                description,
                type: 'image',
                cards: await Promise.all(uploadPromises)
            }

            await update(ref(database, `decks/${newDeck.id}`), newDeck).then(async () => {
                console.log('Deck created successfully')

                const newDeckWithUrls: Deck = {
                    ...newDeck,
                    cards: await Promise.all(newDeck.cards.map(async (card) => {
                        return await getDownloadURL(storageRef(storage, card))
                    }))
                }

                setDecks([...decks, newDeckWithUrls])
                setTimeout(() => {
                    onSelect(newDeckWithUrls)
                    goBack()
                }, 200)
            })

        } catch (error) {
            console.error('Error creating deck:', error)
        }
    }

    return (
        <View style={{ gap: 16 }}>
            <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TouchableOpacity
                onPress={pickImages}
                style={{
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: theme.colors.outline,
                    padding: 20,
                    borderRadius: 8,
                    alignItems: 'center'
                }}
            >
                <Text>Tap to select images (max 4)</Text>
                <Text variant="bodySmall">{images.length}/4 selected</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image.uri }}
                        style={{ width: 100, height: 100 }}
                    />
                ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button mode="outlined" onPress={goBack}>Cancel</Button>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={images.length < 2 || !title}
                >
                    Create Deck
                </Button>
            </View>
        </View>
    )
}
