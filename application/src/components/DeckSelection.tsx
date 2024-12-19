import { useTheme } from "@/useTheme"
import { View, FlatList, useWindowDimensions, Image } from "react-native"
import { Text, Button } from "react-native-paper"
import { useStore } from "@/useStore"
import { useState } from "react"
import DeckPreview from "./DeckPreview"

export default function DeckSelection({ onSelect }: { onSelect: (deck: Deck) => void }) {
    const theme = useTheme()
    const [currentGame, setCurrentGame] = useStore(state => [state.currentMatch, state.setCurrentMatch])
    const decks = useStore(state => state.decks)
    const { width } = useWindowDimensions()

    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
    return (
        <View style={{
            backgroundColor: theme.colors.background,
            padding: 50,
            flex: 1,
        }}>
            <FlatList
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
            />
        </View>
    )
}