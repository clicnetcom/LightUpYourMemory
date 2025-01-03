import { useTheme } from "@/useTheme"
import { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ActivityIndicator, Text } from "react-native-paper"
import { database } from "@/firebase"
import { ref, get } from "firebase/database"
import { useStore } from "@/useStore"

export default function Achievements() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const achievements = useStore(state => state.achievements)
    const [userAchievements, setUserAchievements] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const evaluateCondition = (condition: string, stats: any) => {
        const [stat, operator, value] = condition.split(/\s*(>=|<=|==|>|<)\s*/)
        const statValue = stats[stat] || 0
        const compareValue = Number(value)

        switch (operator) {
            case '>=': return statValue >= compareValue
            case '<=': return statValue <= compareValue
            case '==': return statValue == compareValue
            case '>': return statValue > compareValue
            case '<': return statValue < compareValue
            default: return false
        }
    }

    useEffect(() => {
        if (!user) return

        get(ref(database, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const stats = data.stats || {}
                const unlockedAchievements = achievements
                    .filter(achievement => evaluateCondition(achievement.condition, stats))
                    .map(achievement => achievement.id)
                setIsLoading(false)
                setUserAchievements(unlockedAchievements)
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error)
        })
    }, [user, achievements])

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

                            {isLoading && (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            )}
                            {!isLoading && userAchievements.includes(item.id) && (
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