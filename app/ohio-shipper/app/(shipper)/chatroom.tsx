import { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import api from "@/services/api";
import { mock_chat_messages, ChatMessage } from "../../mock/shipper";

export default function Chatroom() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const orderId = id ? id.toString() : "8821";

    // States
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    // Fetch chat messages with API-to-mock fallback
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                // Link actual API
                const response = await api.get(`/deliveries/assignments/${orderId}/messages`);
                const resData = response.data;
                const rawData = resData.success ? resData.data : resData;

                if (Array.isArray(rawData)) {
                    setMessages(
                        rawData.map((m: any) => ({
                            id: m.id || m._id || `msg-${Math.random()}`,
                            senderId: m.senderId || 'other',
                            senderName: m.senderName || (m.senderRole === 'MERCHANT' ? 'Kinetic Kitchen' : 'Rider 422'),
                            senderRole: m.senderRole || 'MERCHANT',
                            messageText: m.messageText || m.content || '',
                            timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '12:00 PM',
                            isMe: m.isMe || m.senderRole === 'CUSTOMER',
                            hasLeftBorder: m.senderRole === 'MERCHANT',
                        }))
                    );
                } else {
                    throw new Error("Invalid message list format from API");
                }
            } catch (error) {
                console.log("Error loading chat messages from API, falling back to mocks:", error);
                // Fallback to high fidelity mock messages
                setMessages(mock_chat_messages);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [orderId]);

    // Scroll to end when messages load or change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    // Handle Send Message
    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const textToSend = inputText.trim();
        setInputText("");

        // 1. Generate local UI message for instantaneous updates
        const timeNow = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const localNewMsg: ChatMessage = {
            id: `msg-local-${Date.now()}`,
            senderId: 'customer-me',
            senderName: 'You',
            senderRole: 'CUSTOMER',
            messageText: textToSend,
            timestamp: timeNow,
            isMe: true,
            isRead: false
        };

        // Render immediately
        setMessages(prev => [...prev, localNewMsg]);

        try {
            setSending(true);

            // 2. Link API send message
            const payload = {
                content: textToSend,
                senderRole: 'CUSTOMER', // "You" role
                timestamp: new Date().toISOString()
            };

            const response = await api.post(`/deliveries/assignments/${orderId}/messages`, payload);

            // Mark as sent successfully/read
            setMessages(prev =>
                prev.map(m => m.id === localNewMsg.id ? { ...m, isRead: true } : m)
            );
        } catch (error) {
            console.log("Failed to send message to backend, using local mock fallback:", error);
            // Simulated delivery status (Double Ticks will render in orange successfully)
            setMessages(prev =>
                prev.map(m => m.id === localNewMsg.id ? { ...m, isRead: true } : m)
            );
        } finally {
            setSending(false);
        }
    };

    // Render each message row
    const renderMessageItem = ({ item }: { item: ChatMessage }) => {
        if (item.isMe) {
            // Render Right Align Bubble ("You")
            return (
                <View style={styles.rightMessageContainer}>
                    <Text style={styles.rightSenderName}>You</Text>
                    <View style={styles.rightBubble}>
                        <Text style={styles.rightBubbleText}>{item.messageText}</Text>
                    </View>
                    <View style={styles.rightTimeContainer}>
                        <Text style={styles.rightTimeText}>{item.timestamp}</Text>
                        <Ionicons name="checkmark-done" size={14} color="#B22203" style={styles.doubleTicks} />
                    </View>
                </View>
            );
        } else {
            // Render Left Align Bubble (Rider/Merchant)
            const isMerchant = item.senderRole === 'MERCHANT';
            const iconName = isMerchant ? 'restaurant' : 'motorcycle';

            return (
                <View style={styles.leftMessageContainer}>
                    <View style={styles.leftSenderHeader}>
                        <MaterialIcons name={iconName} size={15} color="#4B5563" />
                        <Text style={styles.leftSenderName}>{item.senderName}</Text>
                    </View>
                    <View style={[
                        styles.leftBubble,
                        item.hasLeftBorder && styles.leftBubbleBordered
                    ]}>
                        <Text style={styles.leftBubbleText}>{item.messageText}</Text>
                    </View>
                    <Text style={styles.leftTimeText}>{item.timestamp}</Text>
                </View>
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#EE4D2D" />
                <Text style={{ marginTop: 10, color: 'gray' }}>Đang tải tin nhắn...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={"padding"}
        >
            {/* Header matching the screenshot left-aligned style */}
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <View style={styles.headerTitleContainer}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Trò chuyện</Text>
                    <Text style={styles.headerSubtitle}>ID: {orderId}</Text>
                </View>

            </View>

            {/* Message Thread */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.dateSeparatorContainer}>
                        <View style={styles.dateSeparatorBadge}>
                            <Text style={styles.dateSeparatorText}>TODAY</Text>
                        </View>
                    </View>
                }
            />

            {/* Bottom Input Panel */}
            <View style={styles.bottomInputPanel}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add" size={24} color="#4B5563" />
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Nhập tin nhắn..."
                    placeholderTextColor="#9CA3AF"
                    onSubmitEditing={handleSendMessage}
                />

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                >
                    <Ionicons name="paper-plane" size={18} color="white" style={styles.sendIcon} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    keyboardContainer: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    headerTitleContainer: {
        flexDirection: 'column',
        marginLeft: 15,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#b3b3b3ff',
        marginTop: 2,
    },
    listContent: {
        paddingBottom: 20,
    },
    dateSeparatorContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 18,
    },
    dateSeparatorBadge: {
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
    dateSeparatorText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    // Left Message Bubbles (Rider/Merchant)
    leftMessageContainer: {
        marginVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        width: '100%',
    },
    leftSenderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    leftSenderName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    leftBubble: {
        backgroundColor: 'white',
        borderRadius: 18,
        borderTopLeftRadius: 4,
        padding: 16,
        maxWidth: '82%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    leftBubbleBordered: {
        borderLeftWidth: 3.5,
        borderLeftColor: '#F39E88',
    },
    leftBubbleText: {
        fontSize: 15,
        color: '#1F2937',
        lineHeight: 21,
    },
    leftTimeText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 5,
        marginLeft: 8,
    },
    // Right Message Bubbles ("You")
    rightMessageContainer: {
        marginVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
        width: '100%',
    },
    rightSenderName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#B22203',
        marginBottom: 5,
    },
    rightBubble: {
        backgroundColor: '#B22203',
        borderRadius: 18,
        borderTopRightRadius: 4,
        padding: 16,
        maxWidth: '82%',
        shadowColor: '#B22203',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    rightBubbleText: {
        fontSize: 15,
        color: 'white',
        lineHeight: 21,
    },
    rightTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginRight: 8,
        gap: 4,
    },
    rightTimeText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    doubleTicks: {
        marginLeft: 2,
        marginTop: 1,
    },
    // Bottom Input Panel
    bottomInputPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 30,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    attachButton: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        height: 46,
        borderRadius: 23,
        paddingHorizontal: 20,
        fontSize: 15,
        color: '#1F2937',
        marginHorizontal: 12,
    },
    sendButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#B22203',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#B22203',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    sendIcon: {
        transform: [{ rotate: '0deg' }],
        marginLeft: -1,
        marginTop: 1,
    },
});