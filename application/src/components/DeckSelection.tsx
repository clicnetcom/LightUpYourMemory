import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text, Portal, Modal, Button } from "react-native-paper"
import { useStore } from "@/useStore"

export default function DeckSelection({ visible, onDismiss }: { visible: boolean, onDismiss: () => void }) {
    const theme = useTheme()
    const [currentGame, setCurrentGame] = useStore(state => [state.currentGame, state.setCurrentGame])

    const selectDeck = (deckId: string) => {
        if (currentGame) {
            setCurrentGame({
                ...currentGame,
                deck: deckId
            })
        }
    }

    const decks = [
        {
            id: 'emojis',
            title: 'Emojis',
            description: 'A deck of emojis',
            cards: [
                '😀', '❤️', '🎮', '🌟', '🎨',
                '🎵', '🎪', '🎯', '🎲', '🎭',
            ]
        },
        {
            id: 'numbers',
            title: 'Numbers',
            description: 'A deck of numbers',
            cards: [
                '1', '2', '3', '4', '5',
                '6', '7', '8', '9', '10'
            ]
        }
    ]

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={{
                    backgroundColor: theme.colors.background,
                    padding: 20,
                    margin: 20,
                    borderRadius: 8,
                    maxHeight: '80%'
                }}
            >
                <ScrollView>
                    <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
                        Select a deck
                    </Text>

                    {decks.map(deck => (
                        <Button
                            key={deck.id}
                            mode="outlined"
                            style={{ marginVertical: 8 }}
                            onPress={() => selectDeck(deck.id)}
                        >
                            <View>
                                <Text variant="titleMedium">{deck.title}</Text>
                                <Text variant="bodySmall">{deck.description}</Text>
                            </View>
                        </Button>
                    ))}
                </ScrollView>
            </Modal>
        </Portal>
    )
}