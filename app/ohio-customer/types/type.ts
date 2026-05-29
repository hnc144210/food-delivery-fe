export type VoucherData = {
    description: string;
    start_date: string;
    end_date: string;
    image_url: string;
}

export type Category = {
    id: string;
    name: string;
    icon_url: string;
}

export type ProductCardData = {
    id: string;
    name: string;
    base_price: number;
    discount_price: number;
    image_url: string;
    prep_time: number;
    rating: number;
}

export type RestaurantCardData = {
    name: string;
    rating: number;
    distance: number;
    preparetime: number;
    popularproduct: ProductCardData[];
}