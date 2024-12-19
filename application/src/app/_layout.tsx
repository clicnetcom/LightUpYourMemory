import { useInvertedThemeMode, useTheme } from '@/useTheme'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'
import { PaperProvider } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router, Slot } from 'expo-router'
import { auth, database } from '@/firebase'
import { useStore } from '@/useStore'
import NetInfo from '@react-native-community/netinfo'
import { get, ref, set } from '@firebase/database'
import { getStorageUrl } from '@/utils'

export default function AppLayout() {
    const theme = useTheme()
    const mode = useInvertedThemeMode()

    const [user, setUser] = useStore(state => [state.user, state.setUser])
    const setIsConnected = useStore(state => state.setIsConnected)
    const [decks, setDecks] = useStore(state => [state.decks, state.setDecks])

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((newUser) => {
            if (newUser) {
                if (user?.uid !== newUser.uid) {
                    setUser(newUser)
                    const userRef = ref(database, `users/${newUser.uid}`)
                    get(userRef).then((snapshot) => {
                        if (!snapshot.exists()) {
                            set(userRef, {
                                name: newUser.displayName,
                                email: newUser.email,
                                photo: newUser.photoURL,
                                achievements: [],
                                stats: {
                                    plays: 0,
                                    wins: 0,
                                    losses: 0,
                                    time: 0,
                                    ties: 0,
                                },
                                logs: [],
                            })
                        }
                    }
                    ).catch((error) => {
                        console.error("Error fetching user data:", error)
                    })
                }
            } else {
                router.replace('/login')
            }
        })

        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            setIsConnected(!!state.isConnected)
        })


        get(ref(database, 'decks')).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const existingDeckIds = new Set(decks.map(deck => deck.id))

                const newDecksData = Object.values(data).filter((deck: any) => !existingDeckIds.has(deck.id))

                if (newDecksData.length === 0) return

                const promises = newDecksData.map(async (deck: any) => {
                    if (deck.type === 'image' && deck.cards[0].startsWith('gs://')) {
                        deck.cards = await Promise.all(deck.cards.map(async (card: string) => await getStorageUrl(card)))
                    }
                    return deck
                })
                const newDecks = await Promise.all(promises)
                setDecks([...decks, ...newDecks])
            }
        }).catch((error) => {
            console.error("Error fetching decks:", error)
        })

        get(ref(database, 'achievements')).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                useStore.setState({ achievements: data })
            }
        }).catch((error) => {
            console.error("Error fetching achievements:", error)
        })

        return () => {
            unsubscribeAuth()
            unsubscribeNetInfo()
        }
    }, [])

    useEffect(() => {
        setStatusBarStyle(mode)
    }, [mode])

    return (
        <PaperProvider theme={theme} >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Slot />
            </GestureHandlerRootView>
        </PaperProvider >
    )
}

const warn = console.warn
function logError(...parameters: any) {
    let filter = parameters.find((parameter: any) => {
        return (
            parameter.includes("deprecated")
        )
    })
    if (!filter) warn(...parameters)
}
console.warn = logError