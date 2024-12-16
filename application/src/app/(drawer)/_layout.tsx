import { useTheme } from '@/useTheme'
import { Drawer } from 'expo-router/drawer'
import CustomDrawerContent from '@/components/DrawerContent'
import { DrawerToggleButton } from '@react-navigation/drawer'

export default function AppLayout() {

    const theme = useTheme()

    const screens = [
        {
            name: 'home',
            drawerLabel: 'Home',
            headerTitle: 'LightUpYourMemory',
            headerShown: false
        },
        {
            name: 'about',
            drawerLabel: 'About the Application',
            headerTitle: 'About the Application',
            headerShown: true
        }
    ]
    const hiddenScreens: string[] = []

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    height: 80
                },
                headerTitleStyle: {
                    color: theme.colors.primary,
                },
                drawerStyle: {
                    backgroundColor: theme.colors.background,
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.primary,
            }}>

            {screens.map(s => (
                <Drawer.Screen
                    key={s.name}
                    name={s.name}
                    options={{
                        headerShown: s.headerShown,
                        drawerLabel: s.drawerLabel,
                        headerTitle: s.headerTitle,
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
            ))}

            {hiddenScreens.map(s => (
                <Drawer.Screen
                    key={s}
                    name={s}
                    options={{
                        drawerItemStyle: {
                            display: 'none'
                        }
                    }}
                />
            ))}

        </Drawer>
    )
}