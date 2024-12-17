import { useInvertedThemeMode, useTheme } from '@/useTheme'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'
import { PaperProvider } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router, Slot } from 'expo-router'
import { auth, database } from '@/firebase'
import { useStore } from '@/useStore'
import NetInfo from '@react-native-community/netinfo'
import { get, ref } from '@firebase/database'
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
                }
            } else {
                router.replace('/login')
            }
        })

        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            setIsConnected(!!state.isConnected)
        })

        const decksRef = ref(database, 'decks')
        get(decksRef).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const existingDeckIds = new Set(decks.map(deck => deck.id))
                const newDecksData = data.filter((deck: any) => !existingDeckIds.has(deck.id))

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