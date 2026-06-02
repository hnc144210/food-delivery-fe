import { AddressCardProps, Category, FoodItem, Option, OptionGroup, ProductCardData, RestaurantCardData, User, VoucherData } from '@/types';
import { AddressResponseDto } from '@/types/address';
import { CategoryResponseDto } from '@/types/category';
import { ProductOptionResponseDto, ProductResponseDto } from '@/types/product';
import { MerchantProfileResponseDto } from '@/types/profile';
import { VoucherResponseDto } from '@/types/voucher';


export const category1: Category = { id: '1', name: 'Rice', icon_url: 'https://i.pinimg.com/736x/8a/54/a3/8a54a3ccbd7ee75edcccc397b3c7c2d3.jpg' }
export const category2: Category = { id: '2', name: 'Drink', icon_url: 'https://i.pinimg.com/1200x/c3/57/03/c357037fcaa3766f88394b7d87227682.jpg' }
export const category3: Category = { id: '3', name: 'Noodle', icon_url: 'https://cdn.pixabay.com/photo/2016/01/29/17/08/feast-noodles-1168322_1280.jpg' }
export const category4: Category = { id: '4', name: 'Snack', icon_url: 'https://cdn.pixabay.com/photo/2016/09/06/16/18/pretzels-1649483_1280.jpg' }
export const category5: Category = { id: '5', name: 'Fast Food', icon_url: 'https://cdn.pixabay.com/photo/2020/09/14/16/23/burger-5571385_1280.jpg' }
export const category6: Category = { id: '6', name: 'Pizza', icon_url: 'https://cdn.pixabay.com/photo/2020/06/08/16/49/pizza-5275191_1280.jpg' }
export const category7: Category = { id: '7', name: 'Bread', icon_url: 'https://cdn.pixabay.com/photo/2017/05/15/01/18/baked-2313462_1280.jpg' }
export const category8: Category = { id: '8', name: 'Seafood', icon_url: 'https://cdn.pixabay.com/photo/2020/03/21/03/59/lobster-4952603_1280.jpg' }

export const option1: Option = { id: '1', name: 'Nhỏ', priceDiff: 0 }
export const option2: Option = { id: '2', name: 'Vừa', priceDiff: 5000 }
export const option3: Option = { id: '3', name: 'Lớn', priceDiff: 10000 }

export const option4: Option = { id: '4', name: 'Thêm thịt', priceDiff: 6000 }
export const option5: Option = { id: '5', name: 'Thêm rau', priceDiff: 3000 }

export const option6: Option = { id: '6', name: 'Thêm sữa', priceDiff: 2000 }
export const option7: Option = { id: '7', name: 'Thêm đá', priceDiff: 1000 }

export const optiongroup1: OptionGroup = { id: '1', name: 'Chọn size', required: true, maxSelect: 1, options: [option1, option2, option3] }
export const optiongroup2: OptionGroup = { id: '2', name: 'Chọn topping', required: false, maxSelect: 2, options: [option4, option5] }
export const optiongroup3: OptionGroup = { id: '3', name: 'Chọn topping', required: false, maxSelect: 2, options: [option6, option7] }

