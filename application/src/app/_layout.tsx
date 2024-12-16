import { useInvertedThemeMode, useTheme } from '@/useTheme'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'
import { PaperProvider } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Slot } from 'expo-router'

export default function AppLayout() {
    const theme = useTheme()
    const mode = useInvertedThemeMode()

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