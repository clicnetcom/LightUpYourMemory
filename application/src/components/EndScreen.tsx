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
    handlePlayAgain: () => void
    playerScore: number
    opponentScore: number
}


export default function EndScreen({
    isGameComplete,
    mistakes,
    timer,
    gameType,
    handlePlayAgain,
    playerScore,
    opponentScore,
}: Props) {
    const theme = useTheme()
    return (<Portal>
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
                {(playerScore === opponentScore ? (
                    <Text variant="titleMedium">It's a tie!</Text>
                ) : (
                    <Text variant="titleMedium">
                        {playerScore > opponentScore ? 'You win!' : 'You lose!'}
                    </Text>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <View>
                        <Text variant="titleMedium">Your Score: {playerScore}</Text>
                        <Text variant="titleMedium">Opponent Score: {opponentScore}</Text>
                    </View>
                </View>

            </Fragment>

            }

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
    </Portal >)
}