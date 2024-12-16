import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface State {
    isAutoTheme: boolean,
    setIsAutoTheme: (isAutoTheme: boolean) => void,
    isDarkTheme: boolean,
    setIsDarkTheme: (isDarkTheme: boolean) => void,
}
export const useStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isAutoTheme: true,
                setIsAutoTheme: (isAutoTheme) => set({ isAutoTheme }),
                isDarkTheme: false,
                setIsDarkTheme: (isDarkTheme) => set({ isDarkTheme }),
            }),
            {
                name: 'main-state',
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
)