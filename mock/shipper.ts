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
    status?: string;
    restaurantname?: string;
    recipientname?: string;
    subtotal?: number;
    discountamount?: number;
    deliveryfee?: number;
    totalamount?: number;
    pickuplocation?: string;
    deliverylocation?: string;
    deliveredtime?: string;
    rating?: number;
    comment?: string;
    onView?: () => void;
}
export const mock_odercard: OrderCardType[] = [
    { status: 'delivered', restaurantname: 'Super Peak', recipientname: 'kim', subtotal: 30000, deliveryfee: 14000, discountamount: 0, totalamount: 44000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '25/4/2026, 20:30 PM', rating: 4.5, comment: 'giao hàng nhanh' },
    { status: 'cancel', restaurantname: 'Super Peak', recipientname: 'huy', subtotal: 25000, deliveryfee: 10000, discountamount: 0, totalamount: 35000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Le Dai Hanh, Ward 5', deliveredtime: '1/4/2026, 4:45 PM', rating: 4, comment: 'tốt' },
    { status: 'pending', restaurantname: 'Super Creek', recipientname: 'dung', subtotal: 10000, deliveryfee: 12000, discountamount: 2000, totalamount: 20000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Thong Nhat, P.An Hoi' },
    { status: 'ready', restaurantname: 'Halo Wod', recipientname: 'trang', subtotal: 10000, deliveryfee: 25000, discountamount: 21000, totalamount: 14000, pickuplocation: 'Bui Quang, Ward 3', deliverylocation: 'Le Minh Hung, Ward 3' },
    { status: 'delivering', restaurantname: 'Hoa Ly', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho' },
    { status: 'delivering', restaurantname: 'Hoa Ly', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho' },
    { status: 'delivering', restaurantname: 'Hoa Ly', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho' },
    { status: 'delivered', restaurantname: 'Super Peak', recipientname: 'my', subtotal: 21000, deliveryfee: 25000, discountamount: 2000, totalamount: 44000, pickuplocation: 'Lam Son, Binh Thanh', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '22/2/2025, 12:33 PM', rating: 3.5, comment: 'hơi chậm' },
]
