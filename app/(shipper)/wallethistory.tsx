import { useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

export type Transaction = {
    id: string;
    title: string;
    type: 'TOPUP' | 'WITHDRAW' | 'EARNING' | 'FAILED_WITHDRAW';
    amount: number;
    time: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    method: string;
    balanceBefore: number;
    balanceAfter: number;
    content: string;
};

export const mock_transactions: Transaction[] = [
    {
        id: "TX102",
        title: "Rút tiền bị từ chối",
        type: 'FAILED_WITHDRAW',
        amount: 200000,
        time: "11:20 - 23/10/2023",
        status: 'FAILED',
        method: "Techcombank",
        balanceBefore: 450000,
        balanceAfter: 450000,
        content: "Yêu cầu rút tiền bị từ chối"
    },
    {
        id: "TX101",
        title: "Rút tiền về Techcombank",
        type: 'WITHDRAW',
        amount: 150000,
        time: "14:30 - 24/10/2023",
        status: 'SUCCESS',
        method: "Techcombank",
        balanceBefore: 600000,
        balanceAfter: 450000,
        content: "Rút tiền về tài khoản Techcombank"
    },
    {
        id: "TX100",
        title: "Nạp tiền qua VNPay",
        type: 'TOPUP',
        amount: 100000,
        time: "09:15 - 24/10/2023",
        status: 'SUCCESS',
        method: "VNPay",
        balanceBefore: 500000,
        balanceAfter: 600000,
        content: "Nạp tiền qua VNPay"
    }
];

export default function WalletHistory() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'ALL' | 'TOPUP' | 'WITHDRAW'>('ALL');

    const filteredTransactions = mock_transactions.filter(t => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'TOPUP') return t.type === 'TOPUP' || t.type === 'EARNING';
        if (activeTab === 'WITHDRAW') return t.type === 'WITHDRAW' || t.type === 'FAILED_WITHDRAW';
        return true;
    });

    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN') + 'đ';
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'EARNING':
                return <Ionicons name="bicycle" size={24} color="#20c74b" />;
            case 'TOPUP':
                return <Ionicons name="arrow-down-circle" size={24} color="#007aff" />;
            case 'WITHDRAW':
                return <Ionicons name="arrow-up-circle" size={24} color="#EE4D2D" />;
            case 'FAILED_WITHDRAW':
                return <Ionicons name="close-circle" size={24} color="gray" />;
            default:
                return <Ionicons name="wallet" size={24} color="#EE4D2D" />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Lịch sử ví</Text>
            </View>

            <ScrollView style={{ width: '100%', height: '100%', padding: 20 }} contentContainerStyle={{ rowGap: 20 }}>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'ALL' && styles.activeTabButton]}
                        onPress={() => setActiveTab('ALL')}
                    >
                        <Text style={[styles.tabText, activeTab === 'ALL' && styles.activeTabText]}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'TOPUP' && styles.activeTabButton]}
                        onPress={() => setActiveTab('TOPUP')}
                    >
                        <Text style={[styles.tabText, activeTab === 'TOPUP' && styles.activeTabText]}>Nạp tiền</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'WITHDRAW' && styles.activeTabButton]}
                        onPress={() => setActiveTab('WITHDRAW')}
                    >
                        <Text style={[styles.tabText, activeTab === 'WITHDRAW' && styles.activeTabText]}>Rút tiền</Text>
                    </TouchableOpacity>
                </View>

                {/* Transaction List */}
                <View style={styles.smallcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Danh sách giao dịch</Text>
                    {filteredTransactions.map((tx) => (
                        <TouchableOpacity
                            key={tx.id}
                            style={styles.transactionItem}
                            onPress={() => router.push({
                                pathname: '/(shipper)/transactiondetail',
                                params: { id: tx.id }
                            })}
                        >
                            <View style={styles.iconContainer}>
                                {getTransactionIcon(tx.type)}
                            </View>
                            <View style={styles.transactionInfo}>
                                <Text style={styles.transactionTitle} numberOfLines={1}>{tx.title}</Text>
                                <Text style={styles.transactionTime}>{tx.time}</Text>
                            </View>
                            <View style={styles.transactionAmountContainer}>
                                <Text style={[
                                    styles.transactionAmount,
                                    (tx.type === 'EARNING' || tx.type === 'TOPUP') ? styles.plusAmount : styles.minusAmount,
                                    tx.type === 'FAILED_WITHDRAW' && styles.failedAmount
                                ]}>
                                    {(tx.type === 'EARNING' || tx.type === 'TOPUP') ? '+' : '-'}{formatCurrency(tx.amount)}
                                </Text>
                                <Text style={[
                                    styles.statusBadgeText,
                                    tx.status === 'SUCCESS' ? styles.successStatus :
                                        tx.status === 'FAILED' ? styles.failedStatus : styles.pendingStatus
                                ]}>
                                    {tx.status === 'SUCCESS' ? 'Thành công' :
                                        tx.status === 'FAILED' ? 'Bị từ chối' : 'Đang xử lý'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {filteredTransactions.length === 0 && (
                        <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                            <Text style={{ color: 'gray' }}>Không có giao dịch nào</Text>
                        </View>
                    )}
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
        gap: 10,
    },
    balanceCard: {
        backgroundColor: '#EE4D2D',
    },
    balanceLabel: {
        fontSize: 12,
        color: '#ffc1b5',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 5,
    },
    balanceActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    topupBtn: {
        backgroundColor: '#007aff',
    },
    withdrawBtn: {
        backgroundColor: '#20c74b',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    filterTabs: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTabButton: {
        backgroundColor: '#fef0ed',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#EE4D2D',
        fontWeight: 'bold',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    transactionTime: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    plusAmount: {
        color: '#20c74b',
    },
    minusAmount: {
        color: '#333',
    },
    failedAmount: {
        color: 'gray',
        textDecorationLine: 'line-through',
    },
    statusBadgeText: {
        fontSize: 11,
        marginTop: 2,
        fontWeight: '500',
    },
    successStatus: {
        color: '#20c74b',
    },
    failedStatus: {
        color: '#EE4D2D',
    },
    pendingStatus: {
        color: '#ff9500',
    },
});
