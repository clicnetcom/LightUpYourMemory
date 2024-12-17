import { useTheme } from "@/useTheme"
import { View, ScrollView, FlatList } from "react-native"
import { Text, Button } from "react-native-paper"
import { useStore } from "@/useStore"

export default function DeckSelection() {
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
        <View style={{
            backgroundColor: theme.colors.background,
            padding: 20,
            flex: 1,
        }}>
            <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
                Select a deck:
            </Text>

            <ScrollView>
                <FlatList
                    numColumns={3}
                    data={decks}
                    renderItem={({ item }) => (
                        <Button
                            key={item.id}
                            mode="outlined"
                            style={{ marginVertical: 8 }}
                            onPress={() => selectDeck(item.id)}
                        >
                            <View>
                                <Text variant="titleMedium">{item.title}</Text>
                                <Text variant="bodySmall">{item.description}</Text>
                            </View>
                        </Button>
                    )}
                />
            </ScrollView>
        </View>
    )
}