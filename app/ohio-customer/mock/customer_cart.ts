import { CartItem, FoodItem } from "@/types";
import { mock_orderitems, OrderCardType } from "./shipper";
import { CartItemResponseDto, CartListResponseDto, CartRequestDto, CartResponseDto, CartSelectedOptionDto, CartSelectedValueDto } from "@/types/cart";
import { MerchantProfileResponseDto } from "@/types/profile";

export const mock_cart_order: OrderCardType[] = [
    { status: '', id: '1', merchantId: '1', recipientname: 'my', subtotal: 21000, deliveryfee: 25000, discountamount: 2000, totalamount: 44000, pickuplocation: 'Lam Son, Binh Thanh', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '22/2/2025, 12:33 PM', rating: 3.5, comment: 'hơi chậm', orderedtime: 'Chưa hoàn thành', orderitems: mock_orderitems },
    { status: '', id: '2', merchantId: '2', recipientname: 'trang', subtotal: 10000, deliveryfee: 25000, discountamount: 21000, totalamount: 14000, pickuplocation: 'Bui Quang, Ward 3', deliverylocation: 'Le Minh Hung, Ward 3', orderedtime: 'Chưa hoàn thành', orderitems: mock_orderitems },
]

export const mock_odercard_forcustomer: OrderCardType[] = [
    { status: 'DELIVERED', id: '1', merchantId: '2', recipientname: 'kim', subtotal: 30000, deliveryfee: 14000, discountamount: 0, totalamount: 44000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '25/4/2026, 20:30 PM', rating: 4.5, comment: 'giao hàng nhanh', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'CANCELLED', id: '2', merchantId: '2', recipientname: 'huy', subtotal: 25000, deliveryfee: 10000, discountamount: 0, totalamount: 35000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Le Dai Hanh, Ward 5', deliveredtime: '1/4/2026, 4:45 PM', rating: 4, comment: 'tốt', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'PENDING', id: '3', merchantId: '2', recipientname: 'dung', subtotal: 10000, deliveryfee: 12000, discountamount: 2000, totalamount: 20000, pickuplocation: 'Le Huong Dinh, Ward 10', deliverylocation: 'Thong Nhat, P.An Hoi', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'READY', id: '4', merchantId: '1', recipientname: 'trang', subtotal: 10000, deliveryfee: 25000, discountamount: 21000, totalamount: 14000, pickuplocation: 'Bui Quang, Ward 3', deliverylocation: 'Le Minh Hung, Ward 3', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'CONFIRMED', id: '5', merchantId: '2', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'PREPARING', id: '6', merchantId: '1', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'DELIVERING', id: '7', merchantId: '1', recipientname: 'nhan', subtotal: 30000, deliveryfee: 4000, discountamount: 2000, totalamount: 32000, pickuplocation: 'Dinh Hoi, Go Vap', deliverylocation: 'Hoang Hoa Tham, Q.Tay Ho', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
    { status: 'DELIVERED', id: '8', merchantId: '1', recipientname: 'my', subtotal: 21000, deliveryfee: 25000, discountamount: 2000, totalamount: 44000, pickuplocation: 'Lam Son, Binh Thanh', deliverylocation: 'Dinh Van Nhi, Ward 3', deliveredtime: '22/2/2025, 12:33 PM', rating: 3.5, comment: 'hơi chậm', orderedtime: '25/4/2026, 20:30 PM', orderitems: mock_orderitems },
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


export const mock_merchant_new: MerchantProfileResponseDto = {
    id: '1',
    userId: '1',
    storeName: 'Cơm tấm 3 ngon',
    storeDescription: 'cơm sườn nướng ngon ',
    storeLogoUrl: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
    storeBannerUrl: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
    businessLicense: 'abc',
    taxId: '123',
    isOpen: true,
    openingTime: '8:00',
    closingTime: '22:00',
    minOrderAmount: 10000,
    avgPrepTime: 20,
    status: 'OPEN',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2022-01-01T00:00:00Z',
}

export const mock_cart_item_option_values: CartSelectedValueDto[] = [
    {
        valueId: '1',
        name: 'thịt nướng',
        additionalPrice: 5000
    },
    {
        valueId: '2',
        name: 'trứng ốp la',
        additionalPrice: 10000
    }
]

export const mock_cart_item_selectedoptions: CartSelectedOptionDto[] = [
    {
        optionId: '1',
        name: 'thịt nướng',
        values: mock_cart_item_option_values
    }
]

export const mock_cart_item_new1: CartItemResponseDto = {
    id: '1',
    productId: '1',
    merchantId: '1',
    productName: 'cơm',
    productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
    note: 'thịt nướng',
    quantity: 1,
    baseUnitPrice: 20000,
    unitPrice: 20000,
    lineTotal: 20000,
    selectedOptions: mock_cart_item_selectedoptions,
    addedAt: '2022-01-01T00:00:00Z'
}
const mock_cart_item_new2: CartItemResponseDto = {
    id: '2',
    productId: '2',
    merchantId: '1',
    productName: 'cơm 2',
    productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
    note: 'trứng ốp la',
    quantity: 4,
    baseUnitPrice: 25000,
    unitPrice: 20000,
    lineTotal: 20000,
    selectedOptions: mock_cart_item_selectedoptions,
    addedAt: '2022-01-01T00:00:00Z'
}

export const mock_cart_new: CartResponseDto[] = [
    {
        userId: '1',
        merchantId: '1',
        items: [mock_cart_item_new1, mock_cart_item_new2],
        totalQuantity: 1,
        subtotal: 20000,
        updatedAt: '2022-01-01T00:00:00Z'
    },
    {
        userId: '1',
        merchantId: '1',
        items: [mock_cart_item_new2],
        totalQuantity: 1,
        subtotal: 20000,
        updatedAt: '2022-01-01T00:00:00Z'
    },
    {
        userId: '1',
        merchantId: '1',
        items: [mock_cart_item_new1],
        totalQuantity: 1,
        subtotal: 20000,
        updatedAt: '2022-01-01T00:00:00Z'
    },
    {
        userId: '1',
        merchantId: '1',
        items: [mock_cart_item_new2],
        totalQuantity: 1,
        subtotal: 20000,
        updatedAt: '2022-01-01T00:00:00Z'
    },
]