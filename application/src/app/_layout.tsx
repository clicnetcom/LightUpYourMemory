import { useInvertedThemeMode, useTheme } from '@/useTheme'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'
import { PaperProvider } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router, Slot } from 'expo-router'
import { auth } from '@/firebase'
import { useStore } from '@/useStore'
import NetInfo from '@react-native-community/netinfo'

export default function AppLayout() {
    const theme = useTheme()
    const mode = useInvertedThemeMode()

    const [user, setUser] = useStore(state => [state.user, state.setUser])
    const setIsConnected = useStore(state => state.setIsConnected)

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