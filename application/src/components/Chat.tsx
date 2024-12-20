import { useTheme } from "@/useTheme"
import { useStore } from "@/useStore"
import { View, ScrollView, Image } from "react-native"
import { Text, Button, TextInput, SegmentedButtons } from "react-native-paper"
import { useEffect, useState } from "react"
import { database } from "@/firebase"
import { get, ref, update, onValue, push } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"
import DeckSelection from "./DeckSelection"


export default function Chat({ match }: { match: Match }) {
    const [user] = useStore(state => [state.user])
    const [messages, setMessages] = useState<Record<string, Message>>({})
    const [newMessage, setNewMessage] = useState('')
    const chatRef = ref(database, `matches/${match.id}/chat`)

    const sendMessage = (text: string) => {
        push(chatRef, {
            sender: user?.displayName || 'Anon',
            text: text
        })
    }

    useEffect(() => {
        const unsubscribe = onValue(chatRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                console.log('received messages', data)
                setMessages(data)
            }
        }, (error) => {
            console.error("Error watching chat:", error)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <View style={{ height: 300, borderWidth: 1, borderColor: '#ccc' }}>
            <ScrollView
                style={{
                    flex: 1,
                    padding: 10,
                    marginBottom: 10
                }}
            >
                {Object.entries(messages).map(([key, message]) => (
                    <View key={key} style={{ marginBottom: 8 }}>
                        <Text>{message.sender}</Text>
                        <Text>{message.text}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={{
                flexDirection: 'row',
                padding: 10,
                borderTopWidth: 1,
                borderColor: '#ccc'
            }}>
                <TextInput
                    style={{ flex: 1, marginRight: 8 }}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    onSubmitEditing={() => {
                        if (newMessage.trim()) {
                            sendMessage(newMessage)
                            setNewMessage('')
                        }
                    }}
                />
                <Button
                    mode="contained"
                    onPress={() => {
                        if (newMessage.trim()) {
                            sendMessage(newMessage)
                            setNewMessage('')
                        }
                    }}
                >
                    Send
                </Button>
            </View>
        </View>
    )
}