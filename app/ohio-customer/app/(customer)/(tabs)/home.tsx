import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native";
import { SearchBar } from "@/components/ui/SearchBar";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ReturnButton } from "@/components/ui/ReturnButton";
import { DealsOfTheDay } from "@/components/features/DealsofthedayCard";
import { NearbyRestaurant } from "@/components/features/NearbyrestaurantCard";
import { CategoriesList } from "@/components/features/CategoriesList";
import { VoucherList } from "@/components/features/VoucherList";
import { useRouter } from "expo-router";

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { mock_addresses_new, mock_vouchers_new, mock_categories_new, mock_productdata_new } from "@/mock/home";
import { homeService } from "@/services/homeService";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriesFilter, setCategoriesFilter] = useState('');

    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const userId = user?.id;

    // ─── React Query Hooks ────────────────────────────────────────────────────

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: homeService.getCategories,
    });

    const { data: vouchers } = useQuery({
        queryKey: ['vouchers'],
        queryFn: orderService.getVouchers,
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: homeService.getProducts,
    });

    const { data: addresses } = useQuery({
        queryKey: ['addresses', userId],
        queryFn: () => userService.getAddresses(userId!),
        enabled: !!userId,
    });

    // Find default or first address to display in header
    const addressList = addresses?.items || mock_addresses_new
    const addressLabel = addressList?.find(addr => addr.IsDefault)?.Label || addressList[0]?.Label || 'null';

    const categoryList = categories?.items || mock_categories_new;

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
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Nơi giao hàng: {addressLabel}</Text>
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
                    {categoriesFilter === '' && <View style={{ flexDirection: 'column', gap: 10 }}>
                        {/**vouchers */}
                        <VoucherList vouchers={vouchers?.items || mock_vouchers_new} />

                        {/**categories */}
                        <CategoriesList categories={categoryList} onCategorySelected={(categoryId) => setCategoriesFilter(categoryId)} />

                        {/**products */}
                        <DealsOfTheDay dealoftheday={products?.items || mock_productdata_new} title="Món ăn đặc biệt hôm nay" categoryfilter={categoriesFilter} />
                        <NearbyRestaurant nearbyrestaurants={products?.items || mock_productdata_new} title="Nhà hàng lân cận" categoryfilter={categoriesFilter} />
                    </View>}
                    {categoriesFilter !== '' && <View style={{ flexDirection: 'column', gap: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }} onPress={() => setCategoriesFilter('')}>
                                <AntDesign name="arrow-left" size={20} color="black" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D', textAlign: 'center' }}>{categoryList.find(ca => ca.id === categoriesFilter)?.name}</Text>
                            <View style={{ width: 40 }} />
                        </View>
                        <View style={{ flexDirection: 'column', gap: 10 }}>
                            <DealsOfTheDay dealoftheday={products?.items || mock_productdata_new} title="Sản phẩm nổi bật" categoryfilter={categoriesFilter} />
                            <NearbyRestaurant nearbyrestaurants={products?.items || mock_productdata_new} title="Nhà hàng lân cận" categoryfilter={categoriesFilter} />
                        </View>
                    </View>}
                    <View style={{ height: 80, width: '100%' }} />
                </ScrollView>}
                {isSearching && <View style={styles.body}>
                    <CategoriesList categories={categoryList} onCategorySelected={(categoryId) => { setIsSearching(false); setCategoriesFilter(categoryId) }} />
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