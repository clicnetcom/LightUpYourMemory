import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { useTheme } from '@/useTheme'
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    useSharedValue,
    Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'

export default function Logo() {
    const theme = useTheme()
    const rotation = useSharedValue(0)
    const bounce = useSharedValue(0)

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(1, {
                duration: 2000,
                easing: Easing.sin
            }),
            -1,
            true
        )

        bounce.value = withRepeat(
            withSpring(1, {
                mass: 1,
                damping: 10,
                stiffness: 100,
            }),
            -1,
            true
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value * 5}deg` }]
    }))

    const bounceStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bounce.value * -5 }]
    }))

    return (
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Animated.Text
                style={[{
                    fontSize: 48,
                    fontFamily: 'RobotoBold',
                    color: theme.colors.primary,
                    lineHeight: 48
                }, animatedStyle]}
            >
                LightUp
            </Animated.Text>
            <Animated.Text
                style={[{
                    fontSize: 32,
                    color: theme.colors.primary,
                }, bounceStyle]}
            >
                YourMemory
            </Animated.Text>
        </View>
    )
}
