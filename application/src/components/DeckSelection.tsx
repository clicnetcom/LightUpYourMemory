import { useTheme } from "@/useTheme"
import { View, FlatList, useWindowDimensions, Image } from "react-native"
import { Text, Button } from "react-native-paper"
import { useStore } from "@/useStore"
import { useState } from "react"

export default function DeckSelection({ onSelect }: { onSelect: (deck: Deck) => void }) {
    const theme = useTheme()
    const [currentGame, setCurrentGame] = useStore(state => [state.currentMatch, state.setCurrentMatch])
    const decks = useStore(state => state.decks)
    const { width } = useWindowDimensions()
    const PREVIEW_SIZE = 70
    const CARD_MARGIN = 3
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)

    const renderPreview = (deck: Deck) => (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: PREVIEW_SIZE * 2 + CARD_MARGIN * 4,
            marginVertical: 12,
            marginHorizontal: 12,
        }}>
            {deck.cards.slice(0, 4).map((card, index) => (
                <View
                    key={index}
                    style={{
                        width: PREVIEW_SIZE,
                        height: PREVIEW_SIZE,
                        margin: CARD_MARGIN,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {deck.type === 'image' &&
                        <Image
                            source={{ uri: card }}
                            style={{
                                width: PREVIEW_SIZE * 0.8,
                                height: PREVIEW_SIZE * 0.8,
                            }}
                        />
                    }

                    {deck.type === 'string' && card.length === 2 &&
                        <Text style={{ fontSize: PREVIEW_SIZE * 0.6 }}>
                            {card}
                        </Text>
                    }
                    {deck.type === 'string' && card.length === 1 &&
                        <Text style={{ fontSize: PREVIEW_SIZE * 0.9 }}>
                            {card}
                        </Text>
                    }
                    {deck.type === 'string' && card.length > 2 &&
                        <Text style={{ fontSize: PREVIEW_SIZE * 1.4 / card.length }}>
                            {card}
                        </Text>
                    }
                </View>
            ))}
        </View>
    )

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
                            {renderPreview(item)}
                        </View>
                    </Button>
                )}
            />
        </View>
    )
}