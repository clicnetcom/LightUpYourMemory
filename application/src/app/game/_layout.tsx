import { useTheme } from "@/useTheme"
import { Stack } from "expo-router"

export default function ExerciseLayout() {
    const theme = useTheme()

    return (<Stack
        screenOptions={{
            headerTitleStyle: {
                color: theme.colors.primary,
            },
            headerStyle: {
                backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.primary,
        }}
    />)
}