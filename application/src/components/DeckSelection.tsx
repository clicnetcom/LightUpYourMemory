import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function DeckSelection() {
    const theme = useTheme()

    const decks = [
        {
            id: 'emojis',
            title: 'Emojis',
            description: 'A deck of emojis',
            cards: [
                '😀', '❤️', '🎮', '🌟', '🎨',
                '🎵', '🎪', '🎯', '🎲', '🎭',
                '🎪', '🎨', '🎯', '🎲', '🎭',
                '🎵', '🌟', '🎮', '❤️', '😀'
            ]
        }
    ]

    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}
        >

            <ScrollView>

                <Text variant="headlineMedium">
                    Select a deck
                </Text>

                {decks.map(deck => (
                    <View key={deck.id}>
                        <Text variant="headlineSmall">
                            {deck.title}
                        </Text>
                        <Text variant="bodyMedium">
                            {deck.description}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}