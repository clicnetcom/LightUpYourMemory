import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text, Portal, Modal, Button } from "react-native-paper"
import { useStore } from "@/useStore"

export default function DeckSelection({ visible, onDismiss }: { visible: boolean, onDismiss?: () => void }) {
    const theme = useTheme()
    const [currentGame, setCurrentGame] = useStore(state => [state.currentGame, state.setCurrentGame])
    const decks = useStore(state => state.decks)

    const selectDeck = (deckId: string) => {
        if (currentGame) {
            setCurrentGame({
                ...currentGame,
                deck: deckId
            })
        }
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                dismissable={false}
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
                        Select a deck:
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