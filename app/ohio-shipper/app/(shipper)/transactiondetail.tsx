import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import { mock_transactions } from "./wallethistory";
import { useMemo } from "react";

export default function TransactionDetail() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const transaction = useMemo(() => {
        const found = mock_transactions.find(t => t.id === params?.id);
        if (found) return found;
        // Default fallback if not found
        return {
            id: "TX100",
            title: "Nạp tiền qua VNPay",
            type: 'TOPUP' as const,
            amount: 500000,
            time: "09:15 - 24/10/2023",
            status: 'SUCCESS' as const,
            method: "VNPay",
            balanceBefore: 0,
            balanceAfter: 500000,
            content: "Nạp tiền qua VNPay"
        };
    }, [params?.id]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN') + 'đ';
    };

    const getStatusDetails = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return {
                    label: 'Thành công',
                    color: '#20c74b',
                    icon: <Ionicons name="checkmark-circle" size={48} color="#20c74b" />
                };
            case 'FAILED':
                return {
                    label: 'Bị từ chối',
                    color: '#EE4D2D',
                    icon: <Ionicons name="close-circle" size={48} color="#EE4D2D" />
                };
            default:
                return {
                    label: 'Đang xử lý',
                    color: '#ff9500',
                    icon: <Ionicons name="time" size={48} color="#ff9500" />
                };
        }
    };

    const statusInfo = getStatusDetails(transaction.status);

    const getTypeText = (type: string) => {
        switch (type) {
            case 'TOPUP': return 'Nạp tiền';
            case 'WITHDRAW': return 'Rút tiền';
            case 'EARNING': return 'Thu nhập chuyến xe';
            case 'FAILED_WITHDRAW': return 'Rút tiền bị từ chối';
            default: return 'Khác';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Chi tiết giao dịch</Text>
            </View>

            <ScrollView style={{ width: '100%', height: '100%', padding: 20 }} contentContainerStyle={{ rowGap: 20 }}>
                {/* Hero Status & Amount Section */}
                <View style={[styles.smallcontainer, { alignItems: 'center', paddingVertical: 30 }]}>
                    {statusInfo.icon}
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                    
                    <Text style={styles.amountLabel}>SỐ TIỀN GIAO DỊCH</Text>
                    <Text style={[
                        styles.amountDisplay,
                        (transaction.type === 'EARNING' || transaction.type === 'TOPUP') ? styles.plusAmount : styles.minusAmount
                    ]}>
                        {(transaction.type === 'EARNING' || transaction.type === 'TOPUP') ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </Text>
                </View>

                {/* Transaction Details Card */}
                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Thông tin chi tiết</Text>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Loại giao dịch</Text>
                        <Text style={styles.detailValue}>{getTypeText(transaction.type)}</Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phương thức thanh toán</Text>
                        <Text style={styles.detailValue}>{transaction.method}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Số dư trước giao dịch</Text>
                        <Text style={styles.detailValue}>{formatCurrency(transaction.balanceBefore)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Số dư sau giao dịch</Text>
                        <Text style={styles.detailValue}>{formatCurrency(transaction.balanceAfter)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Mã giao dịch</Text>
                        <Text style={[styles.detailValue, { fontFamily: 'monospace' }]}>{transaction.id}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Thời gian</Text>
                        <Text style={styles.detailValue}>{transaction.time}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={[styles.detailRow, { flexDirection: 'column', alignItems: 'flex-start', gap: 6 }]}>
                        <Text style={styles.detailLabel}>Nội dung</Text>
                        <Text style={[styles.detailValue, { fontWeight: 'normal', color: '#555' }]}>{transaction.content}</Text>
                    </View>
                </View>

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
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 20,
    },
    amountLabel: {
        fontSize: 11,
        color: 'gray',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    amountDisplay: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 5,
    },
    plusAmount: {
        color: '#20c74b',
    },
    minusAmount: {
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 14,
        color: 'gray',
    },
    detailValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginVertical: 4,
    },
});
