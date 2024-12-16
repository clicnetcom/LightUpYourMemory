import { CustomHeader } from "@/components/CustomHeader"
import DeckSelection from "@/components/DeckSelection"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { useLocalSearchParams, useNavigation, router } from "expo-router"
import { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

const GAME_TITLES: Record<GameType, string> = {
    'single': 'Single Player',
    'time-attack': 'Time Attack',
    'single-ai': 'Versus AI',
    'multiplayer': 'Versus Player'
}

export default function Game() {
    const theme = useTheme()
    const navigation = useNavigation()
    const local = useLocalSearchParams()
    const gameType = local?.type as GameType

    const [currentGame, setCurrentGame] = useStore(state => [
        state.currentGame, state.setCurrentGame])
    const [deckModalVisible, setDeckModalVisible] = useState(true)

    useEffect(() => {
        if (!Object.keys(GAME_TITLES).includes(gameType)) {
            setTimeout(() => {
                router.replace('/home')
            }, 2000)
            return
        }
        if (!currentGame) {
            setCurrentGame({
                id: new Date().getTime().toString(),
                type: gameType
            })
        }

        navigation.setOptions({
            header: () => <CustomHeader
                items={[]}
                title={GAME_TITLES[gameType]}
            />
        })
    }, [navigation, gameType])

    if (!Object.keys(GAME_TITLES).includes(gameType)) {
        return (
            <View style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
                    Invalid game type, redirecting home
                </Text>
            </View>
        )
    }

    if (currentGame && !currentGame?.deck) {
        return (
            <>
                <View style={{
                    backgroundColor: theme.colors.background,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text variant="headlineMedium">Please select a deck</Text>
                </View>
                <DeckSelection
                    visible={deckModalVisible}
                    onDismiss={() => router.replace('/home')}
                />
            </>
        )
    }

    return (
        <View style={{
            backgroundColor: theme.colors.background,
            flex: 1,
        }}>
            <ScrollView>
                <Text variant="headlineMedium">
                    {GAME_TITLES[gameType]}
                </Text>
            </ScrollView>
        </View>
    )
}