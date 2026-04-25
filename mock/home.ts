import { Category, ProductCardData, RestaurantCardData, VoucherData } from "../types/type";

//vouchers
export const mock_vouchers: VoucherData[] = [
    { description: "Giảm 50% ngay lúc này, nhận ngay nào!", start_date: "2026-04-21", end_date: "2026-04-22", image_url: 'https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg' },
    { description: "Giảm 20% bùng nổ chiết khấu!!!", start_date: "2026-04-21", end_date: "2026-04-22", image_url: 'https://cdn.pixabay.com/photo/2020/06/02/18/10/noodles-5252012_1280.jpg' },
    { description: "Săn voucher nóng hổi", start_date: "2026-04-21", end_date: "2026-04-22", image_url: 'https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg' },
];

//categories
export const mock_categories: Category[] = [
    { id: '1', name: 'Rice', icon_url: 'https://cdn.pixabay.com/photo/2017/10/03/04/18/rice-2811266_1280.jpg' },
    { id: '2', name: 'Milk Tea', icon_url: 'https://cdn.pixabay.com/photo/2018/07/18/07/56/drink-3545791_1280.jpg' },
    { id: '3', name: 'Noodle', icon_url: 'https://cdn.pixabay.com/photo/2016/01/29/17/08/feast-noodles-1168322_1280.jpg' },
    { id: '4', name: 'Snack', icon_url: 'https://cdn.pixabay.com/photo/2016/09/06/16/18/pretzels-1649483_1280.jpg' },
    { id: '5', name: 'Fast Food', icon_url: 'https://cdn.pixabay.com/photo/2020/09/14/16/23/burger-5571385_1280.jpg' },
    { id: '6', name: 'Pizza', icon_url: 'https://cdn.pixabay.com/photo/2020/06/08/16/49/pizza-5275191_1280.jpg' },
    { id: '7', name: 'Bread', icon_url: 'https://cdn.pixabay.com/photo/2017/05/15/01/18/baked-2313462_1280.jpg' },
    { id: '8', name: 'Seafood', icon_url: 'https://cdn.pixabay.com/photo/2020/03/21/03/59/lobster-4952603_1280.jpg' },
];

//deal of the day
export const mock_dealoftheday: ProductCardData[] = [
    { id: '1', name: 'Fried Rice', base_price: 10000, discount_price: 8000, image_url: 'https://cdn.pixabay.com/photo/2015/10/01/14/26/fried-rice-967081_1280.jpg', prep_time: 30, rating: 4.5 },
    { id: '2', name: 'Fried Rice', base_price: 10000, discount_price: 10000, image_url: 'https://cdn.pixabay.com/photo/2016/10/23/09/37/fried-rice-1762493_1280.jpg', prep_time: 30, rating: 4.5 },
    { id: '3', name: 'Fried Rice', base_price: 10000, discount_price: 8000, image_url: 'https://cdn.pixabay.com/photo/2017/12/16/17/46/fried-rice-3023040_1280.jpg', prep_time: 30, rating: 4.5 },
];

//restaurant data
export const mock_productdata: ProductCardData[] = [
    { id: '1', name: 'Fried Rice', base_price: 10000, discount_price: 8000, image_url: 'https://i.pinimg.com/1200x/5a/5c/bc/5a5cbc1f3e0fd3de31042662609143ca.jpg', prep_time: 30, rating: 4.5 },
    { id: '2', name: 'Fried Chicken', base_price: 10000, discount_price: 6000, image_url: 'https://i.pinimg.com/736x/ce/07/80/ce07803b0b7174dad4f070d7b3b5a75a.jpg', prep_time: 30, rating: 4.5 },
    { id: '3', name: 'Pizza', base_price: 5000, discount_price: 4000, image_url: 'https://cdn.pixabay.com/photo/2020/10/17/11/06/pizza-5661748_1280.jpg', prep_time: 15, rating: 4.0 },
];

export const mock_nearbyrestaurant: RestaurantCardData[] = [
    { name: 'Cơm Tấm HiHi', rating: 4.4, distance: 1.2, preparetime: 14, popularproduct: mock_productdata },
    { name: 'Bún Chả Hà Nội', rating: 3.6, distance: 0.2, preparetime: 10, popularproduct: mock_productdata },
    { name: 'Phở Bò 20', rating: 4, distance: 2.3, preparetime: 25, popularproduct: mock_productdata },
    { name: 'Cơm Nam', rating: 4.8, distance: 0.6, preparetime: 7, popularproduct: mock_productdata },
]