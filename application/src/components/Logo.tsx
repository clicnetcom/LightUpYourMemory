import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { useTheme } from '@/useTheme'

export default function Logo() {
    const theme = useTheme()

    return (
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text
                style={{
                    fontSize: 48,
                    fontFamily: 'RobotoBold',
                    color: theme.colors.primary,
                    lineHeight: 48
                }}
            >
                LightUp
            </Text>
            <Text
                style={{
                    fontSize: 32,
                    color: theme.colors.primary,
                }}
            >
                YourMemory
            </Text>
        </View>
    )
}
