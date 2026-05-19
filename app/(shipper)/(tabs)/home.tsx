import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import Octicons from '@expo/vector-icons/Octicons';
import { OrderCard_ForDriver } from "../../../components/features/OrderCard";
import { router } from "expo-router";
import { mock_odercard } from "../../../mock/shipper";

export default function ShipperHomePage() {
    const [status, setStatus] = useState('Online');
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={{ uri: 'https://cdn.pixabay.com/photo/2021/05/03/04/18/uber-6225185_1280.jpg' }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                    <View>
                        <Text style={{ color: 'white' }}>Hello!</Text>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Nguyễn Văn A</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.statusbutton} onPress={() => setStatus(status === 'Online' ? 'Offline' : 'Online')}>
                    {status === 'Online' && <Octicons name="dot-fill" size={20} color="green" />}
                    {status === 'Offline' && <Octicons name="dot" size={20} color="red" />}
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{status}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 20, padding: 20 }}>
                {mock_odercard.some(item => item.status === 'PENDING') &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Đang chờ xử lý</Text>
                        <View style={{ flexDirection: 'column', gap: 20 }}>
                            {mock_odercard.map((item, index) => item.status === 'PENDING' && <OrderCard_ForDriver key={index} {...item} onView={() => router.push('/orderdetail')} />)}
                        </View>
                    </View>}

                {mock_odercard.some(item => item.status === 'READY') &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Sẵn sàng giao hàng</Text>
                        <View style={{ flexDirection: 'column', gap: 20 }}>
                            {mock_odercard.map((item, index) => item.status === 'READY' && <OrderCard_ForDriver key={index} {...item} onView={() => router.push('/orderdetail')} />)}
                        </View>
                    </View>}
                {mock_odercard.some(item => item.status === 'DELIVERING') &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Đang giao hàng</Text>
                        <View style={{ flexDirection: 'column', gap: 20 }}>
                            {mock_odercard.map((item, index) => item.status === 'DELIVERING' && <OrderCard_ForDriver key={index} {...item} onView={() => router.push('/orderdetail')} />)}
                        </View>
                    </View>}
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
        paddingHorizontal: 20,
        gap: 8,
    },
    statusbutton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 35,
        backgroundColor: 'white',
        borderRadius: 90
    },
    ordercard_container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden'
    }
});