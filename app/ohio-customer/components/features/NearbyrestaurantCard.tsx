import { ProductCardData } from '@/types';
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { ProductCard_Small } from "./ProductCard";
import { useState } from "react";
import { ProductResponseDto } from '@/types/product';

export function NearbyRestaurant({ nearbyrestaurants, title, categoryfilter }: { nearbyrestaurants: ProductResponseDto[], title: string, categoryfilter: string }) {
    const [selection, setSelection] = useState('all');
    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 5 }}>
                <TouchableOpacity style={selection === 'all' ? styles.selected : styles.normal} onPress={() => setSelection('all')}>
                    <Text style={selection === 'all' ? { color: '#EE4D2D' } : {}}>Tất cả</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selection === 'rating' ? styles.selected : styles.normal} onPress={() => setSelection('rating')}>
                    <Text style={selection === 'rating' ? { color: '#EE4D2D' } : {}}>Đánh giá 4+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selection === 'fast' ? styles.selected : styles.normal} onPress={() => setSelection('fast')}>
                    <Text style={selection === 'fast' ? { color: '#EE4D2D' } : {}}>Giao dưới 15 phút</Text>
                </TouchableOpacity>
            </View>
            <View style={{ gap: 15 }}>
                {nearbyrestaurants.filter(item => (categoryfilter === '' || item.categoryId?.includes(categoryfilter)) && ((selection === 'all') || (selection === 'rating' && (item.averageRating ?? 0) >= 4) || (selection === 'fast' && (item.prepTime ?? 0) <= 15))).map((nearbyrestaurant, index) => (
                    <ProductCard_Small key={index} {...nearbyrestaurant} />
                ))}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    normal: {
        width: 'auto',
        paddingHorizontal: 20,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    selected: {
        width: 'auto',
        paddingHorizontal: 20,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ee4d2d1a',
    },
})