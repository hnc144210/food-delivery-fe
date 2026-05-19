import { StyleSheet, Text, View } from "react-native";

export default function NotificationScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', color: 'white' }}>Thông báo</Text>
            </View>
            <View style={styles.body}>
                <Text>Notification Screen</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F6F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#EE4D2D',
        width: '100%',
        gap: 10
    },
    body: {
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        padding: 20,
    },
});