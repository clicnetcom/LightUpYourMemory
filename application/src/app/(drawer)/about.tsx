import { useTheme } from "@/useTheme"
import { View, ScrollView, StyleSheet } from "react-native"
import { Text, Card, List } from "react-native-paper"

export default function About() {
    const theme = useTheme()

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            flex: 1,
            padding: 16,
        },
        section: {
            marginBottom: 24,
        }
    })

    return (
        <View style={styles.container}>
            <ScrollView>
                <Card style={styles.section}>
                    <Card.Content>
                        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Version 1.0</Text>
                        <List.Section>
                            <List.Item title="Frontend" description="React Native with expo" />
                            <List.Item title="Backend" description="Firebase BaaS" />
                            <List.Item title="Database" description="Firestore" />
                            <List.Item title="Storage" description="Firebase Storage" />
                            <List.Item title="Authentication" description="Firebase Auth" />
                            <List.Item title="State Management" description="Zustand" />
                            <List.Item title="Styling" description="react-native-paper" />
                            <List.Item title="Routing" description="expo-router" />
                            <List.Item title="Internationalization" description="react-i18next" />
                        </List.Section>
                    </Card.Content>
                </Card>

                <Card style={styles.section}>
                    <Card.Content>
                        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Version 2.0</Text>
                        <List.Section>
                            <List.Item title="Testing" description="Jest" />
                            <List.Item title="CI/CD" description="GitHub Actions" />
                            <List.Item title="More animations" />
                            <List.Item title="Notifications for achievements" />
                            <List.Item title="Image caching" />
                            <List.Item title="More logic on the backend" />
                        </List.Section>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    )
}