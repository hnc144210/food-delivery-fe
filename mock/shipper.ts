import { Address, User } from "@/types";

export const mock_users: User[] = [
    { id: "1", name: 'Super Peak', role: 'MERCHANT', phone: '0123456789', email: '', avatar_url: '' },
    { id: "2", name: 'Super Creek', role: 'MERCHANT', phone: '0129876723', email: '', avatar_url: '' },
    { id: "3", name: 'Halo Wod', role: 'MERCHANT', phone: '0129357524', email: '', avatar_url: '' },
    { id: "4", name: 'Hoa Ly', role: 'MERCHANT', phone: '0133545678', email: '', avatar_url: '' },
    { id: "5", name: 'huy', role: 'CUSTOMER', phone: '0124567891', email: '', avatar_url: '' },
    { id: "6", name: 'kim', role: 'CUSTOMER', phone: '0132564138', email: '', avatar_url: '' },
    { id: "7", name: 'trang', role: 'CUSTOMER', phone: '0142567895', email: '', avatar_url: '' },
    { id: "8", name: 'nhan', role: 'CUSTOMER', phone: '0124567221', email: '', avatar_url: '' },
    { id: "9", name: 'my', role: 'CUSTOMER', phone: '0132564138', email: '', avatar_url: '' },
    { id: "10", name: 'dung', role: 'CUSTOMER', phone: '0142567895', email: '', avatar_url: '' },
]
export const mock_address: Address[] = [
    { id: "1", userId: "1", label: 'Super Peak', street: 'Le Huong Dinh, Ward 10', lat: 10.8231, lng: 106.6297, receiverName: 'Super Peak', phone: '0123456789' },
    { id: "2", userId: "2", label: 'Super Creek', street: '19/3/4 Lu Wuang, Ward 15, Tan Binh', lat: 10.8231, lng: 106.6297, receiverName: 'Super Creek', phone: '0129876723' },
    { id: "3", userId: "3", label: 'Halo Wod', street: 'Hoang Hoa Tham, Q.Tay Ho', lat: 10.8231, lng: 106.6297, receiverName: 'Halo Wod', phone: '0129357524' },
    { id: "4", userId: "4", label: 'Hoa Ly', street: 'Hoang Dinh Phong, Ward Phu Nhuan', lat: 10.8231, lng: 106.6297, receiverName: 'Hoa Ly', phone: '0133545678' },
    { id: "5", userId: "5", label: 'huy', street: 'Dinh Van Nhi, Ward 3, Phu Nhuan', lat: 10.8231, lng: 106.6297, receiverName: 'huy', phone: '0124567891' },
    { id: "6", userId: "6", label: 'kim', street: 'Le Duc Tho, Thu Duc', lat: 10.8231, lng: 106.6297, receiverName: 'kim', phone: '0132564138' },
    { id: "7", userId: "7", label: 'trang', street: 'Luong Dinh Cua, Q.2', lat: 10.8231, lng: 106.6297, receiverName: 'trang', phone: '0142567895' },
    { id: "8", userId: "8", label: 'nhan', street: 'Le Van Viet, Q.9', lat: 10.8231, lng: 106.6297, receiverName: 'nhan', phone: '0124567221' },
    { id: "9", userId: "9", label: 'my', street: 'Le Thanh Nghi, Q.Go Vap', lat: 10.8231, lng: 106.6297, receiverName: 'my', phone: '0132564138' },
    { id: "10", userId: "10", label: 'dung', street: 'Le Dinh Can, Q.Binh Tan', lat: 10.8231, lng: 106.6297, receiverName: 'dung', phone: '0142567895' },
]

export type OrderitemsData = {
    name?: string;
    quantity?: number;
    selected_options?: string
}
export const mock_orderitems: OrderitemsData[] = [
    { name: 'Mì tôm chua cay', quantity: 1, selected_options: 'Lớn, Nhiều ớt, Nhiều thịt' },
    { name: 'Pizza hảo hạng', quantity: 3, selected_options: 'Nhỏ, Ít bơ' },
    { name: 'Trà sữa', quantity: 5, selected_options: 'Lớn, Nhiều đá' },
    { name: 'Kem ly', quantity: 2, selected_options: 'Vừa' },
]

