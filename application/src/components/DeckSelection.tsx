import { useTheme } from "@/useTheme"
import { View, FlatList, useWindowDimensions, Image } from "react-native"
import { Text, Button } from "react-native-paper"
import { useStore } from "@/useStore"
import { useState } from "react"
import DeckPreview from "./DeckPreview"
import DeckCreation from "./DeckCreation"

export default function DeckSelection({ onSelect }: { onSelect: (deck: Deck) => void }) {
    const theme = useTheme()
    const { width } = useWindowDimensions()

    const decks = useStore(state => state.decks)
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)

    const [deckCreation, setDeckCreation] = useState(false)

    return (
        <View style={{
            backgroundColor: theme.colors.background,
            padding: 50,
            flex: 1,
        }}>

            {deckCreation && <DeckCreation
                goBack={() => setDeckCreation(false)}
                onSelect={(deck) => onSelect(deck)} />}

            {!deckCreation && <FlatList
                data={decks}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                }}
                renderItem={({ item }) => (
                    <Button
                        key={item.id}
                        style={{
                            marginVertical: 8,
                            width: (width - 100) / 2,
                            alignItems: 'center',
                            padding: 8,
                            backgroundColor: selectedDeckId === item.id ? theme.colors.primaryContainer : undefined,
                        }}
                        onPress={() => {
                            setSelectedDeckId(item.id)
                            onSelect(item)
                        }}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Text variant="titleMedium">{item.title}</Text>
                            <Text variant="bodySmall">{item.description}</Text>
                            <DeckPreview deck={item} />
                        </View>
                    </Button>
                )}
                ListFooterComponent={<Button
                    key="create-new-deck"
                    style={{
                        marginVertical: 8,
                        width: (width - 100) / 2,
                        alignItems: 'center',
                        padding: 8,
                    }}
                    onPress={() => {
                        setDeckCreation(true)
                    }}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text variant="titleMedium">Custom</Text>
                        <Text variant="bodySmall">Upload your own images</Text>
                        <DeckPreview deck={{
                            id: '',
                            title: '',
                            description: '',
                            type: 'string',
                            cards: ['❓', '❔', '❔', '❓']
                        }} />
                    </View>
                </Button>}
            />}
        </View>
    )
}