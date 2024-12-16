import * as React from 'react'
import { StyleSheet } from 'react-native'

import { Button, Portal, Dialog, MD3Colors } from 'react-native-paper'

import TextComponent from './DialogTextComponent'

const ConfirmDialog = ({
    title = 'Attention!',
    content,
    isVisible,
    setIsVisible,
    confirmLabel = 'Delete',
    confirmAction,
}: {
    title?: string,
    content: string,
    isVisible: boolean
    setIsVisible: (value: boolean) => void,
    confirmLabel?: string,
    confirmAction: () => void,
}) => {
    return (
        <Portal>
            <Dialog onDismiss={() => setIsVisible(false)} visible={isVisible}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={styles.title}>{title}</Dialog.Title>
                <Dialog.Content>
                    <TextComponent>
                        {content}
                    </TextComponent>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        setIsVisible(false)
                    }} color={MD3Colors.error50}>
                        Cancel
                    </Button>
                    <Button onPress={() => {
                        confirmAction()
                        setIsVisible(false)
                    }}>{confirmLabel}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
})
export default ConfirmDialog