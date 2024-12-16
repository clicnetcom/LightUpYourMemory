import { FlatList, View } from "react-native"
import { useStore } from '@/useStore'
import CustomButton from "@/components/CustomButton"
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from "@react-navigation/drawer"
import { useTheme } from "@/useTheme"

export default function HomePage() {
    const theme = useTheme()

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
            <FlatList
                style={{ backgroundColor: theme.colors.background, flexGrow: 1 }}
                data={[
                    { name: 'Single Player', path: 'single' },
                    { name: 'Time Attack', path: 'time-attack' },
                    { name: 'versus AI', path: 'single-ai' },
                    { name: 'versus Player', path: 'multiplayer' },
                ]}
                renderItem={({ item }) => (
                    <CustomButton
                        path={`/game/${item.path}`}
                        label={item.name} />
                )}
            />
        </View>
    )
}