import { useTheme } from "@/useTheme"
import { formatTime } from "@/utils"
import { router } from "expo-router"
import { Fragment } from "react"
import { View, FlatList, useWindowDimensions, Pressable, Image } from "react-native"
import { Text, Portal, Modal, Button } from "react-native-paper"

type Props = {
    isGameComplete: boolean
    mistakes: number
    timer: number
    gameType: GameType
    handlePlayAgain?: () => void
    handleGoHome?: () => void
    playerScore: number
    opponentScore: number
    match?: Match
    user?: { uid: string } | null
}

export default function EndScreen({
    isGameComplete,
    mistakes,
    timer,
    gameType,
    handlePlayAgain,
    handleGoHome,
    playerScore,
    opponentScore,
    match,
    user
}: Props) {
    const theme = useTheme()

    const getScores = () => {
        if (gameType !== 'multiplayer' || !match || !user) {
            return { yourScore: playerScore, theirScore: opponentScore }
        }

        const isPlayerOne = match.p1.uid === user.uid
        return {
            yourScore: isPlayerOne ? match.p1Score || 0 : match.p2Score || 0,
            theirScore: isPlayerOne ? match.p2Score || 0 : match.p1Score || 0
        }
    }

    const { yourScore, theirScore } = getScores()

    return (<Portal>
        <Modal
            visible={isGameComplete}
            onDismiss={handleGoHome}
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

            {gameType === 'single' &&
                <Text variant="titleMedium">
                    Mistakes: {mistakes}
                </Text>
            }
            {gameType === 'time-attack' && (
                <Text variant="titleMedium">
                    Time: {formatTime(timer)}
                </Text>
            )}
            {(gameType === 'multiplayer' || gameType === 'single-ai') && <Fragment >
                {(yourScore === theirScore ? (
                    <Text variant="titleMedium">It's a tie!</Text>
                ) : (
                    <Text variant="titleMedium">
                        {yourScore > theirScore ? 'You win!' : 'You lose!'}
                    </Text>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <View>
                        <Text variant="titleMedium">Your Score: {yourScore}</Text>
                        <Text variant="titleMedium">Opponent Score: {theirScore}</Text>
                    </View>
                </View>

            </Fragment>

            }

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

                {!handlePlayAgain &&
                    <Button
                        mode="contained"
                        onPress={handlePlayAgain}
                        disabled={!handlePlayAgain}
                        style={{ flex: 1, marginRight: 8 }}
                    >
                        Play Again
                    </Button>
                }
                <Button
                    mode="outlined"
                    onPress={handleGoHome}
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    Home
                </Button>
            </View>
        </Modal>
    </Portal >)
}