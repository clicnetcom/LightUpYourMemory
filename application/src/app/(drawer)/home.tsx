import { FlatList, View, useWindowDimensions } from "react-native"
import { useStore } from '@/useStore'
import CustomButton from "@/components/CustomButton"
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from "@react-navigation/drawer"
import { useTheme } from "@/useTheme"
import { useEffect, useState } from "react"
import { auth } from "@/firebase"
import { router } from "expo-router"

import NetInfo from '@react-native-community/netinfo'

export default function HomePage() {
    const theme = useTheme()
    const user = useStore(state => state.user)
    const setUser = useStore(state => state.setUser)
    const decks = useStore(state => state.decks)

    const [isConnected, setIsConnected] = useStore(state => [state.isConnected, state.setIsConnected])

    const setDecks = useStore(state => state.setDecks)
    useEffect(() => {
        setDecks(decks)
        auth.onAuthStateChanged((newUser) => {
            if (newUser) {
                if (user?.uid !== newUser.uid) {
                    setUser(newUser)
                }
            } else {
                router.replace('/login')
            }
        })

        NetInfo.fetch().then(state => {
            setIsConnected(!!state.isConnected)
        })
    }, [])

    const { width } = useWindowDimensions()
    const CONTAINER_WIDTH = Math.min(300, width - 32)

    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}
        >
            <Drawer.Screen
                options={{
                    headerShown: true,
                    drawerLabel: 'Home',
                    headerTitle: 'LightUpYourMemory',
                    headerLeft: () => (
                        <DrawerToggleButton tintColor={theme.colors.primary} />
                    ),
                    headerTitleStyle: {
                        color: theme.colors.primary,
                    },
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    }
                }}
            />

            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{ width: CONTAINER_WIDTH }}>
                    <FlatList
                        data={[
                            { name: 'Single Player', type: 'single' },
                            { name: 'Time Attack', type: 'time-attack' },
                            { name: 'versus AI', type: 'single-ai', online: true },
                            { name: 'versus Player', type: 'multiplayer', online: true },
                        ]}
                        renderItem={({ item }) => (
                            <CustomButton
                                path={`/game`}
                                disabled={!isConnected && item.online}
                                params={{ type: item.type }}
                                label={item.name} />
                        )}
                    />
                </View>
                <View style={{ height: 50 }} />
                <View style={{ width: CONTAINER_WIDTH }}>
                    <FlatList
                        data={[
                            { name: 'Leaderboards', path: 'leaderboards', online: true },
                            { name: 'Achievements', path: 'achievements', online: true },
                        ]}
                        renderItem={({ item }) => (
                            <CustomButton
                                path={`/(drawer)/${item.path}`}
                                disabled={!isConnected && item.online}
                                label={item.name} />
                        )}
                    />
                </View>
            </View>
        </View>
    )
}