import { FlatList, View, useWindowDimensions } from "react-native"
import { useStore } from '@/useStore'
import CustomButton from "@/components/CustomButton"
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from "@react-navigation/drawer"
import { useTheme } from "@/useTheme"
import { useEffect } from "react"
import { auth } from "@/firebase"
import { router } from "expo-router"

export default function HomePage() {
    const theme = useTheme()
    const setCurrentGame = useStore(state => state.setCurrentGame)
    const decks: Deck[] = [
        {
            id: 'emojis',
            title: 'Emojis',
            description: 'A deck of emojis',
            type: 'string',
            cards: [
                '😀', '❤️', '🎮', '🌟', '🎨',
                '🎵', '🎪', '🎯', '🎲', '🎭',
            ]
        },
        {
            id: 'flags',
            title: 'Flags',
            description: 'A deck of flags',
            type: 'image',
            cards: ['https://flagsapi.com/BR/flat/64.png',
                'https://flagsapi.com/US/flat/64.png',
                'https://flagsapi.com/FR/flat/64.png',
                'https://flagsapi.com/BE/flat/64.png',
                'https://flagsapi.com/DE/flat/64.png',],
        },
        {
            id: 'easy',
            title: 'Easy',
            description: 'For testing only',
            type: 'string',
            cards: [
                '😀', '❤️', '🎮'
            ]
        },
        {
            id: 'numbers',
            title: 'Numbers',
            description: 'A deck of numbers',
            type: 'string',
            cards: [
                '1', '2', '3', '4', '5',
                '6', '7', '8', '9', '10'
            ]
        },
        {
            id: 'animals',
            title: 'Animals',
            description: 'A deck of animals',
            type: 'image',
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
            type: 'string',
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



        auth.onAuthStateChanged((user) => {
            console.log('user', user)
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/v8/firebase.User
                var uid = user.uid
                // ...
            } else {
                router.replace('/login')
            }
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
            </View>
        </View>
    )
}