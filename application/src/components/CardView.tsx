import { View, FlatList, useWindowDimensions, Pressable } from "react-native"
import { Text } from "react-native-paper"
import { useTheme } from "@/useTheme"

type CardViewProps = {
    cards: {
        value: string
        isFlipped: boolean
        isMatched: boolean
        id: number
    }[]
    onCardPress: (cardId: number) => void
}

export default function CardView({ cards, onCardPress }: CardViewProps) {
    const theme = useTheme()
    const { width } = useWindowDimensions()
    const MIN_CARD_SIZE = 200
    const CARD_MARGIN = 4
    const CARDS_PER_ROW = Math.min(Math.floor(width / (MIN_CARD_SIZE + (CARD_MARGIN * 2))), cards.length)
    const CARD_SIZE = (width - (CARDS_PER_ROW * CARD_MARGIN * 2)) / CARDS_PER_ROW

    return (
        <FlatList
            data={cards}
            numColumns={CARDS_PER_ROW}
            key={CARDS_PER_ROW}
            scrollEnabled={false}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() => onCardPress(item.id)}
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
                            <Text style={{ fontSize: CARD_SIZE * 0.5 }}>{item.value}</Text>
                        )}
                    </View>
                </Pressable>
            )}
        />
    )
}
