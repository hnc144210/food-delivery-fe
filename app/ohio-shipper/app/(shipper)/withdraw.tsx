import { useRouter } from "expo-router";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from "react";

export default function ShipperWithdrawal() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [withdrawalMethod, setWithdrawalMethod] = useState<'MOMO' | 'BANK'>('BANK');

    const handleWithdrawal = () => {
        // Just UI actions as requested
        alert("Đang thực hiện yêu cầu rút tiền...");
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header matching historydetail.tsx */}
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Rút tiền</Text>
            </View>

            <ScrollView style={{ width: '100%', height: '100%', padding: 20 }} contentContainerStyle={{ rowGap: 20 }}>
                
                {/* Available Balance Card */}
                <View style={[styles.smallcontainer, styles.balanceCard]}>
                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>SỐ DƯ KHẢ DỤNG</Text>
                        <Text style={styles.balanceValue}>500.000đ</Text>
                    </View>
                    <View style={styles.cardBlurDecorator} />
                </View>

                {/* Input Amount Section */}
                <View style={styles.smallcontainer}>
                    <Text style={styles.sectionLabel}>SỐ TIỀN MUỐN RÚT</Text>
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
                    <Text style={styles.inputHint}>Hạn mức rút tối thiểu: 50.000đ</Text>
                </View>

                {/* Withdrawal Methods */}
                <View style={styles.smallcontainer}>
                    <Text style={[styles.sectionLabel, { marginBottom: 5 }]}>PHƯƠNG THỨC NHẬN TIỀN</Text>
                    
                    {/* Bank Account Option */}
                    <TouchableOpacity 
                        style={[styles.methodOption, withdrawalMethod === 'BANK' && styles.methodOptionActive]}
                        onPress={() => setWithdrawalMethod('BANK')}
                    >
                        <View style={styles.methodLeft}>
                            <View style={[styles.methodIconContainer, { backgroundColor: '#005baa' }]}>
                                <Ionicons name="business" size={22} color="white" />
                            </View>
                            <View>
                                <Text style={styles.methodName}>Tài khoản Techcombank</Text>
                                <Text style={styles.methodDesc}>STK: **** **** 1024</Text>
                            </View>
                        </View>
                        <Ionicons 
                            name={withdrawalMethod === 'BANK' ? "radio-button-on" : "radio-button-off"} 
                            size={22} 
                            color={withdrawalMethod === 'BANK' ? "#EE4D2D" : "#bbb"} 
                        />
                    </TouchableOpacity>

                    {/* MoMo Option */}
                    <TouchableOpacity 
                        style={[styles.methodOption, withdrawalMethod === 'MOMO' && styles.methodOptionActive]}
                        onPress={() => setWithdrawalMethod('MOMO')}
                    >
                        <View style={styles.methodLeft}>
                            <View style={[styles.methodIconContainer, { backgroundColor: '#a50064' }]}>
                                <Ionicons name="wallet" size={22} color="white" />
                            </View>
                            <View>
                                <Text style={styles.methodName}>Ví điện tử MoMo</Text>
                                <Text style={styles.methodDesc}>SĐT liên kết: **** *** 989</Text>
                            </View>
                        </View>
                        <Ionicons 
                            name={withdrawalMethod === 'MOMO' ? "radio-button-on" : "radio-button-off"} 
                            size={22} 
                            color={withdrawalMethod === 'MOMO' ? "#EE4D2D" : "#bbb"} 
                        />
                    </TouchableOpacity>
                </View>

                {/* Bottom Action button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleWithdrawal}>
                    <Text style={styles.submitButtonText}>Xác nhận rút tiền</Text>
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
        overflow: 'hidden',
    },
    balanceCard: {
        backgroundColor: '#1a1a1a',
        position: 'relative',
    },
    balanceInfo: {
        zIndex: 1,
    },
    balanceLabel: {
        fontSize: 12,
        color: '#aaaaaa',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 5,
    },
    cardBlurDecorator: {
        position: 'absolute',
        right: -30,
        bottom: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#EE4D2D',
        opacity: 0.3,
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
    inputHint: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
    methodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    methodOptionActive: {
        borderColor: '#EE4D2Defe',
        backgroundColor: '#fffdfc',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    methodIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    methodDesc: {
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
