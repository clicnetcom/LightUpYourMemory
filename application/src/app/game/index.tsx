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
import EndScreen from "@/components/EndScreen"
import { formatTime } from "@/utils"

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
            // save history
        }
    }, [cards])


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

    if (!deck) {
        return (
            <View style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text variant="headlineMedium" style={{ color: theme.colors.error }}>
                    Invalid deck, redirecting home
                </Text>
            </View>
        )
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
                deckType={deck.type}
                cards={cards}
                onCardPress={handleCardPress}
            />
            <EndScreen
                isGameComplete={isGameComplete}
                mistakes={mistakes}
                timer={timer}
                gameType={gameType}
                handlePlayAgain={handlePlayAgain}
            />
        </View>
    )
}