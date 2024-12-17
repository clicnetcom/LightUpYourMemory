import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text, Button } from "react-native-paper"
import { useEffect, useState } from "react"
import { database } from "@/firebase"
import { useStore } from "@/useStore"
import { get, ref } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"

export default function Leaderboards() {
    const theme = useTheme()
    const [activeTab, setActiveTab] = useState('wins')

    const [wins, setWins] = useState([])
    const [losses, setLosses] = useState([])
    const [timeAttack, setTimeAttack] = useState([])

    useEffect(() => {
        get(ref(database, 'users')).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const users = Object.values(data)

                const tempWins: any | null[] = []
                const tempLosses: any | null[] = []
                const tempTimeAttack: any | null[] = []

                users.forEach((user: any) => {
                    const { wins, losses, time } = user.stats
                    tempWins.push({ name: user.name, value: wins })
                    tempLosses.push({ name: user.name, value: losses })
                    tempTimeAttack.push({ name: user.name, value: time })
                })

                setWins(tempWins.sort((a: any, b: any) => b.value - a.value))
                setLosses(tempLosses.sort((a: any, b: any) => b.value - a.value))
                setTimeAttack(tempTimeAttack.sort((a: any, b: any) => a.value - b.value))

                console.log('data:', data)
            }
        }).catch((error) => {
            console.error("Error fetching users:", error)
        })

    }, [])


    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    mode={activeTab === 'wins' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('wins')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Wins
                </Button>
                <Button
                    mode={activeTab === 'losses' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('losses')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Losses
                </Button>
                <Button
                    mode={activeTab === 'timeAttack' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('timeAttack')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Time Attack
                </Button>
            </View>
            <ScrollView>
                <FlatList
                    data={activeTab === 'wins' ? wins : activeTab === 'losses' ? losses : timeAttack}
                    renderItem={({ item, index }) => (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.onPrimary,
                        }}>
                            <Text style={{ fontSize: 24, marginRight: 16 }}>
                                {index + 1}
                            </Text>
                            <Text style={{ fontSize: 24, marginRight: 16 }}>
                                {item.name}
                            </Text>
                            <Text style={{ fontSize: 20, flex: 1 }}>
                                {item.value}
                            </Text>
                        </View>
                    )}

                />
            </ScrollView>
        </View>
    )
}