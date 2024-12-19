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


    const chatRef = ref(database, `matches/${match.id}/chat`)

    const [messages, setMessages] = useState([])

    const sendMessage = (message: string) => {
        push(chatRef, message)
    }


    useEffect(() => {
        const unsubscribe = onValue(chatRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                console.log('received messages', data)
                // setMessages(data)
            }
        }, (error) => {
            console.error("Error watching chat:", error)
        })

        return () => {
            unsubscribe()
        }
    }, [])


    // messages.map

    //single input with send message on enter

    return <div>Chat</div>





}