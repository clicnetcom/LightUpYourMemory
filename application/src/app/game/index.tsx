import { CustomHeader } from "@/components/CustomHeader"
import DeckSelection from "@/components/DeckSelection"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { useLocalSearchParams, useNavigation, router } from "expo-router"
import React from "react"
import { useEffect, useState } from "react"
import { View, ScrollView, FlatList, useWindowDimensions, StyleSheet, Pressable, Animated } from "react-native"
import { Text } from "react-native-paper"

const GAME_TITLES: Record<GameType, string> = {
    'single': 'Single Player',
    'time-attack': 'Time Attack',
    'single-ai': 'Versus AI',
    'multiplayer': 'Versus Player'
}

type CardState = {
    value: string
    isFlipped: boolean
    isMatched: boolean
    id: number
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

    const [cards, setCards] = useState<CardState[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [mistakes, setMistakes] = useState(0)

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
    }, [navigation, gameType, mistakes])

    useEffect(() => {
        if (deck) {
            const shuffledCards = [...deck.cards, ...deck.cards]
                .sort(() => Math.random() - 0.5)
                .map((card, index) => ({
                    value: card,
                    isFlipped: false,
                    isMatched: false,
                    id: index,
                }))
            setCards(shuffledCards)
        }
    }, [deck])

    const handleCardPress = (cardId: number) => {
        if (flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
            return
        }

        const newCards = [...cards]
        newCards[cardId].isFlipped = true
        setCards(newCards)

        const newFlippedCards = [...flippedCards, cardId]
        setFlippedCards(newFlippedCards)

        if (newFlippedCards.length === 2) {
            const [firstCard, secondCard] = newFlippedCards
            if (cards[firstCard].value === cards[secondCard].value) {
                // Match found
                newCards[firstCard].isMatched = true
                newCards[secondCard].isMatched = true
                setCards(newCards)
                setFlippedCards([])
            } else {
                // No match
                setMistakes(prev => prev + 1)
                setTimeout(() => {
                    newCards[firstCard].isFlipped = false
                    newCards[secondCard].isFlipped = false
                    setCards(newCards)
                    setFlippedCards([])
                }, 1000)
            }
        }
    }

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

            <Text variant="headlineMedium" style={{ margin: 16 }}>
                {mistakes} mistakes
            </Text>

            <ScrollView>
                <FlatList
                    data={cards}
                    numColumns={CARDS_PER_ROW}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => handleCardPress(item.id)}
                            style={{
                                width: CARD_SIZE,
                                height: CARD_SIZE,
                                margin: CARD_MARGIN,
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: item.isFlipped || item.isMatched ? theme.colors.primary : theme.colors.secondary,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {(item.isFlipped || item.isMatched) && (
                                    <Text style={{ fontSize: CARD_SIZE * 0.5 }}>{item.value}</Text>
                                )}
                            </View>
                        </Pressable>
                    )}
                />
            </ScrollView>
        </View>
    )
}