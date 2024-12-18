import { useTheme } from "@/useTheme"
import { useStore } from "@/useStore"
import { View, ScrollView, Image } from "react-native"
import { Text, Button } from "react-native-paper"
import { useEffect, useState } from "react"
import { database } from "@/firebase"
import { get, ref } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"

export default function Matchmaking() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const [activeTab, setActiveTab] = useState('join')
    const [matches, setMatches] = useState<Match[]>([])

    useEffect(() => {
        get(ref(database, 'matches')).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const matchesArray = Object.entries(data).map(([id, match]: [string, any]) => ({
                    id,
                    p1: match.p1,
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
                            borderBottomColor: theme.colors.outline
                        }}>
                            <Text>Match #{item.id}</Text>
                            <Text>Created by: {item.p1}</Text>
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