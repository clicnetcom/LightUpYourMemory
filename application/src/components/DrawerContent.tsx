import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Drawer, Switch, TouchableRipple, Text, Button, Avatar } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { useStore } from '@/useStore'
import { auth } from '@/firebase'
import { router } from 'expo-router'

export default function CustomDrawerContent(props: any) {
    const user = useStore(state => state.user)

    const isAutoTheme = useStore(state => state.isAutoTheme)
    const setIsAutoTheme = useStore(state => state.setIsAutoTheme)
    const setUser = useStore(state => state.setUser)

    const isDarkTheme = useStore(state => state.isDarkTheme)
    const setIsDarkTheme = useStore(state => state.setIsDarkTheme)

    const handleLogout = async () => {
        setUser(null)
        try {
            await auth.signOut()
            router.replace('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }
    const state = useStore()

    return (
        <View style={styles.drawerContent}>
            <DrawerContentScrollView {...props}>
                <View style={styles.userInfoSection}>
                    {user?.photoURL &&
                        <Avatar.Image size={50} source={{ uri: user.photoURL }} style={{ marginBottom: 8 }} />
                    }
                    {!user?.photoURL &&
                        <Avatar.Icon size={50} icon={"account"} style={{ marginBottom: 8 }} />
                    }
                    <Text variant="titleMedium">{user?.displayName || "User"}</Text>
                    <Text variant="bodySmall">{user?.email}</Text>
                </View>
                <Drawer.Section >
                    <DrawerItemList {...props} />
                </Drawer.Section>

                {/* {__DEV__ &&
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
                } */}

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

            <Drawer.Section style={styles.bottomDrawerSection}>
                <Button
                    icon="logout"
                    mode="outlined"
                    onPress={handleLogout}
                    style={{ margin: 16 }}
                >
                    Logout
                </Button>
            </Drawer.Section>
        </View>
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
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    userInfoSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f4',
        alignItems: 'center'
    },
})
