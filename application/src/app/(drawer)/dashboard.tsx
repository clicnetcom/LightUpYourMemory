import { database } from "@/firebase"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { get, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { ActivityIndicator, Text, DataTable, Avatar } from "react-native-paper"

export default function Dashboard() {

    const theme = useTheme()

    const user = useStore(state => state.user)

    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    const [users, setUsers] = useState([])

    useEffect(() => {
        get(ref(database, 'users')).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                const users = Object.values(data).map((user: any, index) => {
                    user.id = Object.keys(data)[index]
                    return user
                })
                setUsers(users)
            }
        }).catch((error) => {
            console.error("Error fetching users:", error)
        })

    }, [])

    useEffect(() => {
        const userRef = ref(database, `users/${user?.uid}/isAdmin`)
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                console.log('isAdmin?', data)
                setIsAdmin(data)
                setIsLoading(false)
            }
        })
    }, [])
    console.log('users', users)

    if (isLoading) {
        return (
            <View style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        )
    }

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
                padding: 16,
            }}
        >
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Photo</DataTable.Title>
                        <DataTable.Title>Email</DataTable.Title>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Id</DataTable.Title>
                        <DataTable.Title numeric>Admin</DataTable.Title>
                        <DataTable.Title numeric>Plays</DataTable.Title>
                    </DataTable.Header>
                    {users.map((user: any, index: number) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>
                                {user.photo &&
                                    <Avatar.Image size={50} source={{ uri: user.photoURL }} style={{ marginBottom: 8 }} />
                                }
                                {!user.photo &&
                                    <Avatar.Icon size={50} icon={"account"} style={{ marginBottom: 8 }} />
                                }
                            </DataTable.Cell>
                            <DataTable.Cell>{user.email || 'N/A'}</DataTable.Cell>
                            <DataTable.Cell>{user.name || 'N/A'}</DataTable.Cell>
                            <DataTable.Cell>{user.id || 'N/A'}</DataTable.Cell>
                            <DataTable.Cell numeric>
                                {user.isAdmin ? 'Yes' : 'No'}
                            </DataTable.Cell>

                            <DataTable.Cell numeric>
                                {user.stats?.plays || 0}
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </ScrollView>
        </View>
    )
}