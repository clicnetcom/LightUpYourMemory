import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function Achievements() {
    const theme = useTheme()
    const achievements: Achievement[] = [
        {
            id: '0',
            title: 'First game played',
            icon: '🎮'
        }, {
            id: '1',
            title: 'First game won',
            icon: '🏆'
        }, {
            id: '2',
            title: 'First game lost',
            icon: '😢'
        }, {
            id: '3',
            title: 'First game tied',
            icon: '😐'
        }, {
            id: '4',
            title: '10 games played',
            icon: '🔟'
        }, {
            id: '5',
            title: '10 games won',
            icon: '🥇'
        }, {
            id: '6',
            title: '10 games lost',
            icon: '💔'
        }, {
            id: '7',
            title: '10 games tied',
            icon: '😐'
        }, {
            id: '8',
            title: '100 games played',
            icon: '💯'
        }, {
            id: '9',
            title: 'Perfect game',
            icon: '🌟'
        }, {
            id: '10',
            title: 'Under 10 seconds',
            icon: '⏱️'
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
                    achievements
                </Text>

            </ScrollView>
        </View>
    )
}