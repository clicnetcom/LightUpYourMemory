import { FlatList, View, useWindowDimensions, ScrollView } from "react-native"
import { useStore } from '@/useStore'
import CustomButton from "@/components/CustomButton"
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from "@react-navigation/drawer"
import { useTheme } from "@/useTheme"
import Logo from "@/components/Logo"
import { useTranslation } from 'react-i18next'

export default function HomePage() {
    const theme = useTheme()
    const { t } = useTranslation()
    const [isConnected] = useStore(state => [state.isConnected])
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
                    drawerLabel: 'LightUpYourMemory',
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

            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 32
            }}>
                <Logo />
                <View style={{ width: CONTAINER_WIDTH }}>
                    <FlatList
                        data={[
                            { name: t('home.modes.singlePlayer'), type: 'single' },
                            { name: t('home.modes.timeAttack'), type: 'time-attack' },
                            { name: t('home.modes.versusAI'), type: 'single-ai' },
                            { name: t('home.modes.versusPlayer'), type: 'multiplayer', online: true },
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
                            { name: t('home.features.leaderboards'), path: 'leaderboards', online: true },
                            { name: t('home.features.achievements'), path: 'achievements', online: true },
                        ]}
                        renderItem={({ item }) => (
                            <CustomButton
                                path={`/(drawer)/${item.path}`}
                                disabled={!isConnected && item.online}
                                label={item.name} />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}