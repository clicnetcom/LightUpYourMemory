import achievements from "@/app/(drawer)/achievements"
import { useStore } from "@/useStore"
import { useTheme } from "@/useTheme"
import { View, ScrollView, Image } from "react-native"
import { Text, Button } from "react-native-paper"
import { useEffect, useState } from "react"
import { database } from "@/firebase"
import { get, ref } from "firebase/database"
import { FlatList } from "react-native-gesture-handler"


export default function Matchmaking() {

    const theme = useTheme()
    const user = useStore(state => state.user)


    const [activeTab, setActiveTab] = useState('join')


    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    mode={activeTab === 'join' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('join')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Join
                </Button>
                <Button
                    mode={activeTab === 'create' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('create')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Create
                </Button>
            </View>
            {activeTab === 'join' && (<Text>Join</Text>)}
            {activeTab === 'create' && (<Text>Create</Text>)}



        </View>
    )
}