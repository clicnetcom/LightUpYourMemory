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
    const achievements = useStore(state => state.achievements)
    const [userAchievements, setUserAchievements] = useState<string[]>([])

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
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 20
                }}
            >
                <FlatList
                    data={achievements}
                    style={{
                        width: '90%',
                        maxWidth: 500,
                    }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: theme.colors.onPrimary,
                                opacity: userAchievements.includes(item.id) ? 1 : 0.5,
                            }}
                        >
                            <Text style={{ fontSize: 24, marginRight: 16 }}>
                                {item.icon}
                            </Text>
                            <Text style={{ fontSize: 20, flex: 1 }}>
                                {item.title}
                            </Text>
                            {userAchievements.includes(item.id) && (
                                <Text style={{ fontSize: 24, color: 'green' }}>
                                    ✓
                                </Text>
                            )}
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    )
}