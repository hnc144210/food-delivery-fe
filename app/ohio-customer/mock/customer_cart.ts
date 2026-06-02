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

import { OrderDetailResponseDto, OrderHistoryItemDto, MyOrdersResponseDto } from '@/types/order';

// ─── Mock Order History (dùng cho tab lịch sử đơn hàng) ──────────────────────

export const mock_order_history_items: OrderHistoryItemDto[] = [
    {
        id: 'order-001',
        orderNumber: 'ORD-20260501-001',
        merchantId: 'merchant-1',
        merchantName: 'Cơm tấm 3 ngon',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
        subtotal: 75000,
        deliveryFee: 15000,
        discountAmount: 0,
        totalAmount: 90000,
        paymentMethod: 'COD',
        paymentStatus: 'PAID',
        status: 'DELIVERED',
        createdAt: '2026-05-01T12:30:00Z',
        itemCount: 2,
        previewItems: [
            { id: 'item-1', productId: 'prod-1', productName: 'Cơm sườn nướng', productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', quantity: 1 },
            { id: 'item-2', productId: 'prod-2', productName: 'Chả trứng hấp', productImage: 'https://cdn.pixabay.com/photo/2017/06/07/22/20/grilled-pork-2382904_1280.jpg', quantity: 1 },
        ],
    },
    {
        id: 'order-002',
        orderNumber: 'ORD-20260520-002',
        merchantId: 'merchant-2',
        merchantName: 'Phở Hà Nội',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2020/03/07/02/28/bread-soup-4908531_1280.jpg',
        subtotal: 95000,
        deliveryFee: 20000,
        discountAmount: 10000,
        totalAmount: 105000,
        paymentMethod: 'VNPAY',
        paymentStatus: 'PAID',
        status: 'DELIVERED',
        createdAt: '2026-05-20T18:00:00Z',
        itemCount: 3,
        previewItems: [
            { id: 'item-3', productId: 'prod-3', productName: 'Phở bò tái chín', productImage: 'https://cdn.pixabay.com/photo/2021/08/01/15/35/pho-6512354_1280.jpg', quantity: 2 },
            { id: 'item-4', productId: 'prod-4', productName: 'Quẩy', productImage: null, quantity: 1 },
        ],
    },
    {
        id: 'order-003',
        orderNumber: 'ORD-20260528-003',
        merchantId: 'merchant-1',
        merchantName: 'Cơm tấm 3 ngon',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
        subtotal: 40000,
        deliveryFee: 12000,
        discountAmount: 0,
        totalAmount: 52000,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        status: 'CANCELLED',
        createdAt: '2026-05-28T09:15:00Z',
        itemCount: 1,
        previewItems: [
            { id: 'item-5', productId: 'prod-1', productName: 'Cơm sườn nướng', productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', quantity: 2 },
        ],
    },
];

export const mock_order_history_response: MyOrdersResponseDto = {
    items: mock_order_history_items,
    totalCount: 3,
    page: 1,
    limit: 10,
    totalPages: 1,
};

export const mock_order_ongoing_items: OrderHistoryItemDto[] = [
    {
        id: 'order-001',
        orderNumber: 'ORD-20260501-001',
        merchantId: 'merchant-1',
        merchantName: 'Cơm tấm 3 ngon',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
        subtotal: 75000,
        deliveryFee: 15000,
        discountAmount: 0,
        totalAmount: 90000,
        paymentMethod: 'COD',
        paymentStatus: 'PAID',
        status: 'PREPARING',
        createdAt: '2026-05-01T12:30:00Z',
        itemCount: 2,
        previewItems: [
            { id: 'item-1', productId: 'prod-1', productName: 'Cơm sườn nướng', productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', quantity: 1 },
            { id: 'item-2', productId: 'prod-2', productName: 'Chả trứng hấp', productImage: 'https://cdn.pixabay.com/photo/2017/06/07/22/20/grilled-pork-2382904_1280.jpg', quantity: 1 },
        ],
    },
    {
        id: 'order-002',
        orderNumber: 'ORD-20260520-002',
        merchantId: 'merchant-2',
        merchantName: 'Phở Hà Nội',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2020/03/07/02/28/bread-soup-4908531_1280.jpg',
        subtotal: 95000,
        deliveryFee: 20000,
        discountAmount: 10000,
        totalAmount: 105000,
        paymentMethod: 'VNPAY',
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        createdAt: '2026-05-20T18:00:00Z',
        itemCount: 3,
        previewItems: [
            { id: 'item-3', productId: 'prod-3', productName: 'Phở bò tái chín', productImage: 'https://cdn.pixabay.com/photo/2021/08/01/15/35/pho-6512354_1280.jpg', quantity: 2 },
            { id: 'item-4', productId: 'prod-4', productName: 'Quẩy', productImage: null, quantity: 1 },
        ],
    },
    {
        id: 'order-003',
        orderNumber: 'ORD-20260528-003',
        merchantId: 'merchant-1',
        merchantName: 'Cơm tấm 3 ngon',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
        subtotal: 40000,
        deliveryFee: 12000,
        discountAmount: 0,
        totalAmount: 52000,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        createdAt: '2026-05-28T09:15:00Z',
        itemCount: 1,
        previewItems: [
            { id: 'item-5', productId: 'prod-1', productName: 'Cơm sườn nướng', productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', quantity: 2 },
        ],
    },
    {
        id: 'order-003',
        orderNumber: 'ORD-20260528-003',
        merchantId: 'merchant-1',
        merchantName: 'Cơm tấm 3 ngon',
        merchantAvatar: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
        subtotal: 40000,
        deliveryFee: 12000,
        discountAmount: 0,
        totalAmount: 52000,
        paymentMethod: 'COD',
        paymentStatus: 'PAID',
        status: 'DELIVERING',
        createdAt: '2026-05-28T09:15:00Z',
        itemCount: 1,
        previewItems: [
            { id: 'item-5', productId: 'prod-1', productName: 'Cơm sườn nướng', productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', quantity: 2 },
        ],
    },
];

// ─── Mock Order Detail (dùng cho màn hình review) ────────────────────────────

export const mock_order_detail: OrderDetailResponseDto = {
    id: 'order-001',
    orderNumber: 'ORD-20260501-001',
    userId: 'user-123',
    merchantId: 'merchant-1',
    merchantName: 'Cơm tấm 3 ngon',
    merchantAvatar: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
    deliveryAddress: '123 Lê Hồng Phong',
    deliveryWard: 'Phường 1',
    deliveryDistrict: 'Quận 10',
    deliveryCity: 'TP. Hồ Chí Minh',
    deliveryLat: 10.7769,
    deliveryLng: 106.6956,
    recipientName: 'Nguyễn Văn A',
    recipientPhone: '0901234567',
    subtotal: 75000,
    deliveryFee: 15000,
    discountAmount: 0,
    totalAmount: 90000,
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    cancelReason: null,
    cancelledBy: null,
    note: null,
    voucherId: null,
    createdAt: '2026-05-01T12:30:00Z',
    updatedAt: '2026-05-01T13:10:00Z',
    items: [
        {
            id: 'item-1',
            productId: 'prod-1',
            productName: 'Cơm sườn nướng',
            productImage: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg',
            unitPrice: 45000,
            selectedOptions: null,
            quantity: 1,
            note: null,
            createdAt: '2026-05-01T12:30:00Z',
        },
        {
            id: 'item-2',
            productId: 'prod-2',
            productName: 'Chả trứng hấp',
            productImage: 'https://cdn.pixabay.com/photo/2017/06/07/22/20/grilled-pork-2382904_1280.jpg',
            unitPrice: 30000,
            selectedOptions: null,
            quantity: 1,
            note: 'Ít mặn',
            createdAt: '2026-05-01T12:30:00Z',
        },
    ],
    statusHistory: [
        { id: 'h-1', status: 'PENDING', note: null, createdBy: null, createdAt: '2026-05-01T12:30:00Z' },
        { id: 'h-2', status: 'CONFIRMED', note: null, createdBy: null, createdAt: '2026-05-01T12:35:00Z' },
        { id: 'h-3', status: 'PREPARING', note: null, createdBy: null, createdAt: '2026-05-01T12:40:00Z' },
        { id: 'h-4', status: 'READY', note: null, createdBy: null, createdAt: '2026-05-01T12:55:00Z' },
        { id: 'h-5', status: 'DELIVERING', note: null, createdBy: null, createdAt: '2026-05-01T13:00:00Z' },
        { id: 'h-6', status: 'DELIVERED', note: null, createdBy: null, createdAt: '2026-05-01T13:10:00Z' },
    ],
};

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

