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
    const theme = useTheme()
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

    const getMessageAlignment = (senderName: string) => {
        if (senderName === 'system') return 'center'
        if (senderName === (match.p1.name || 'Anon')) return 'flex-start'
        if (senderName === (match.p2.name || 'Anon')) return 'flex-end'
        return 'flex-start'
    }

    const getMessageStyle = (senderName: string) => {
        if (senderName === 'system') {
            return {
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 8,
                maxWidth: '90%',
            }
        }

        const isPlayer2 = senderName === (match.p2.name || 'Anon')
        return {
            backgroundColor: isPlayer2 ? theme.colors.primary : theme.colors.secondaryContainer,
            borderRadius: 16,
            borderBottomLeftRadius: isPlayer2 ? 16 : 4,
            borderBottomRightRadius: isPlayer2 ? 4 : 16,
            maxWidth: '80%',
        }
    }

    const getTextColor = (senderName: string) => {
        if (senderName === 'system') return theme.colors.onSurfaceVariant
        return senderName === (match.p2.name || 'Anon')
            ? theme.colors.onPrimary
            : theme.colors.onSecondaryContainer
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
        <View style={{ height: 300, borderWidth: 1, borderColor: theme.colors.outline, borderRadius: 8 }}>
            <ScrollView
                style={{
                    flex: 1,
                    padding: 10,
                    marginBottom: 10
                }}
                contentContainerStyle={{ paddingBottom: 10 }}
            >
                {Object.entries(messages).map(([key, message]) => (
                    <View key={key} style={{
                        marginBottom: 8,
                        alignItems: getMessageAlignment(message.sender),
                    }}>
                        <View style={{
                            padding: 12,
                            ...getMessageStyle(message.sender)
                        }}>
                            <Text style={{
                                fontSize: 12,
                                color: getTextColor(message.sender),
                                marginBottom: 2,
                                fontWeight: 'bold',
                                textAlign: message.sender === 'system' ? 'center' : 'left'
                            }}>{message.sender}</Text>
                            <Text style={{
                                color: getTextColor(message.sender),
                                textAlign: message.sender === 'system' ? 'center' : 'left'
                            }}>{message.text}</Text>
                            {message.timestamp && (
                                <Text style={{
                                    fontSize: 10,
                                    color: getTextColor(message.sender),
                                    opacity: 0.7,
                                    marginTop: 4,
                                    alignSelf: message.sender === 'system' ? 'center' : 'flex-end'
                                }}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={{
                flexDirection: 'row',
                padding: 10,
                borderTopWidth: 1,
                borderColor: theme.colors.outline,
                backgroundColor: theme.colors.background,
            }}>
                <TextInput
                    style={{
                        flex: 1,
                        marginRight: 8,
                        backgroundColor: theme.colors.surface,
                    }}
                    mode="outlined"
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