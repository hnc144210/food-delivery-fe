import { Category, FoodItem, Option, OptionGroup, ProductCardData, RestaurantCardData, VoucherData } from '@/types';


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
    { name: 'Cơm Tấm HiHi', rating: 4.4, distance: 1.2, preparetime: 14, popularproduct: mock_productdata.filter(f => f.food.restaurantId === '1') },
    { name: 'Cà Phê Phố Cổ', rating: 3.6, distance: 0.2, preparetime: 10, popularproduct: mock_productdata.filter(f => f.food.restaurantId === '2') },
]