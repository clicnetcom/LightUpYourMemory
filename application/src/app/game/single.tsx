import { CustomHeader } from "@/components/CustomHeader"
import { useTheme } from "@/useTheme"
import { useNavigation } from "expo-router"
import { useEffect } from "react"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function Single() {
    const theme = useTheme()
    const navigation = useNavigation()


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
                    Single mode
                </Text>

            </ScrollView>
        </View>
    )
}