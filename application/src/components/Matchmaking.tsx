import { useTheme } from "@/useTheme"
import { useStore } from "@/useStore"
import { View, ScrollView, Image } from "react-native"
import { Text, Button, TextInput, SegmentedButtons } from "react-native-paper"
import { useEffect, useState } from "react"
import { database } from "@/firebase"
import { get, ref, update, push } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"
import DeckSelection from "./DeckSelection"

export default function Matchmaking() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const [activeTab, setActiveTab] = useState('join')
    const [matches, setMatches] = useState<Match[]>([])

    const [setCurrentGame] = useStore(state => [state.setCurrentGame])
    const [deck, setDeck] = useState(null as Deck | null)

    const [password, setPassword] = useState('')
    const [isCreating, setIsCreating] = useState(false)

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

    const onDeckSelect = (deck: Deck) => {
        setDeck(deck)
    }
    const handleCreateMatch = async () => {
        if (!user) return
        setIsCreating(true)

        try {
            const newMatchRef = push(ref(database, 'matches'))
            await update(newMatchRef, {
                p1: {
                    id: user.uid,
                    name: user.displayName
                },
                password: password || null,
                createAt: Date.now()
            })

            setCurrentGame({
                id: newMatchRef.key!,
                type: 'multiplayer',
                isWaiting: true,

            })

            setPassword('')
        } catch (error) {
            console.error("Error creating match:", error)
        } finally {
            setIsCreating(false)
        }
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
                            {item.p2 && (
                                <Text>Somebody is playing</Text>
                            )}
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
                <View style={{
                    flex: 1,
                    padding: 16,
                    gap: 16,
                    display: 'flex',
                }}>

                    <View style={{
                        flex: 1,
                        marginVertical: 8,
                    }}>
                        <DeckSelection onSelect={onDeckSelect} />
                    </View>

                    <View style={{
                        gap: 16,
                    }}>
                        <TextInput
                            label="Password (optional)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Button
                            mode="contained"
                            onPress={handleCreateMatch}
                            loading={isCreating}
                            disabled={isCreating || !user || !deck}
                        >
                            Create Match
                        </Button>
                    </View>
                </View>
            )}
        </View>
    )
}