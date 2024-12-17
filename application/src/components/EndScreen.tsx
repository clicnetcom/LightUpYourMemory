import { useTheme } from "@/useTheme"
import { router } from "expo-router"
import { useCallback } from "react"
import { View, FlatList, useWindowDimensions, Pressable, Image } from "react-native"
import { Text, Portal, Modal, Button } from "react-native-paper"




type Props = {
    isGameComplete: boolean
    mistakes: number
    timer: number
    gameType: GameType
    handlePlayAgain: () => void
}


export default function EndScreen({ isGameComplete, mistakes, timer, gameType, handlePlayAgain }: Props) {
    const theme = useTheme()

    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }, [])

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
    </Portal>)
}