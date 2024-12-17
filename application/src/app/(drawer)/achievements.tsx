import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function Achievements() {
    const theme = useTheme()

    // 1. First game played 🎮
    // 2. First game won 🏆
    // 3. First game lost 😢
    // 4. First game tied 😐
    // 5. 10 games played 🔟
    // 6. 10 games won 🥇
    // 7. 10 games lost 💔
    // 8. 10 games tied 😐
    // 9. 100 games played 💯
    // 10 Perfect game 🌟
    // 11. Under 10 seconds ⏱️
    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}
        >

            <ScrollView>

                <Text variant="headlineMedium">
                    achievements
                </Text>

            </ScrollView>
        </View>
    )
}