import { useTheme } from "@/useTheme"
import { useStore } from "@/useStore"
import { View, ScrollView, Image } from "react-native"
import { Text, Button } from "react-native-paper"
import { useEffect, useState } from "react"
import { database } from "@/firebase"
import { get, ref, update } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"

export default function Matchmaking() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const [activeTab, setActiveTab] = useState('join')
    const [matches, setMatches] = useState<Match[]>([])

    const [currentGame, setCurrentGame] = useStore(state => [state.currentGame, state.setCurrentGame])

    useEffect(() => {
        get(ref(database, 'matches')).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const matchesArray = Object.entries(data).map(([id, match]: [string, any]) => ({
                    id,
                    p1: match.p1,
                    p2: match.p2,
                    createAt: match.createAt || Date.now(),
                    deck: match.deck,
                    password: match.password
                }))
                setMatches(matchesArray)
            }
        }).catch((error) => {
            console.error("Error fetching matches:", error)
        })
    }, [])

    const handleJoinMatch = (match: Match) => {
        if (!user) return

        update(ref(database, `matches/${match.id}`), {
            p2: {
                id: user.uid,
                name: user.displayName
            }
        }).then(() => {
            console.log('Joined match successfully')
            setCurrentGame({
                id: match.id,
                type: 'multiplayer',
                deck: match.deck,
                opponent: {
                    uid: match.p1.uid,
                    name: match.p1.name
                } as Player
            })
        }).catch((error) => {
            console.error("Error joining match:", error)
        })
    }

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    mode={activeTab === 'join' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('join')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Join
                </Button>
                <Button
                    mode={activeTab === 'create' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('create')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Create
                </Button>
            </View>

            {activeTab === 'join' && (
                <FlatList
                    data={matches}
                    renderItem={({ item }) => (
                        <View style={{
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.outline,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <View>
                                <Text>Match #{item.id}</Text>
                                <Text>Created by: {item.p1.name}</Text>
                            </View>
                            {!item.p2 && (
                                <Button
                                    mode="contained"
                                    onPress={() => handleJoinMatch(item)}
                                >
                                    Join
                                </Button>
                            )}
                        </View>
                    )}
                />
            )}

            {activeTab === 'create' && (
                <View style={{ padding: 16 }}>
                    <Text>Create Match Form</Text>
                </View>
            )}
        </View>
    )
}