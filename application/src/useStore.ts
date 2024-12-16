import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

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
    }
]

interface State {
    isAutoTheme: boolean,
    setIsAutoTheme: (isAutoTheme: boolean) => void,
    isDarkTheme: boolean,
    setIsDarkTheme: (isDarkTheme: boolean) => void,
    currentGame: Game | null,
    setCurrentGame: (game: Game | null) => void,
    decks: Deck[],
}
export const useStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isAutoTheme: true,
                setIsAutoTheme: (isAutoTheme) => set({ isAutoTheme }),
                isDarkTheme: false,
                setIsDarkTheme: (isDarkTheme) => set({ isDarkTheme }),
                currentGame: null,
                setCurrentGame: (game) => set({ currentGame: game }),
                decks,
            }),
            {
                name: 'main-state',
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
)