export type OrderCardType = {
    id?: string;
    status?: string;
    merchantId?: string;
    customerId?: string;
    recipientname?: string;
    orderitems?: OrderitemsData[];
    subtotal?: number;
    discountamount?: number;
    deliveryfee?: number;
    totalamount?: number;
    pickuplocation?: string;
    orderedtime?: string;
    deliverylocation?: string;
    deliveredtime?: string;
    rating?: number;
    comment?: string;
    note?: string;
}
export const mock_odercard: OrderCardType[] = [
    { id: "1", status: 'DELIVERED', merchantId: "1", customerId: "5", recipientname: 'huy', subtotal: 30000, deliveryfee: 14000, discountamount: 0, totalamount: 44000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '25/4/2026, 20:30 PM', rating: 4.5, comment: 'giao hàng nhanh', note: 'Ghi chú: Để trước cửa nhà, bấm chuông 2 lần.', orderitems: mock_orderitems },
    { id: "2", status: 'CANCELLED', merchantId: "2", customerId: "6", recipientname: 'kim', subtotal: 25000, deliveryfee: 10000, discountamount: 0, totalamount: 35000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Le Dai Hanh, Ward 5', deliveredtime: '1/4/2026, 4:45 PM', rating: 4, comment: 'tốt', note: 'Ghi chú: Để trước cửa nhà, bấm chuông 2 lần.', orderitems: mock_orderitems },
    { id: "3", status: 'PENDING', merchantId: "2", customerId: "7", recipientname: 'trang', subtotal: 10000, deliveryfee: 12000, discountamount: 2000, totalamount: 20000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Thong Nhat, P.An Hoi', orderitems: mock_orderitems },
    { id: "4", status: 'READY', merchantId: "2", customerId: "8", recipientname: 'nhan', subtotal: 10000, deliveryfee: 25000, discountamount: 21000, totalamount: 14000, pickuplocation: 'Bui Quang, Ward 3', deliverylocation: 'Le Minh Hung, Ward 3', note: 'Ghi chú: Bấm chuông.', orderitems: mock_orderitems },
    { id: "5", status: 'DELIVERING', merchantId: "1", customerId: "5", recipientname: 'huy', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', note: 'Ghi chú: Ít cơm', orderitems: mock_orderitems },
    { id: "6", status: 'DELIVERING', merchantId: "1", customerId: "5", recipientname: 'huy', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Dinh Tien Hoang, Ba Dinh', note: 'Ghi chú: Giao nhanh', orderitems: mock_orderitems },
    { id: "7", status: 'DELIVERING', merchantId: "1", customerId: "7", recipientname: 'trang', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Luong Dinh Cua, Q.2', orderitems: mock_orderitems },
    { id: "8", status: 'DELIVERED', merchantId: "1", customerId: "9", recipientname: 'my', subtotal: 21000, deliveryfee: 25000, discountamount: 2000, totalamount: 44000, pickuplocation: 'Lam Son, Binh Thanh', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '22/2/2025, 12:33 PM', rating: 3.5, comment: 'hơi chậm', note: 'Ghi chú: Để trước cửa nhà, bấm chuông 2 lần.', orderitems: mock_orderitems },
]

export type ChatMessage = {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'RIDER' | 'MERCHANT' | 'CUSTOMER';
    messageText: string;
    timestamp: string;
    isMe: boolean;
    hasLeftBorder?: boolean;
    isRead?: boolean;
}

export const mock_chat_messages: ChatMessage[] = [
    {
        id: 'msg-1',
        senderId: 'rider-422',
        senderName: 'Rider 422',
        senderRole: 'RIDER',
        messageText: "I've picked up your order and am on the way!",
        timestamp: '12:45 PM',
        isMe: false,
    },
    {
        id: 'msg-2',
        senderId: 'merchant-kinetic',
        senderName: 'Kinetic Kitchen',
        senderRole: 'MERCHANT',
        messageText: "Enjoy your meal! We've included some extra dipping sauce for you.",
        timestamp: '12:46 PM',
        isMe: false,
        hasLeftBorder: true,
    },
    {
        id: 'msg-3',
        senderId: 'customer-me',
        senderName: 'You',
        senderRole: 'CUSTOMER',
        messageText: "Thank you, please leave it at the front gate.",
        timestamp: '12:48 PM',
        isMe: true,
        isRead: true,
    }
];

