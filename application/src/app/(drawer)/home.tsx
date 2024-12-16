import { FlatList, View } from "react-native"
import { useStore } from '@/useStore'
import CustomButton from "@/components/CustomButton"
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from "@react-navigation/drawer"
import { useTheme } from "@/useTheme"
import { useEffect } from "react"

export default function HomePage() {
    const theme = useTheme()
    const setCurrentGame = useStore(state => state.setCurrentGame)
    const decks: Deck[] = [
        {
            id: 'emojis',
            title: 'Emojis',
            description: 'A deck of emojis',
            cards: [
                '😀', '❤️', '🎮', '🌟', '🎨',
                '🎵', '🎪', '🎯', '🎲', '🎭',
            ]
        },
        {
            id: 'easy',
            title: 'Easy',
            description: 'For testing only',
            cards: [
                '😀', '❤️', '🎮'
            ]
        },
        {
            id: 'numbers',
            title: 'Numbers',
            description: 'A deck of numbers',
            cards: [
                '1', '2', '3', '4', '5',
                '6', '7', '8', '9', '10'
            ]
        },
        {
            id: 'animals',
            title: 'Animals',
            description: 'A deck of animals',
            cards: [
                'https://picsum.photos/200',
                'https://picsum.photos/205',
                'https://picsum.photos/210',
                'https://picsum.photos/215',
                'https://picsum.photos/220',
                'https://picsum.photos/225',

            ]
        },
        {
            id: 'verbs',
            title: 'Verbs',
            description: 'A deck of verbs',
            cards: [
                'run', 'jump', 'swim', 'fly', 'walk',
                'sing', 'dance', 'read', 'write', 'paint'
            ]
        }
    ]

    const setDecks = useStore(state => state.setDecks)
    useEffect(() => {
        console.log('setting decks')
        setDecks(decks)

    }, [])

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
                    { name: 'Single Player', type: 'single' },
                    { name: 'Time Attack', type: 'time-attack' },
                    { name: 'versus AI', type: 'single-ai' },
                    { name: 'versus Player', type: 'multiplayer' },
                ]}
                renderItem={({ item }) => (
                    <CustomButton
                        path={`/game`}
                        params={{ type: item.type }}
                        label={item.name} />
                )}
            />
        </View>
    )
}