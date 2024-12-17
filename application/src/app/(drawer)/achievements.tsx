import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function Achievements() {
    const theme = useTheme()

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