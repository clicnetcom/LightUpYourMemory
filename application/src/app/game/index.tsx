import { CustomHeader } from "@/components/CustomHeader"
import { useTheme } from "@/useTheme"
import { useGlobalSearchParams, useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect } from "react"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function Game() {
    const theme = useTheme()
    const navigation = useNavigation()

    const local = useLocalSearchParams()
    const gameType = local?.type as GameType



    useEffect(() => {
        navigation.setOptions({
            header: () => <CustomHeader
                items={[]}
                title={"Single Player"}
            />
        })
    }, [navigation])
    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}
        >

            <ScrollView>

                <Text variant="headlineMedium">
                    Generic Game of type {gameType}
                </Text>

            </ScrollView>
        </View>
    )
}