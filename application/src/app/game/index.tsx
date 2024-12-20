import { CustomHeader } from "@/components/CustomHeader"
import DeckSelection from "@/components/DeckSelection"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { useLocalSearchParams, useNavigation, router } from "expo-router"
import React, { useCallback, useRef } from "react"
import { useEffect, useState } from "react"
import { View, FlatList, useWindowDimensions, StyleSheet, Pressable, Animated } from "react-native"
import { Text, Portal, Modal, Button } from "react-native-paper"
import CardView from "@/components/CardView"
import EndScreen from "@/components/EndScreen"
import { formatTime } from "@/utils"
import { get, ref, set, onValue, remove, update } from "firebase/database"
import { database } from "@/firebase"
import Matchmaking from "@/components/Matchmaking"
import Waiting from "@/components/Waiting"
import Chat from "@/components/Chat"

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

    const user = useStore(state => state.user)
    const [currentMatch, setCurrentMatch] = useStore(state => [
        state.currentMatch, state.setCurrentMatch])
    const deck = useStore(state => state.decks.find(deck => deck.id === currentMatch?.deck))

    const [cards, setCards] = useState<CardState[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [mistakes, setMistakes] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isRunning, setIsRunning] = useState(true)
    const [isGameComplete, setIsGameComplete] = useState(false)
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [playerScore, setPlayerScore] = useState(0)
    const [opponentScore, setOpponentScore] = useState(0)
    const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1')

    const [isMaster, setIsMaster] = useState(true)
    const [opponent, setOpponent] = useState<Player | null>(null)

    const listenerRef = useRef<string | null>(null)

    useEffect(() => {
        if (!currentMatch?.id || !user) return

        if (listenerRef.current === currentMatch.id) return

        console.log('Setting up listener for match:', currentMatch.id)
        listenerRef.current = currentMatch.id

        const gameRef = ref(database, `matches/${currentMatch.id}`)
        const unsubscribe = onValue(gameRef, (snapshot) => {
            if (snapshot.exists()) {
                const gameData = snapshot.val()
                console.log('game data received:', gameData)
                setCurrentMatch(gameData)
            }
        })

        return () => {
            unsubscribe()
            listenerRef.current = null
        }
    }, [currentMatch?.id, user])

    useEffect(() => {
        console.log('Starting game', currentMatch)
        if (!user) {
            setTimeout(() => {
                router.replace('/home')
            }, 100)
            return
        }

        if (!currentMatch?.id) {
            const newMatch = {
                id: Date.now().toString(),
                type: gameType,
                turn: 'p1',
                p1: {
                    uid: user?.uid || '',
                    name: user?.displayName || 'Anon'
                },
            }
            setCurrentMatch(newMatch)
        }

        return () => {
            console.log('Cleaning up game')
            if (currentMatch?.p1.uid === user.uid) {
                remove(ref(database, `matches/${currentMatch.id}`))
            }
            setCurrentMatch(null)
        }
    }, [navigation, gameType, user])

    const handleGoHome = () => {
        if (currentMatch?.p1.uid === user?.uid) {
            remove(ref(database, `matches/${currentMatch?.id}`))
        }
        setCurrentMatch(null)
        router.push('/home')
    }
    useEffect(() => {
        if (gameType !== 'multiplayer') {
            return
        }
        const newCards = currentMatch?.board || []
        const newFlippedCards = newCards.reduce((acc, card, index) => {
            if (card.isFlipped) acc.push(index)
            return acc
        }, [] as number[])

        console.log('setting board', currentMatch, 'received flipped cards', newFlippedCards)
        setCards(newCards)
        setFlippedCards(newFlippedCards)


    }, [currentMatch])

    useEffect(() => {
        if (gameType === 'multiplayer' && currentMatch) {
            setCurrentTurn(currentMatch.turn || 'p1')
            const isPlayerOne = currentMatch.p1.uid === user?.uid
            const isPlayerTwo = currentMatch.p2?.uid === user?.uid
            const isMyTurn = (currentMatch.turn === 'p1' && isPlayerOne) ||
                (currentMatch.turn === 'p2' && isPlayerTwo)
            setIsPlayerTurn(isMyTurn)

            const newOpponent = isPlayerOne ? currentMatch.p2 : currentMatch.p1
            setOpponent(newOpponent || null)
        }
    }, [currentMatch, user])

    useEffect(() => {
        if (gameType === 'multiplayer') {
            return
        }
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
    }, [deck, gameType])

    const finishGame = (win: boolean) => {
        setIsRunning(false)
        setIsGameComplete(true)
        if (gameType === 'multiplayer' && currentMatch) {
            update(ref(database, `matches/${currentMatch.id}`), {
                ...currentMatch,
                isComplete: true,
                winner: win ? currentMatch.p1.uid : currentMatch.p2?.uid
            })
        }
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
            }, 2000)
        }
    }, [cards])

    const updateFlippedCards = (newFlippedCards: number[], newCards: CardState[], changeTurn?: boolean) => {
        if (gameType === 'multiplayer' && currentMatch) {
            const updates: any = {
                board: newCards.map(card => ({
                    ...card,
                    isFlipped: newFlippedCards.includes(card.id),
                }))
            }

            if (changeTurn) {
                updates.turn = currentMatch.turn === 'p1' ? 'p2' : 'p1'
                console.log('Changing turn to:', updates.turn)
            }

            update(ref(database, `matches/${currentMatch.id}`), {
                ...currentMatch,
                ...updates
            })
        } else {
            setFlippedCards(newFlippedCards)
            setCards(newCards)
        }
    }

    useEffect(() => {
        if (gameType === 'multiplayer' && currentMatch) {
            const isPlayerOne = currentMatch.p1.uid === user?.uid
            const isPlayerTwo = currentMatch.p2?.uid === user?.uid
            const isMyTurn = (currentMatch.turn === 'p1' && isPlayerOne) ||
                (currentMatch.turn === 'p2' && isPlayerTwo)

            console.log('Turn check:', {
                isPlayerOne,
                isPlayerTwo,
                currentTurn: currentMatch.turn,
                isMyTurn
            })

            setIsPlayerTurn(isMyTurn)
            setCurrentTurn(currentMatch.turn || 'p1')
            setOpponent(isPlayerOne ? currentMatch.p2 : currentMatch.p1)
        }
    }, [currentMatch, user])

    const handleCardPress = (cardState: CardState) => {
        if (gameType === 'multiplayer') {

            const isPlayerOne = currentMatch?.p1.uid === user?.uid
            const isPlayerTwo = currentMatch?.p2?.uid === user?.uid
            const isCorrectTurn = (isPlayerOne && currentMatch?.turn === 'p1') ||
                (isPlayerTwo && currentMatch?.turn === 'p2')

            console.log('multiplayer', isPlayerOne, isPlayerTwo, isCorrectTurn)
            if (!isCorrectTurn) return
        }

        if (!isPlayerTurn || flippedCards.length === 2 || cardState.isMatched || cardState.isFlipped) {
            return
        }

        const newCards = [...cards]
        const card = newCards.find(c => c.id === cardState.id)
        if (!card) return

        const newFlippedCards = flippedCards.length === 1
            ? [...flippedCards, cardState.id]
            : [cardState.id]

        card.isFlipped = true
        updateFlippedCards(newFlippedCards, newCards)

        if (newFlippedCards.length === 2) {
            const [firstCardId, secondCardId] = newFlippedCards
            const firstCard = newCards.find(c => c.id === firstCardId)
            const secondCard = newCards.find(c => c.id === secondCardId)

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
                firstCard.isMatched = true
                firstCard.isFlipped = false
                secondCard.isMatched = true
                secondCard.isFlipped = false

                if (gameType === 'multiplayer' && currentMatch) {
                    const isPlayerOne = currentMatch.p1.uid === user?.uid
                    const scoreField = isPlayerOne ? 'p1Score' : 'p2Score'
                    const newScore = ((currentMatch[scoreField] || 0) + 1)

                    update(ref(database, `matches/${currentMatch.id}`), {
                        ...currentMatch,
                        board: newCards,
                        [scoreField]: newScore
                    })
                } else {
                    updateFlippedCards([], newCards, false)
                    setPlayerScore(prev => prev + 1)
                }
            } else {
                setMistakes(prev => prev + 1)
                setTimeout(() => {
                    const cardsToUpdate = newCards.map(c => ({
                        ...c,
                        isFlipped: c.isMatched
                    }))
                    updateFlippedCards([], cardsToUpdate, gameType === 'multiplayer')
                    if (gameType === 'single-ai') {
                        setIsPlayerTurn(false)
                        setTimeout(makeAIMove, 500)
                    }
                }, 1000)
            }
        } else {
            setFlippedCards(newFlippedCards)
        }
    }

    const handlePlayAgain = () => {
        if (gameType === 'multiplayer' && currentMatch) {
            const shuffledCards = [...(deck?.cards || []), ...(deck?.cards || [])]
                .sort(() => Math.random() - 0.5)
                .map((card, index) => ({
                    value: card,
                    isFlipped: false,
                    isMatched: false,
                    id: index,
                }))

            update(ref(database, `matches/${currentMatch.id}`), {
                ...currentMatch,
                board: shuffledCards,
                p1Score: 0,
                p2Score: 0,
                isComplete: false,
                winner: null,
                turn: 'p1'
            })
        } else {
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
    }

    useEffect(() => {
        if (gameType === 'multiplayer' && currentMatch) {
            const isPlayerOne = currentMatch.p1.uid === user?.uid
            setPlayerScore(currentMatch.p1Score || 0)
            setOpponentScore(currentMatch.p2Score || 0)

            if (currentMatch.isComplete) {
                setIsGameComplete(true)
                setIsRunning(false)
            }
        }
    }, [currentMatch, user])

    // Add this helper function near the top of the component
    const getPlayerScores = useCallback(() => {
        if (!currentMatch || !user || gameType !== 'multiplayer') {
            return { myScore: playerScore, theirScore: opponentScore }
        }

        const isPlayerOne = currentMatch.p1.uid === user.uid
        return {
            myScore: isPlayerOne ? currentMatch.p1Score || 0 : currentMatch.p2Score || 0,
            theirScore: isPlayerOne ? currentMatch.p2Score || 0 : currentMatch.p1Score || 0
        }
    }, [currentMatch, user, gameType, playerScore, opponentScore])

    // Replace the score display section with this:
    const { myScore, theirScore } = getPlayerScores()

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
    if (currentMatch && gameType === 'multiplayer' && !currentMatch.p2?.uid) {
        if (currentMatch.deck && !currentMatch.p2?.uid) {
            return <Waiting />
        }
        return <Matchmaking />
    }



    const selectDeck = (deck: Deck) => {
        if (currentMatch) {
            setCurrentMatch({
                ...currentMatch,
                deck: deck.id
            })
        }
    }
    if (currentMatch && !currentMatch?.deck) {
        return <DeckSelection onSelect={selectDeck} />
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

            {(gameType === 'single-ai' || gameType === 'multiplayer') && <View style={{
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
                        {`${myScore}x${theirScore}`}
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
                        {gameType === 'single-ai' ? 'AI Opponent' : opponent?.name || 'Waiting...'}
                    </Text>
                </View>
            </View>}

            <CardView
                deckType={deck.type}
                cards={cards}
                onCardPress={handleCardPress}
                chatHeight={gameType === 'multiplayer' ? 250 : 0}
            />
            {currentMatch && gameType === 'multiplayer' && <Chat match={currentMatch} />}
            <EndScreen
                isGameComplete={isGameComplete}
                mistakes={mistakes}
                timer={timer}
                gameType={gameType}
                handlePlayAgain={handlePlayAgain}
                handleGoHome={handleGoHome}
                playerScore={myScore}
                opponentScore={theirScore}
                match={currentMatch}
                user={user}
            />
        </View>
    )
}