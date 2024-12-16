import { CustomHeader } from "@/components/CustomHeader"
import DeckSelection from "@/components/DeckSelection"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { useLocalSearchParams, useNavigation, router } from "expo-router"
import React from "react"
import { useEffect, useState } from "react"
import { View, ScrollView, FlatList, useWindowDimensions, StyleSheet } from "react-native"
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

    const deck = useStore(state => state.decks.find(deck => deck.id === currentGame?.deck))

    const { width } = useWindowDimensions()
    const CARD_MARGIN = 4
    const CARDS_PER_ROW = 4
    const CARD_SIZE = (width - (CARDS_PER_ROW * CARD_MARGIN * 2)) / CARDS_PER_ROW

    useEffect(() => {
        return () => {
            setCurrentGame(null)
        }
    }, [])

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
                {deck && (
                    <FlatList
                        data={[...deck.cards, ...deck.cards]}
                        numColumns={CARDS_PER_ROW}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: CARD_SIZE,
                                    height: CARD_SIZE,
                                    margin: CARD_MARGIN,
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: CARD_SIZE * 0.5 }}>{item}</Text>
                            </View>
                        )}
                    />
                )}
            </ScrollView>
        </View>
    )
}