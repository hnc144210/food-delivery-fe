import { useRouter } from "expo-router";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from "react";

export default function ShipperTopUp() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<'VNPAY' | 'MOMO'>('VNPAY');

    const handleTopUp = () => {
        // Just UI actions as requested
        alert("Đang chuyển hướng thanh toán...");
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header matching historydetail.tsx */}
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Nạp tiền</Text>
            </View>

            <ScrollView style={{ width: '100%', height: '100%', padding: 20 }} contentContainerStyle={{ rowGap: 20 }}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.titleText}>Nạp tiền vào ví</Text>
                    <Text style={styles.subtitleText}>Nạp thêm tiền vào tài khoản tài xế để nhận nhiều đơn hàng hơn.</Text>
                </View>

                {/* Amount Input Card */}
                <View style={styles.smallcontainer}>
                    <Text style={styles.sectionLabel}>SỐ TIỀN NẠP</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="Nhập số tiền"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <Text style={styles.currencySuffix}>đ</Text>
                    </View>
                    
                    {/* Quick amount options */}
                    <View style={styles.quickAmounts}>
                        {['50000', '100000', '200000', '500000'].map((val) => (
                            <TouchableOpacity
                                key={val}
                                style={styles.quickBtn}
                                onPress={() => setAmount(val)}
                            >
                                <Text style={styles.quickBtnText}>
                                    {parseInt(val).toLocaleString('vi-VN')}đ
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Payment Methods Card */}
                <View style={styles.smallcontainer}>
                    <Text style={[styles.sectionLabel, { marginBottom: 5 }]}>PHƯƠNG THỨC THANH TOÁN</Text>
                    
                    {/* VNPay Option */}
                    <TouchableOpacity 
                        style={[styles.paymentOption, paymentMethod === 'VNPAY' && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod('VNPAY')}
                    >
                        <View style={styles.paymentLeft}>
                            <View style={[styles.paymentIconContainer, { backgroundColor: '#005baa' }]}>
                                <Ionicons name="card" size={22} color="white" />
                            </View>
                            <View>
                                <Text style={styles.paymentName}>Cổng thanh toán VNPay</Text>
                                <Text style={styles.paymentDesc}>Thanh toán qua ngân hàng nội địa/QR</Text>
                            </View>
                        </View>
                        <Ionicons 
                            name={paymentMethod === 'VNPAY' ? "radio-button-on" : "radio-button-off"} 
                            size={22} 
                            color={paymentMethod === 'VNPAY' ? "#EE4D2D" : "#bbb"} 
                        />
                    </TouchableOpacity>

                    {/* MoMo Option */}
                    <TouchableOpacity 
                        style={[styles.paymentOption, paymentMethod === 'MOMO' && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod('MOMO')}
                    >
                        <View style={styles.paymentLeft}>
                            <View style={[styles.paymentIconContainer, { backgroundColor: '#a50064' }]}>
                                <Ionicons name="wallet" size={22} color="white" />
                            </View>
                            <View>
                                <Text style={styles.paymentName}>Ví điện tử MoMo</Text>
                                <Text style={styles.paymentDesc}>Liên kết ví nhanh chóng, an toàn</Text>
                            </View>
                        </View>
                        <Ionicons 
                            name={paymentMethod === 'MOMO' ? "radio-button-on" : "radio-button-off"} 
                            size={22} 
                            color={paymentMethod === 'MOMO' ? "#EE4D2D" : "#bbb"} 
                        />
                    </TouchableOpacity>
                </View>

                {/* Action button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleTopUp}>
                    <Text style={styles.submitButtonText}>Xác nhận nạp tiền</Text>
                </TouchableOpacity>

                <View style={{ height: 80 }} />
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
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    smallcontainer: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 14,
        padding: 20,
        gap: 12,
    },
    titleSection: {
        paddingHorizontal: 5,
        gap: 4,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitleText: {
        fontSize: 14,
        color: 'gray',
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'gray',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        padding: 0,
    },
    currencySuffix: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    quickAmounts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    quickBtn: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    quickBtnText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#555',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    paymentOptionActive: {
        borderColor: '#EE4D2Defe',
        backgroundColor: '#fffdfc',
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentDesc: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
    submitButton: {
        backgroundColor: '#EE4D2D',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EE4D2D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
