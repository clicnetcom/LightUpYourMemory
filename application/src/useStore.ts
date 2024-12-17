import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { User } from 'firebase/auth'

interface State {
    isAutoTheme: boolean,
    setIsAutoTheme: (isAutoTheme: boolean) => void,
    isDarkTheme: boolean,
    setIsDarkTheme: (isDarkTheme: boolean) => void,
    currentGame: Game | null,
    setCurrentGame: (game: Game | null) => void,
    decks: Deck[],
    setDecks: (decks: Deck[]) => void,
    user: User | null,
    setUser: (user: User | null) => void,
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
                decks: [],
                setDecks: (decks) => set({ decks }),
                user: null,
                setUser: (user) => set({ user }),
            }),
            {
                name: 'main-state',
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
)