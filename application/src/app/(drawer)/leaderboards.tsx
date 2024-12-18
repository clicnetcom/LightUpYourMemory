import { useTheme } from "@/useTheme"
import { View, ScrollView, Image } from "react-native"
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
                    if (!user.name) {
                        return
                    }
                    const { wins, losses, time } = user.stats
                    tempWins.push({ name: user.name, value: wins, photo: user.photo })
                    tempLosses.push({ name: user.name, value: losses, photo: user.photo })
                    tempTimeAttack.push({ name: user.name, value: time, photo: user.photo })
                })

                setWins(tempWins.sort((a: any, b: any) => b.value - a.value))
                setLosses(tempLosses.sort((a: any, b: any) => b.value - a.value))
                setTimeAttack(tempTimeAttack.sort((a: any, b: any) => a.value - b.value))
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
                <View style={{
                    flexDirection: 'row',
                    padding: 16,
                    backgroundColor: theme.colors.primaryContainer,
                    borderBottomWidth: 2,
                    borderBottomColor: theme.colors.primary,
                }}>
                    <Text style={{ width: 50, fontSize: 18, fontWeight: 'bold' }}>Rank</Text>
                    <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold' }}>Player</Text>
                    <Text style={{ width: 80, fontSize: 18, fontWeight: 'bold' }}>
                        {activeTab === 'timeAttack' ? 'Time' : 'Count'}
                    </Text>
                </View>
                <FlatList
                    data={activeTab === 'wins' ? wins : activeTab === 'losses' ? losses : timeAttack}
                    renderItem={({ item, index }) => (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.outlineVariant,
                            backgroundColor: index % 2 === 0 ? theme.colors.background : theme.colors.surfaceVariant,
                        }}>
                            <Text style={{ width: 40, fontSize: 16 }}>#{index + 1}</Text>
                            {item.photo ? (
                                <Image
                                    source={{ uri: item.photo }}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        marginRight: 8
                                    }}
                                />
                            ) : (
                                <Text style={{
                                    fontSize: 24,
                                    marginRight: 8
                                }}>
                                    👤
                                </Text>
                            )}
                            <Text style={{ flex: 1, fontSize: 16 }}>{item.name}</Text>
                            <Text style={{ width: 80, fontSize: 16 }}>
                                {activeTab === 'timeAttack'
                                    ? `${Math.floor(item.value / 60)}:${(item.value % 60).toString().padStart(2, '0')}`
                                    : item.value}
                            </Text>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    )
}