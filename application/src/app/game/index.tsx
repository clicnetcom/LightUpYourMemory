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
import { get, ref, set } from "firebase/database"
import { database } from "@/firebase"
import Matchmaking from "@/components/Matchmaking"

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

    const user = useStore(state => state.user)
    const [currentGame, setCurrentGame] = useStore(state => [
        state.currentGame, state.setCurrentGame])
    const deck = useStore(state => state.decks.find(deck => deck.id === currentGame?.deck))

    const [cards, setCards] = useState<CardState[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [mistakes, setMistakes] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isRunning, setIsRunning] = useState(true)
    const [isGameComplete, setIsGameComplete] = useState(false)
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [playerScore, setPlayerScore] = useState(0)
    const [opponentScore, setOpponentScore] = useState(0)

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

    const finishGame = (win: boolean) => {
        setIsRunning(false)
        setIsGameComplete(true)
        get(ref(database, `users/${user?.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                if (data.stats) {
                    const newStats = {
                        plays: (data.stats.plays || 0) + 1,
                        ties: (gameType === 'single-ai' || gameType === 'multiplayer') ? (data.stats.ties || 0) + (playerScore === opponentScore ? 1 : 0) : (data.stats.ties || 0),
                        wins: win ? (data.stats.wins || 0) + 1 : (data.stats.wins || 0),
                        losses: !win ? (data.stats.losses || 0) + 1 : (data.stats.losses || 0),
                        time: gameType === 'time-attack' ? (data.stats.time || 0) == 0 ? timer : Math.min((data.stats.time || 0), timer) : (data.stats.time || 0),
                    }
                    set(ref(database, `users/${user?.uid}/stats`), newStats)
                }
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error)
        })
    }

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
            finishGame(true)
        }
    }, [cards])

    const makeAIMove = useCallback(() => {
        const unmatchedCards = cards.reduce((acc, card, index) => {
            if (!card.isMatched) acc.push(index)
            return acc
        }, [] as number[])

        if (unmatchedCards.length >= 2) {
            const firstIndex = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)]
            const newCards = [...cards]
            newCards[firstIndex].isFlipped = true
            setCards(newCards)
            setFlippedCards([firstIndex])

            setTimeout(() => {
                const remainingCards = unmatchedCards.filter(i => i !== firstIndex)
                const secondIndex = remainingCards[Math.floor(Math.random() * remainingCards.length)]
                newCards[secondIndex].isFlipped = true
                setCards(newCards)
                setFlippedCards([firstIndex, secondIndex])

                if (newCards[firstIndex].value === newCards[secondIndex].value) {
                    newCards[firstIndex].isMatched = true
                    newCards[secondIndex].isMatched = true
                    setCards(newCards)
                    setFlippedCards([])
                    setOpponentScore(prev => prev + 1)
                    if (newCards.every(card => card.isMatched)) {
                        finishGame(false)
                    } else {
                        setTimeout(makeAIMove, 700)
                    }
                } else {
                    setTimeout(() => {
                        newCards[firstIndex].isFlipped = false
                        newCards[secondIndex].isFlipped = false
                        setCards(newCards)
                        setFlippedCards([])
                        setIsPlayerTurn(true)
                    }, 1000)
                }
            }, 500)
        }
    }, [cards])

    const handleCardPress = (cardId: number) => {
        if (!isPlayerTurn || flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
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
                setPlayerScore(prev => prev + 1)
            } else {
                // No match
                setMistakes(prev => prev + 1)
                setTimeout(() => {
                    newCards[firstCard].isFlipped = false
                    newCards[secondCard].isFlipped = false
                    setCards(newCards)
                    setFlippedCards([])
                    if (gameType === 'single-ai') {
                        setIsPlayerTurn(false)
                        setTimeout(makeAIMove, 500)
                    }
                }, 1000)
            }
        }
    }

    const handlePlayAgain = () => {
        setIsGameComplete(false)
        setMistakes(0)
        setTimer(0)
        setIsRunning(true)
        setIsPlayerTurn(true)
        setPlayerScore(0)
        setOpponentScore(0)
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

    if (currentGame && gameType === 'multiplayer' && !currentGame?.opponent) {
        return <Matchmaking />
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

            {(gameType === 'time-attack' || gameType === 'single') &&
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
            }

            {gameType === 'single-ai' && <View style={{
                margin: 16,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingHorizontal: 16,
            }}>
                <View style={{
                    flex: 2,
                    backgroundColor: isPlayerTurn ? theme.colors.primary : 'transparent',
                    padding: 12,
                    borderRadius: 8,
                    opacity: isPlayerTurn ? 1 : 0.5,
                    alignItems: 'center',
                }}>
                    <Text variant="headlineMedium"
                        style={{
                            color: isPlayerTurn ? theme.colors.onPrimary : theme.colors.onBackground,
                        }}>
                        {'You'}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <Text variant="headlineMedium">
                        {`${playerScore}x${opponentScore}`}
                    </Text>
                </View>
                <View style={{
                    flex: 2,
                    backgroundColor: !isPlayerTurn ? theme.colors.primary : 'transparent',
                    padding: 12,
                    borderRadius: 8,
                    opacity: !isPlayerTurn ? 1 : 0.5,
                    alignItems: 'center',
                }}>
                    <Text variant="headlineMedium"
                        style={{
                            color: !isPlayerTurn ? theme.colors.onPrimary : theme.colors.onBackground,
                        }}>
                        {'Opponent'}
                    </Text>
                </View>
            </View>}

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
                playerScore={playerScore}
                opponentScore={opponentScore}
            />
        </View>
    )
}