export const food1: FoodItem = { id: '1', restaurantId: '1', categoryId: '1', name: 'Cơm chiên đặc biệt', price: 30000, image: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', isAvailable: true, options: [optiongroup1, optiongroup2] }
export const food2: FoodItem = { id: '2', restaurantId: '1', categoryId: '1', name: 'Cơm bình dân', price: 20000, image: 'https://cdn.pixabay.com/photo/2016/10/23/09/37/fried-rice-1762493_1280.jpg', isAvailable: true, options: [optiongroup1, optiongroup2] }
export const food3: FoodItem = { id: '3', restaurantId: '1', categoryId: '1', name: 'Cơm gà', price: 15000, image: 'https://cdn.pixabay.com/photo/2017/12/16/17/46/fried-rice-3023040_1280.jpg', isAvailable: true, options: [optiongroup1, optiongroup2] }
export const food4: FoodItem = { id: '4', restaurantId: '2', categoryId: '2', name: 'Cà phê đen', price: 20000, image: 'https://cdn.pixabay.com/photo/2014/12/11/02/56/coffee-563797_1280.jpg', isAvailable: true, options: [optiongroup1, optiongroup3] }
export const food5: FoodItem = { id: '5', restaurantId: '2', categoryId: '2', name: 'Trà sữa', price: 20000, image: 'https://i.pinimg.com/736x/49/e3/45/49e345191b35bc57fb61c4cf4cc7a0f7.jpg', isAvailable: true, options: [optiongroup1, optiongroup3] }

export const foods: FoodItem[] = [food1, food2, food3, food4, food5]



//vouchers
export const mock_vouchers: VoucherData[] = [
    { description: "Giảm 50% ngay lúc này, nhận ngay nào!", start_date: "2026-04-21", end_date: "2026-04-22", image_url: 'https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg' },
    { description: "Giảm 20% bùng nổ chiết khấu!!!", start_date: "2026-04-21", end_date: "2026-04-22", image_url: 'https://cdn.pixabay.com/photo/2020/06/02/18/10/noodles-5252012_1280.jpg' },
    { description: "Săn voucher nóng hổi", start_date: "2026-04-21", end_date: "2026-04-22", image_url: 'https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg' },
];

//categories
export const mock_categories: Category[] = [category1, category2, category3, category4, category5, category6, category7, category8];


//restaurant data
export const mock_productdata: ProductCardData[] = [
    { food: food1, base_price: 30000, discount_price: 30000, prep_time: 20, rating: 4.5 },
    { food: food2, base_price: 20000, discount_price: 17000, prep_time: 12, rating: 4.2 },
    { food: food3, base_price: 15000, discount_price: 14000, prep_time: 6, rating: 4.1 },
    { food: food4, base_price: 20000, discount_price: 20000, prep_time: 8, rating: 3.9 },
    { food: food5, base_price: 20000, discount_price: 20000, prep_time: 15, rating: 4.6 },
];

export const mock_nearbyrestaurant: RestaurantCardData[] = [
    { id: '1', name: 'Cơm Tấm HiHi', logo_url: 'https://cdn.pixabay.com/photo/2022/02/10/05/44/wuzhen-7004638_1280.jpg', banner_url: 'https://cdn.pixabay.com/photo/2022/02/10/05/44/wuzhen-7004638_1280.jpg', rating: 4.4, opening_time: '06:00', closing_time: '17:00', distance: 1.2, preparetime: 14, description: 'Cơm tấm là món ăn Việt Nam bao gồm cơm được nấu từ gạo tấm, ăn kèm với nhiều loại đồ mặn', popularproduct: mock_productdata.filter(f => f.food.restaurantId === '1') },
    { id: '2', name: 'Cà Phê Phố Cổ', logo_url: 'https://cdn.pixabay.com/photo/2020/09/21/05/58/coffee-5589038_1280.jpg', banner_url: 'https://cdn.pixabay.com/photo/2020/09/21/05/58/coffee-5589038_1280.jpg', rating: 3.6, opening_time: '08:30', closing_time: '23:30', distance: 0.2, preparetime: 10, description: 'Cà phê là thức uống được yêu thích của nhiều người', popularproduct: mock_productdata.filter(f => f.food.restaurantId === '2') },
]

export const mock_addresses: AddressCardProps[] = [
    { id: '1', addressLabel: 'Nhà', receiverName: 'Nguyễn Văn A', receiverPhone: '0123456789', addressLine: 'Số 123', street: 'Đường ABC', district: 'Quận 1', city: 'Thành phố Hồ Chí Minh', defaultAddress: true },
    { id: '2', addressLabel: 'Địa chỉ 2', receiverName: 'Nguyễn Văn B', receiverPhone: '0123456789', addressLine: 'Số 123', street: 'Đường ABC', district: 'Quận 1', city: 'Thành phố Hồ Chí Minh', defaultAddress: false },
    { id: '3', addressLabel: 'Địa chỉ 3', receiverName: 'Nguyễn Văn C', receiverPhone: '0123456789', addressLine: 'Số 123', street: 'Đường ABC', district: 'Quận 1', city: 'Thành phố Hồ Chí Minh', defaultAddress: false },
]
export const option1_new: ProductOptionResponseDto = {
    id: '1',
    categoryId: '1',
    name: 'Chọn size',
    isRequired: true,
    maxSelections: 1,
    createdAt: '2022-02-10',
    values: [
        {
            id: '1',
            name: 'Size S',
            additionalPrice: 0,
            isAvailable: true,
        },
        {
            id: '2',
            name: 'Size M',
            additionalPrice: 5000,
            isAvailable: true,
        },
        {
            id: '3',
            name: 'Size L',
            additionalPrice: 10000,
            isAvailable: true,
        },
    ],
}

export const option2_new: ProductOptionResponseDto = {
    id: '2',
    categoryId: '1',
    name: 'Chọn topping',
    isRequired: false,
    maxSelections: 2,
    createdAt: '2022-02-10',
    values: [
        {
            id: '1',
            name: 'Thịt nướng',
            additionalPrice: 0,
            isAvailable: true,
        },
        {
            id: '2',
            name: 'Thịt xíu mại',
            additionalPrice: 5000,
            isAvailable: true,
        },
        {
            id: '3',
            name: 'Trứng ốp la',
            additionalPrice: 10000,
            isAvailable: true,
        },
    ],
}

export const option3_new: ProductOptionResponseDto = {
    id: '3',
    categoryId: '1',
    name: 'Chọn topping',
    isRequired: false,
    maxSelections: 2,
    createdAt: '2022-02-10',
    values: [
        {
            id: '1',
            name: 'Không đường',
            additionalPrice: 0,
            isAvailable: true,
        },
        {
            id: '2',
            name: 'Thêm đá',
            additionalPrice: 5000,
            isAvailable: true,
        },
        {
            id: '3',
            name: 'Thêm sữa',
            additionalPrice: 10000,
            isAvailable: true,
        },
    ],
}

export const mock_productdata_new: ProductResponseDto[] = [
    { id: '1', merchantId: '1', categoryId: '1', name: 'Cơm chiên đặc biệt', description: 'Cơm tấm là món ăn Việt Nam bao gồm cơm được nấu từ gạo tấm, ăn kèm với nhiều loại đồ mặn', imageUrl: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', basePrice: 30000, discountPrice: 30000, prepTime: 20, averageRating: 4.5, isAvailable: true, isFeatured: true, category: { id: '1', name: 'Món mặn' }, reviewCount: 100, createdAt: '2022-02-10', updatedAt: '2022-02-10', deletedAt: null, options: [option1_new, option2_new] },
    { id: '2', merchantId: '2', categoryId: '1', name: 'Cà bình dân', description: 'Đậm vị truyền thống, hương vị cà phê Việt Nam chuẩn gu!', imageUrl: 'https://cdn.pixabay.com/photo/2016/10/23/09/37/fried-rice-1762493_1280.jpg', basePrice: 20000, discountPrice: 17000, prepTime: 12, averageRating: 3.8, isAvailable: true, isFeatured: true, category: { id: '2', name: 'Thức uống' }, reviewCount: 200, createdAt: '2022-02-10', updatedAt: '2022-02-10', deletedAt: null, options: [option1_new, option2_new] },
    { id: '3', merchantId: '1', categoryId: '1', name: 'Cơm gà xối mỡ', description: 'Đậm vị truyền thống, hương vị cà phê Việt Nam chuẩn gu!', imageUrl: 'https://cdn.pixabay.com/photo/2016/10/23/09/37/fried-rice-1762493_1280.jpg', basePrice: 15000, discountPrice: 14000, prepTime: 6, averageRating: 4.1, isAvailable: true, isFeatured: true, category: { id: '1', name: 'Món mặn' }, reviewCount: 300, createdAt: '2022-02-10', updatedAt: '2022-02-10', deletedAt: null, options: [option1_new, option2_new] },
    { id: '4', merchantId: '2', categoryId: '2', name: 'Cà phê đen', description: 'Đậm vị cà phê Việt Nam chuẩn gu!', imageUrl: 'https://cdn.pixabay.com/photo/2014/12/11/02/56/coffee-563797_1280.jpg', basePrice: 20000, discountPrice: 20000, prepTime: 8, averageRating: 3.9, isAvailable: true, isFeatured: true, category: { id: '2', name: 'Thức uống' }, reviewCount: 130, createdAt: '2022-02-10', updatedAt: '2022-02-10', deletedAt: null, options: [option1_new, option3_new] },
    { id: '5', merchantId: '1', categoryId: '2', name: 'Trà sữa', description: 'Đậm vị trà sữa Việt Nam chuẩn gu!', imageUrl: 'https://i.pinimg.com/736x/49/e3/45/49e345191b35bc57fb61c4cf4cc7a0f7.jpg', basePrice: 20000, discountPrice: 20000, prepTime: 15, averageRating: 4.6, isAvailable: true, isFeatured: true, category: { id: '1', name: 'Món mặn' }, reviewCount: 10, createdAt: '2022-02-10', updatedAt: '2022-02-10', deletedAt: null, options: [option1_new, option2_new] },
];

export const mock_addresses_new: AddressResponseDto[] = [
    { Id: '1', UserId: '1', Label: 'Nhà', RecipientName: 'Nguyễn Văn A', Phone: '0123456789', AddressLine: 'Số 123', Ward: 'Đường ABC', District: 'Quận 1', City: 'Thành phố Hồ Chí Minh', IsDefault: true, CreatedAt: '2022-02-10', Lat: 10.8231, Lng: 106.6297 },
    { Id: '2', UserId: '1', Label: 'Địa chỉ 2', RecipientName: 'Nguyễn Văn B', Phone: '0123456789', AddressLine: 'Số 123', Ward: 'Đường ABC', District: 'Quận 1', City: 'Thành phố Hồ Chí Minh', IsDefault: false, CreatedAt: '2022-02-10', Lat: 10.7769, Lng: 106.7009 },
    { Id: '3', UserId: '1', Label: 'Địa chỉ 3', RecipientName: 'Nguyễn Văn C', Phone: '0123456789', AddressLine: 'Số 123', Ward: 'Đường ABC', District: 'Quận 1', City: 'Thành phố Hồ Chí Minh', IsDefault: false, CreatedAt: '2022-02-10', Lat: 10.7769, Lng: 106.7009 },
];

export const mock_categories_new: CategoryResponseDto[] = [
    { id: '1', name: 'Món mặn', description: 'Món ăn mặn', iconUrl: 'https://cdn.pixabay.com/photo/2016/10/23/09/37/fried-rice-1762493_1280.jpg', parentId: null, sortOrder: 1, isActive: true, createdAt: '2022-02-10', deletedAt: null, parent: null, children: [], productCount: 10 },
    { id: '2', name: 'Thức uống', description: 'Thức uống', iconUrl: 'https://cdn.pixabay.com/photo/2014/12/11/02/56/coffee-563797_1280.jpg', parentId: null, sortOrder: 2, isActive: true, createdAt: '2022-02-10', deletedAt: null, parent: null, children: [], productCount: 10 },
];

export const mock_vouchers_new: VoucherResponseDto[] = [
    { id: '1', code: 'FREE10', name: 'Giảm giá 10%', description: 'Giảm giá 10% cho đơn hàng', discountType: 'PERCENTAGE', discountValue: 10, maxDiscount: 50000, minOrderAmount: 10000, discountTarget: 'SUBTOTAL', merchantId: '1', usageLimit: 100, perUserLimit: 1, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true, createdAt: '2022-02-10', deletedAt: null, usedCount: 10, remainingUsage: 90, availability: 'active' },
    { id: '2', code: 'FREE20', name: 'Giảm giá 20%', description: 'Giảm giá 20% cho đơn hàng', discountType: 'PERCENTAGE', discountValue: 20, maxDiscount: 100000, minOrderAmount: 20000, discountTarget: 'SUBTOTAL', merchantId: '1', usageLimit: 100, perUserLimit: 1, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true, createdAt: '2022-02-10', deletedAt: null, usedCount: 10, remainingUsage: 90, availability: 'active' },
    { id: '3', code: 'FREE30', name: 'Giảm giá 30%', description: 'Giảm giá 30% cho đơn hàng', discountType: 'PERCENTAGE', discountValue: 30, maxDiscount: 150000, minOrderAmount: 30000, discountTarget: 'SUBTOTAL', merchantId: '1', usageLimit: 100, perUserLimit: 1, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true, createdAt: '2022-02-10', deletedAt: null, usedCount: 10, remainingUsage: 90, availability: 'active' },
    { id: '4', code: 'FREE40', name: 'Giảm giá 40%', description: 'Giảm giá 40% cho đơn hàng', discountType: 'PERCENTAGE', discountValue: 40, maxDiscount: 200000, minOrderAmount: 40000, discountTarget: 'SUBTOTAL', merchantId: '1', usageLimit: 100, perUserLimit: 1, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true, createdAt: '2022-02-10', deletedAt: null, usedCount: 10, remainingUsage: 90, availability: 'active' },
    { id: '5', code: 'FREE50', name: 'Giảm giá 50%', description: 'Giảm giá 50% cho đơn hàng', discountType: 'PERCENTAGE', discountValue: 50, maxDiscount: 250000, minOrderAmount: 50000, discountTarget: 'SUBTOTAL', merchantId: '1', usageLimit: 100, perUserLimit: 1, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true, createdAt: '2022-02-10', deletedAt: null, usedCount: 10, remainingUsage: 90, availability: 'active' },
]