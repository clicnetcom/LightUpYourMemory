import { useTheme } from "@/useTheme"
import { useStore } from "@/useStore"
import { View, ScrollView, Image } from "react-native"
import { Text, Button, TextInput, SegmentedButtons } from "react-native-paper"
import { Fragment, useEffect, useState } from "react"
import { database } from "@/firebase"
import { get, ref, update, push, onValue } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"
import DeckSelection from "./DeckSelection"
import { router } from "expo-router"

export default function Matchmaking() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const [activeTab, setActiveTab] = useState('join')
    const [matches, setMatches] = useState<Match[]>([])

    const [currentMatch, setCurrentMatch] = useStore(state => [state.currentMatch, state.setCurrentMatch])
    const [deck, setDeck] = useState(null as Deck | null)

    const [password, setPassword] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        const matchesRef = ref(database, 'matches')
        const unsubscribe = onValue(matchesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const matchesArray = Object.entries(data).map(([id, match]: [string, any]) => ({
                    id,
                    type: 'multiplayer' as GameType,
                    p1: match.p1,
                    p2: match.p2,
                    deck: match.deck,
                    password: match.password,
                    chat: match.chat,
                    board: match.board,
                } as Match))
                setMatches(matchesArray)
            } else {
                setMatches([])
            }
        }, (error) => {
            console.error("Error watching matches:", error)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    const handleJoinMatch = (match: Match) => {
        if (!user) return

        const joinedMatch: Match = {
            ...match,
            p2: {
                uid: user.uid,
                name: user.displayName || 'Anon'
            },
            turn: match.turn || 'p1',
            board: match.board || [],
            chat: [{
                sender: 'system',
                text: `${match.p1.name} created the match!`
            }, {
                sender: 'system',
                text: `${user.displayName || 'Anon'} joined the match!`
            }]
        }

        update(ref(database, `matches/${match.id}`), joinedMatch)
            .then(() => {
                console.log('Joined match successfully', joinedMatch)
                setCurrentMatch(joinedMatch)
            })
            .catch((error) => {
                console.error("Error joining match:", error)
            })
    }

    const onDeckSelect = (deck: Deck) => {
        setDeck(deck)
    }
    const handleCreateMatch = async () => {
        if (!user || !deck || !currentMatch) return
        setIsCreating(true)

        try {
            const shuffledPairs = [...deck.cards, ...deck.cards]
                .sort(() => Math.random() - 0.5)
                .map((card, index) => ({
                    id: index,
                    value: card,
                    isFlipped: false,
                    isMatched: false
                }))

            const updatedMatch: Match = {
                ...currentMatch,
                deck: deck.id,
                password,
                turn: 'p1',
                board: shuffledPairs,
                chat: []
            }
            const newMatchRef = ref(database, `matches/${updatedMatch.id}`)
            await update(newMatchRef, updatedMatch)

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
                                <Fragment>
                                    {item.password && (
                                        <TextInput
                                            label="Password"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />)}
                                    <Button
                                        disabled={!!item?.password && password !== item?.password}
                                        mode="contained"
                                        onPress={() => handleJoinMatch(item)}>
                                        Join
                                    </Button>
                                </Fragment>
                            )}
                        </View>
                    )
                    }
                />
            )}

            {
                activeTab === 'create' && (
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
                )
            }
        </View >
    )
}