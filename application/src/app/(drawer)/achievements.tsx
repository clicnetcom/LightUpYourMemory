import { useTheme } from "@/useTheme"
import { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { Text } from "react-native-paper"
import { database } from "@/firebase"
import { ref, get } from "firebase/database"
import { useStore } from "@/useStore"

export default function Achievements() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const [userAchievements, setUserAchievements] = useState<string[]>([])

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

    useEffect(() => {
        if (!user) return

        const userRef = ref(database, `users/${user.uid}`)
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                console.log('user data:', data)
                if (data.achievements) {
                    setUserAchievements(data.achievements)
                }
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error)
        })
    }, [])

    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}
        >

            <ScrollView>

                <FlatList
                    data={achievements}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: theme.colors.onPrimary,
                            }}
                        >
                            <Text style={{ fontSize: 24, marginRight: 16 }}>
                                {item.icon}
                            </Text>
                            <Text style={{ fontSize: 20 }}>
                                {item.title}
                            </Text>
                        </View>
                    )}

                />

            </ScrollView>
        </View>
    )
}