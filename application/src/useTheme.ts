import { useColorScheme } from "react-native"
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper"
import { useStore } from "@/useStore"
import { StatusBarStyle } from "expo-status-bar"

export const useThemeMode = (): StatusBarStyle => {
    const [isAutoTheme, isDarkTheme] = useStore((state) => [state.isAutoTheme, state.isDarkTheme])
    const colorScheme = useColorScheme()
    if (isAutoTheme) {
        return colorScheme || "light"
    }
    return isDarkTheme ? "dark" : "light"
}

export const useInvertedThemeMode = (): StatusBarStyle => {
    const themeMode = useThemeMode()
    return themeMode === 'light' ? 'dark' : 'light'
}

export const useTheme = () => {
    return (useThemeMode() === 'light') ? lightTheme : darkTheme
}

const lightTheme = {
    ...MD3LightTheme,
    myOwnProperty: true,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#4A90E2",
        onPrimary: "#FFFFFF",
        primaryContainer: "#E3F2FD",
        onPrimaryContainer: "#1A237E",
        secondary: "#66BB6A",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#E8F5E9",
        onSecondaryContainer: "#1B5E20",
        tertiary: "#7E57C2",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#EDE7F6",
        onTertiaryContainer: "#311B92",
        error: "#F44336",
        onError: "#FFFFFF",
        errorContainer: "#FFEBEE",
        onErrorContainer: "#B71C1C",
        background: "#FAFAFA",
        onBackground: "#212121",
        surface: "#FFFFFF",
        onSurface: "#212121",
        surfaceVariant: "#F5F5ff",
        onSurfaceVariant: "#616161",
        outline: "#BDBDBD",
        outlineVariant: "#E0E0E0",
        shadow: "rgba(0, 0, 0, 0.1)",
        scrim: "rgba(0, 0, 0, 0.3)",
        inverseSurface: "#212121",
        inverseOnSurface: "#FFFFFF",
        inversePrimary: "#90CAF9",
        elevation: {
            level0: "transparent",
            level1: "#FFFFFF",
            level2: "#F5F5F5",
            level3: "#EEEEEE",
            level4: "#E0E0E0",
            level5: "#BDBDBD",
        },
        surfaceDisabled: "rgba(32, 26, 24, 0.12)",
        onSurfaceDisabled: "rgba(32, 26, 24, 0.38)",
        backdrop: "rgba(59, 45, 41, 0.4)",
    },
}

const darkTheme = {
    ...MD3DarkTheme,
    myOwnProperty: true,
    colors: {
        ...MD3DarkTheme.colors,
        primary: "#90CAF9",
        onPrimary: "#0D47A1",
        primaryContainer: "#1976D2",
        onPrimaryContainer: "#E3F2FD",
        secondary: "#81C784",
        onSecondary: "#1B5E20",
        secondaryContainer: "#2E7D32",
        onSecondaryContainer: "#E8F5E9",
        tertiary: "#B39DDB",
        onTertiary: "#311B92",
        tertiaryContainer: "#512DA8",
        onTertiaryContainer: "#EDE7F6",
        error: "#EF5350",
        onError: "#B71C1C",
        errorContainer: "#C62828",
        onErrorContainer: "#FFEBEE",
        background: "#121212",
        onBackground: "#EEEEEE",
        surface: "#1E1E1E",
        onSurface: "#EEEEEE",
        surfaceVariant: "#2C2C2C",
        onSurfaceVariant: "#BDBDBD",
        outline: "#757575",
        outlineVariant: "#424242",
        shadow: "rgba(0, 0, 0, 0.2)",
        scrim: "rgba(0, 0, 0, 0.4)",
        inverseSurface: "#FFFFFF",
        inverseOnSurface: "#212121",
        inversePrimary: "#1976D2",
        elevation: {
            level0: "transparent",
            level1: "#242424",
            level2: "#282828",
            level3: "#2C2C2C",
            level4: "#323232",
            level5: "#383838",
        },
        surfaceDisabled: "rgba(237, 224, 221, 0.12)",
        onSurfaceDisabled: "rgba(237, 224, 221, 0.38)",
        backdrop: "rgba(59, 45, 41, 0.4)",
    },
}