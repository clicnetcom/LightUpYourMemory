import React, { useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Drawer, Switch, TouchableRipple, Text, Button } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { useStore } from '@/useStore'
import ConfirmDialog from './ConfirmDialog'
import { router } from 'expo-router'

const CustomDrawerContent = (props: any) => {
    const isAutoTheme = useStore(state => state.isAutoTheme)
    const setIsAutoTheme = useStore(state => state.setIsAutoTheme)

    const isDarkTheme = useStore(state => state.isDarkTheme)
    const setIsDarkTheme = useStore(state => state.setIsDarkTheme)

    const state = useStore()

    return (
        <DrawerContentScrollView {...props}>
            <Drawer.Section >
                <DrawerItemList {...props} />
            </Drawer.Section>

            {__DEV__ &&
                <Drawer.Section >
                    <View style={[styles.preference]}>
                        <Button
                            mode="outlined"
                            onPress={() => {
                                console.log('state', JSON.stringify(state))
                            }}  >
                            <Text variant="labelLarge">Print State</Text>
                        </Button>
                    </View>
                </Drawer.Section>
            }


            <TouchableRipple onPress={() => setIsAutoTheme(!isAutoTheme)}>
                <View style={[styles.preference]}>
                    <Text variant="labelLarge">Auto Theme</Text>
                    <View pointerEvents="none">
                        <Switch value={isAutoTheme} />
                    </View>
                </View>
            </TouchableRipple>

            {!isAutoTheme &&
                <TouchableRipple onPress={() => setIsDarkTheme(!isDarkTheme)}>
                    <View style={[styles.preference]}>
                        <Text variant="labelLarge">Dark Theme</Text>
                        <View pointerEvents="none">
                            <Switch value={isDarkTheme} />
                        </View>
                    </View>
                </TouchableRipple>
            }

        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    v3Preference: {
        height: 56,
        paddingHorizontal: 28,
    },
    badge: {
        alignSelf: 'center',
    },
    collapsedSection: {
        marginTop: 16,
    },
    annotation: {
        marginHorizontal: 24,
        marginVertical: 6,
    },
})


export default CustomDrawerContent
