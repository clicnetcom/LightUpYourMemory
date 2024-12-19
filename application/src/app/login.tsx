import { View, Text, ActivityIndicator } from 'react-native'
import { useTheme } from '@/useTheme'
import { Fragment, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth'
import { router } from 'expo-router'

export default function SignupPage() {
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({ prompt: 'select_account' })
            await signInWithPopup(auth, provider)
            router.replace('/(drawer)/home')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAnonymousSignIn = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await signInAnonymously(auth)
            router.replace('/(drawer)/home')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        }}>
            <Text style={{
                fontSize: 24,
                color: theme.colors.primary,
                marginBottom: 32
            }}>
                Welcome to LightUpYourMemory
            </Text>

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <Fragment>
                    <CustomButton
                        buttonStyle={{ width: 300, marginBottom: 10 }}
                        label="Sign in with Google"
                        onPress={handleGoogleSignIn}
                    />
                    <CustomButton
                        buttonStyle={{ width: 300 }}
                        label="Continue as Guest"
                        onPress={handleAnonymousSignIn}
                    />
                </Fragment>
            )}

            {error && (
                <Text style={{
                    color: theme.colors.error,
                    marginTop: 16
                }}>
                    {error}
                </Text>
            )}
        </View>
    )
}
