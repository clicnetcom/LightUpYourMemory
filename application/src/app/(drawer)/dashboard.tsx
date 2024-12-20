import { database } from "@/firebase"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { get, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { Text } from "react-native-paper"

export default function Dashboard() {

    const theme = useTheme()

    const user = useStore(state => state.user)

    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const userRef = ref(database, `users/${user?.uid}/isAdmin`)
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                console.log('isAdmin?', data)
                setIsAdmin(data)
            }
        })
    }, [])


    if (!isAdmin) {
        return (
            <View style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}>
                <Text variant="headlineMedium" style={{ marginBottom: 12 }}>
                    Access Restricted
                </Text>
                <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
                    Sorry, this area is only accessible to administrators.
                </Text>
            </View>
        )
    }


    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}
        >

            <ScrollView>

                <Text variant="headlineMedium">
                    about the application
                </Text>

            </ScrollView>
        </View>
    )
}