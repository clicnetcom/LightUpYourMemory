import { View, FlatList, useWindowDimensions, Pressable, Image } from "react-native"
import { Text } from "react-native-paper"
import { useTheme } from "@/useTheme"

type CardViewProps = {
    cards: {
        value: string
        isFlipped: boolean
        isMatched: boolean
        id: number
    }[]
    onCardPress: (card: CardState) => void,
    deckType: DeckType
}

export default function CardView({ cards, onCardPress, deckType }: CardViewProps) {
    const theme = useTheme()
    const { width, height } = useWindowDimensions()
    const AVAILABLE_HEIGHT = height - 150 // space for  header
    const CARD_MARGIN = 4

    const totalCards = cards.length

    let bestCols = totalCards
    let bestSize = 0

    for (let rows = 2; rows <= totalCards; rows++) {
        if (totalCards % rows === 0) {
            const cols = totalCards / rows
            const maxWidthPerCard = (width - (cols * CARD_MARGIN * 2)) / cols
            const maxHeightPerCard = (AVAILABLE_HEIGHT - (rows * CARD_MARGIN * 2)) / rows
            const size = Math.min(maxWidthPerCard, maxHeightPerCard)

            if (size > bestSize) {
                bestSize = size
                bestCols = cols
            }
        }
    }

    const CARDS_PER_ROW = bestCols
    const CARD_SIZE = bestSize

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <FlatList
                data={cards}
                numColumns={CARDS_PER_ROW}
                key={CARDS_PER_ROW}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => onCardPress(item)}
                        style={{
                            width: CARD_SIZE,
                            height: CARD_SIZE,
                            margin: CARD_MARGIN,
                        }}
                    >
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: item.isFlipped || item.isMatched ? theme.colors.primary : theme.colors.secondary,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {(item.isFlipped || item.isMatched) && (
                                deckType === 'image' ? (
                                    <Image
                                        source={{ uri: item.value }}
                                        style={{
                                            width: CARD_SIZE * 0.8,
                                            height: CARD_SIZE * 0.8,
                                        }}
                                    />
                                ) : (
                                    item.value.length > 2 ? (
                                        <Text style={{ fontSize: CARD_SIZE * 0.3 }}>{item.value}</Text>
                                    ) : (
                                        <Text style={{ fontSize: CARD_SIZE * 0.8 }}>{item.value}</Text>
                                    )
                                )
                            )}
                        </View>
                    </Pressable>
                )}
                style={{
                    width: (CARD_SIZE + CARD_MARGIN * 2) * CARDS_PER_ROW,
                }}
            />
        </View>
    )
}
