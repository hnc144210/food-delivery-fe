import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native";
import { SearchBar } from "../../../components/ui/SearchBar";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { DealsOfTheDay } from "../../../components/features/DealsofthedayCard";
import { NearbyRestaurant } from "../../../components/features/NearbyrestaurantCard";
import { CategoriesList } from "../../../components/features/CategoriesList";
import { VoucherList } from "../../../components/features/VoucherList";
import { useRouter } from "expo-router";

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { mock_categories, mock_productdata, mock_vouchers, mock_addresses } from "../../../mock/home";

// ─── API Request Functions ───────────────────────────────────────────────────

async function fetchCategories() {
    try {
        const response = await api.get('/catalog/categories');
        const resData = response.data;
        // Map ApiResponse<T> where T might be wrapped in .data or returned directly
        const rawData = resData.success ? resData.data : resData;
        if (Array.isArray(rawData)) {
            return rawData.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                icon_url: cat.iconUrl || cat.icon_url || 'https://via.placeholder.com/150',
            }));
        }
        return mock_categories;
    } catch (error) {
        console.log('Error fetching categories from backend, using mock:', error);
        return mock_categories;
    }
}

async function fetchVouchers() {
    try {
        const response = await api.get('/orders/vouchers');
        const resData = response.data;
        const rawData = resData.success ? resData.data : resData;
        if (Array.isArray(rawData)) {
            return rawData.map((v: any) => ({
                description: v.description || v.name || `${v.code} - Giảm ${v.discountValue}`,
                start_date: new Date(v.startDate).toLocaleDateString('vi-VN'),
                end_date: new Date(v.endDate).toLocaleDateString('vi-VN'),
                image_url: 'https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg',
            }));
        }
        return mock_vouchers;
    } catch (error) {
        console.log('Error fetching vouchers from backend, using mock:', error);
        return mock_vouchers;
    }
}

async function fetchProducts() {
    try {
        const response = await api.get('/catalog/products');
        const resData = response.data;
        const rawData = resData.success ? resData.data : resData;
        if (Array.isArray(rawData)) {
            return rawData.map((p: any) => ({
                food: {
                    id: p.id,
                    restaurantId: p.merchantId,
                    categoryId: p.categoryId || '',
                    name: p.name,
                    price: Number(p.basePrice),
                    image: p.imageUrl || 'https://via.placeholder.com/150',
                    isAvailable: p.isAvailable,
                    options: [],
                },
                base_price: Number(p.basePrice),
                discount_price: p.discountPrice ? Number(p.discountPrice) : Number(p.basePrice),
                prep_time: p.prepTime || 15,
                rating: p.averageRating ? Number(p.averageRating) : 5.0,
            }));
        }
        return mock_productdata;
    } catch (error) {
        console.log('Error fetching products from backend, using mock:', error);
        return mock_productdata;
    }
}

async function fetchAddresses(userId?: string) {
    if (!userId) return mock_addresses;
    try {
        const response = await api.get(`/users/${userId}/addresses`);
        const resData = response.data;
        const rawData = resData.success ? resData.data : resData;
        if (Array.isArray(rawData)) {
            return rawData.map((addr: any) => ({
                id: addr.id,
                addressLabel: addr.label || 'Địa chỉ',
                receiverName: addr.recipientName || '',
                receiverPhone: addr.phone || '',
                addressLine: addr.addressLine || '',
                street: addr.ward || '',
                district: addr.district || '',
                city: addr.city || '',
                defaultAddress: addr.isDefault || false,
            }));
        }
        return mock_addresses;
    } catch (error) {
        console.log('Error fetching addresses from backend, using mock:', error);
        return mock_addresses;
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const userId = user?.id;

    // ─── React Query Hooks ────────────────────────────────────────────────────

    const { data: categories = mock_categories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        placeholderData: mock_categories,
    });

    const { data: vouchers = mock_vouchers } = useQuery({
        queryKey: ['vouchers'],
        queryFn: fetchVouchers,
        placeholderData: mock_vouchers,
    });

    const { data: products = mock_productdata } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        placeholderData: mock_productdata,
    });

    const { data: addresses = mock_addresses } = useQuery({
        queryKey: ['addresses', userId],
        queryFn: () => fetchAddresses(userId),
        placeholderData: mock_addresses,
        enabled: !!userId,
    });

    // Find default or first address to display in header
    const defaultAddress = addresses.find(addr => addr.defaultAddress) || addresses[0];
    const addressLabel = defaultAddress ? defaultAddress.addressLabel : 'Home';

    const handlePressSearch = () => {
        //do something
        router.push('/searchresult');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {/**header */}
                <View style={styles.header}>
                    {!isSearching &&
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push('/(customer)/addresses')}>
                                <EvilIcons name="location" size={20} color="white" />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Delivery to: {addressLabel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <AntDesign name="shopping-cart" size={20} color="white" onPress={() => router.navigate('/(customer)/(tabs)/cart')} />
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10 }}>
                        {isSearching && <ReturnButton onpressfunction={() => { setIsSearching(false) }} />}
                        <SearchBar value={searchQuery} onChangeText={(e) => setSearchQuery(e)} onPressfunction={() => { setIsSearching(true) }} onSubmit={handlePressSearch} />
                    </View>
                </View>

                {/**body */}
                {!isSearching && <ScrollView style={styles.body}>
                    <VoucherList vouchers={vouchers} />
                    <CategoriesList categories={categories} />
                    <DealsOfTheDay dealoftheday={products} />
                    <NearbyRestaurant nearbyrestaurants={products} />
                    <View style={{ height: 80, width: '100%' }} />
                </ScrollView>}
                {isSearching && <View style={styles.body}>
                    <CategoriesList categories={categories} />
                </View>}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F6F6',
    },

    //header
    header: {
        flexDirection: 'column',
        backgroundColor: '#EE4D2D',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 8,
    },

    //body
    body: {
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        padding: 20,
    },
});