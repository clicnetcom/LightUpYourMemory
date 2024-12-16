import { useTheme } from "@/useTheme"
import { useNavigation } from "expo-router"
import { useState } from "react"
import { Appbar, Menu } from "react-native-paper"

export const CustomHeader = ({
    title,
    items }: {
        title: any,
        items: {
            title: string,
            icon: string,
            action: Function
        }[]
    }) => {
    const navigation = useNavigation()
    const [menuVisible, setMenuVisible] = useState(false)
    const theme = useTheme()

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    return (
        <Appbar.Header style={{ backgroundColor: theme.colors.background }} elevated>
            <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.primary} />
            <Appbar.Content title={title} titleStyle={{ color: theme.colors.primary }} />
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<Appbar.Action icon="dots-vertical" color={theme.colors.primary} onPress={openMenu} />}
            >
                {items.map((item) => (
                    <Menu.Item
                        key={item.title}
                        leadingIcon={item.icon}
                        onPress={() => {
                            closeMenu()
                            item.action()
                        }} title={item.title} />
                ))}
            </Menu>
        </Appbar.Header>
    )
}