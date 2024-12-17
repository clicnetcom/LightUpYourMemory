import { useTheme } from "@/useTheme"
import { View, ScrollView } from "react-native"
import { Text, Button } from "react-native-paper"
import { useState } from "react"

function WinsTab() {
    return (
        <ScrollView>
            <Text variant="bodyLarge">Wins Leaderboard Content</Text>
        </ScrollView>
    )
}

function LossesTab() {
    return (
        <ScrollView>
            <Text variant="bodyLarge">Losses Leaderboard Content</Text>
        </ScrollView>
    )
}

function TimeAttackTab() {
    return (
        <ScrollView>
            <Text variant="bodyLarge">Time Attack Leaderboard Content</Text>
        </ScrollView>
    )
}

export default function Leaderboards() {
    const theme = useTheme()
    const [activeTab, setActiveTab] = useState('wins')

    const renderContent = () => {
        switch (activeTab) {
            case 'losses': return <LossesTab />
            case 'timeAttack': return <TimeAttackTab />
            default: return <WinsTab />
        }
    }

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    mode={activeTab === 'wins' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('wins')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Wins
                </Button>
                <Button
                    mode={activeTab === 'losses' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('losses')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Losses
                </Button>
                <Button
                    mode={activeTab === 'timeAttack' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('timeAttack')}
                    style={{ flex: 1, borderRadius: 0 }}
                >
                    Time
                </Button>
            </View>
            {renderContent()}
        </View>
    )
}