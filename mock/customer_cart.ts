import { CartItem, FoodItem } from "@/types";
import { mock_orderitems, OrderCardType } from "./shipper";

export const mock_cart_order: OrderCardType[] = [
    { status: '', restaurantname: 'Super Peak', recipientname: 'my', subtotal: 21000, deliveryfee: 25000, discountamount: 2000, totalamount: 44000, pickuplocation: 'Lam Son, Binh Thanh', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '22/2/2025, 12:33 PM', rating: 3.5, comment: 'hơi chậm', orderedtime: 'Chưa hoàn thành', orderitems: mock_orderitems },
    { status: '', restaurantname: 'Halo Wod', recipientname: 'trang', subtotal: 10000, deliveryfee: 25000, discountamount: 21000, totalamount: 14000, pickuplocation: 'Bui Quang, Ward 3', deliverylocation: 'Le Minh Hung, Ward 3', orderedtime: 'Chưa hoàn thành', orderitems: mock_orderitems },
]

export const mock_odercard_forcustomer: OrderCardType[] = [
    { status: 'DELIVERED', restaurantname: 'Super Peak', recipientname: 'kim', subtotal: 30000, deliveryfee: 14000, discountamount: 0, totalamount: 44000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '25/4/2026, 20:30 PM', rating: 4.5, comment: 'giao hàng nhanh', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'CANCELLED', restaurantname: 'Super Peak', recipientname: 'huy', subtotal: 25000, deliveryfee: 10000, discountamount: 0, totalamount: 35000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Le Dai Hanh, Ward 5', deliveredtime: '1/4/2026, 4:45 PM', rating: 4, comment: 'tốt', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'PENDING', restaurantname: 'Super Creek', recipientname: 'dung', subtotal: 10000, deliveryfee: 12000, discountamount: 2000, totalamount: 20000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Thong Nhat, P.An Hoi', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'READY', restaurantname: 'Halo Wod', recipientname: 'trang', subtotal: 10000, deliveryfee: 25000, discountamount: 21000, totalamount: 14000, pickuplocation: 'Bui Quang, Ward 3', deliverylocation: 'Le Minh Hung, Ward 3', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'CONFIRMED', restaurantname: 'Hoa Ly', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'PREPARING', restaurantname: 'Hoa Ly', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'DELIVERING', restaurantname: 'Hoa Ly', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'DELIVERED', restaurantname: 'Super Peak', recipientname: 'my', subtotal: 21000, deliveryfee: 25000, discountamount: 2000, totalamount: 44000, pickuplocation: 'Lam Son, Binh Thanh', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '22/2/2025, 12:33 PM', rating: 3.5, comment: 'hơi chậm', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
]
const mock_food: FoodItem = {
    id: '1',
    restaurantId: '1',
    categoryId: '1',
    name: 'cơm',
    price: 20000,
    image: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
    isAvailable: true,
}
const mock_cartitem: CartItem = {
    foodItem: mock_food,
    quantity: 1,
    selectedOptions: [{ id: '1', name: 'Thịt nướng', priceDiff: 5000 }, { id: '2', name: 'Trứng ốp la', priceDiff: 10000 }]
}
export const mock_order: CartItem[] = [mock_cartitem, mock_cartitem, mock_cartitem];
