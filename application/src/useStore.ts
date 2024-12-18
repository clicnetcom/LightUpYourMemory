import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from 'firebase/auth'

interface State {
    isAutoTheme: boolean,
    setIsAutoTheme: (isAutoTheme: boolean) => void,
    isDarkTheme: boolean,
    setIsDarkTheme: (isDarkTheme: boolean) => void,
    currentMatch: Match | null,
    setCurrentMatch: (game: Match | null) => void,
    decks: Deck[],
    setDecks: (decks: Deck[]) => void,
    user: User | null,
    setUser: (user: User | null) => void,
    isConnected: boolean,
    setIsConnected: (isConnected: boolean) => void,
    achievements: Achievement[],
    setAchievements: (achievements: Achievement[]) => void,
}
export const useStore = create<State>()(
    persist(
        (set) => ({
            isAutoTheme: true,
            setIsAutoTheme: (isAutoTheme) => set({ isAutoTheme }),
            isDarkTheme: false,
            setIsDarkTheme: (isDarkTheme) => set({ isDarkTheme }),
            currentMatch: null,
            setCurrentMatch: (game) => set({ currentMatch: game }),
            decks: [],
            setDecks: (decks) => set({ decks }),
            user: null,
            setUser: (user) => set({ user }),
            isConnected: true,
            setIsConnected: (isConnected) => set({ isConnected }),
            achievements: [],
            setAchievements: (achievements) => set({ achievements }),
        }),
        {
            name: 'lightup-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)