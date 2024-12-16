

import React from 'react'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Button, Icon, MD3Theme, useTheme } from 'react-native-paper'

export default function CustomButton({
    path,
    params,
    onPress,
    label,
    icon,
    disabled = false,
    buttonStyle = {}
}: {
    path?: string,
    params?: any,
    onPress?: Function,
    label: string,
    icon?: string,
    disabled?: boolean,
    buttonStyle?: any
}) {

    const theme = useTheme()
    const styles = getStyles(theme)

    return (
        <Button
            disabled={disabled}
            icon={() => <Icon
                color={theme.colors.onPrimary}
                source={icon}
                size={34}
            />}
            mode="contained"
            onPress={() => {
                if (onPress) {
                    onPress()
                }
                if (path && params) {
                    router.push({ pathname: path, params: params })
                } else if (path) {
                    router.push(path)
                }
            }}
            style={[styles.button, buttonStyle]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
        >
            {label}
        </Button >
    )
}
const getStyles = (theme: MD3Theme) => StyleSheet.create({
    button: {
        marginVertical: 8,
        marginHorizontal: 16,
    },

    buttonContent: {
        justifyContent: 'center',
        flexDirection: 'row-reverse',

    },
    buttonLabel: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 18,
        paddingVertical: 12,
        width: '80%',
    },
})
