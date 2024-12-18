import { View } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import { useTheme } from "@/useTheme"

export default function Waiting() {
    const theme = useTheme()
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
                variant="headlineMedium"
                style={{
                    marginBottom: 16,
                    color: theme.colors.primary,
                    fontWeight: 'bold'
                }}
            >
                Waiting for friend to join
            </Text>
            <ActivityIndicator size="large" />
        </View>
    )
}