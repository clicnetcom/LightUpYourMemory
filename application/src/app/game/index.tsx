import { CustomHeader } from "@/components/CustomHeader"
import DeckSelection from "@/components/DeckSelection"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { useLocalSearchParams, useNavigation, router } from "expo-router"
import React, { useCallback } from "react"
import { useEffect, useState } from "react"
import { View, FlatList, useWindowDimensions, StyleSheet, Pressable, Animated } from "react-native"
import { Text, Portal, Modal, Button } from "react-native-paper"
import CardView from "@/components/CardView"

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


    const [cards, setCards] = useState<CardState[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [mistakes, setMistakes] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isRunning, setIsRunning] = useState(true)
    const [isGameComplete, setIsGameComplete] = useState(false)

    const { width } = useWindowDimensions()

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

    useEffect(() => {
        let intervalId: NodeJS.Timeout
        if (isRunning) {
            intervalId = setInterval(() => {
                setTimer(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(intervalId)
    }, [isRunning])

    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setIsRunning(false)
            setIsGameComplete(true)
        }
    }, [cards])

    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }, [])

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

    const handlePlayAgain = () => {
        setIsGameComplete(false)
        setMistakes(0)
        setTimer(0)
        setIsRunning(true)
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
        return <DeckSelection />
    }

    return (
        <View style={{
            backgroundColor: theme.colors.background,
            flex: 1,
        }}>
            <View style={{
                margin: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text variant="headlineMedium">
                    {mistakes} mistakes
                </Text>
                {gameType === 'time-attack' &&
                    <Text variant="headlineMedium">
                        {formatTime(timer)}
                    </Text>}
            </View>

            <CardView
                cards={cards}
                onCardPress={handleCardPress}
            />

            <Portal>
                <Modal
                    visible={isGameComplete}
                    onDismiss={() => router.push('/home')}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.background,
                        padding: 20,
                        margin: 20,
                        borderRadius: 8,
                    }}
                >
                    <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
                        Game Complete!
                    </Text>
                    <Text variant="titleMedium">
                        Mistakes: {mistakes}
                    </Text>
                    {gameType === 'time-attack' && (
                        <Text variant="titleMedium">
                            Time: {formatTime(timer)}
                        </Text>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Button
                            mode="contained"
                            onPress={handlePlayAgain}
                            style={{ flex: 1, marginRight: 8 }}
                        >
                            Play Again
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => router.push('/home')}
                            style={{ flex: 1, marginLeft: 8 }}
                        >
                            Home
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}