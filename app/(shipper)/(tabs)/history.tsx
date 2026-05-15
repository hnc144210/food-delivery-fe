import { Text, View, StyleSheet, ScrollView } from "react-native";
import { OrderCardHistory_ForDriver } from "../../../components/features/OrderCard";
import { router } from "expo-router";
import { mock_odercard } from "../../../mock/shipper";

export default function HistoryPage() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Lịch sử giao hàng</Text>
            </View>
            <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingTop: 20 }}>
                {mock_odercard.map((item, index) => (item.status === 'DELIVERED' || item.status === 'CANCELLED') && <OrderCardHistory_ForDriver key={index} {...item} onView={() => router.push({ pathname: '/historydetail', params: { item: JSON.stringify(item) } })} />)}
            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EE4D2D',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 30,
        gap: 8,
    }
});