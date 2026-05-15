import { TouchableOpacity, Image, View, Text, TextInput, StyleSheet, } from "react-native";
import { CartItem, ProductCardData } from '@/types';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OrderitemsData } from "../../mock/shipper";
import { useRouter } from "expo-router";
import { useState } from "react";

export function ProductCard_Large({ food, base_price, discount_price, prep_time, rating }: ProductCardData) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.large} onPress={() => router.push({ pathname: '/(customer)/product', params: { id: food.id } })}>
            <Image source={{ uri: food.image }} style={{ height: 160, width: 240, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
            <View style={{ paddingVertical: 7, paddingHorizontal: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{food.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#B22203' }}>{discount_price}đ</Text>
                    <View style={{ width: 10 }} />
                    {discount_price !== base_price && (
                        <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through' }}>{base_price}đ</Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="star" size={10} color="black" />
                    <Text> {rating}</Text>
                    <View style={{ width: 20 }} />
                    <AntDesign name="field-time" size={10} color="black" />
                    <Text> {prep_time} mins</Text>
                </View>

            </View>

        </TouchableOpacity>
    );
}

export function ProductCard_Medium({ food, discount_price }: ProductCardData) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.medium} onPress={() => router.push({ pathname: '/(customer)/product', params: { id: food.id } })}>
            <Image source={{ uri: food.image }} style={{ height: 145, width: 145, borderRadius: 20 }} />
            <View style={{ padding: 0, marginTop: 5 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{food.name}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#B22203' }}>{discount_price}đ</Text>
            </View>

        </TouchableOpacity>
    );
}

export function ProductCard_Small({ food, base_price, discount_price, prep_time, rating }: ProductCardData) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.small} onPress={() => router.push({ pathname: '/(customer)/product', params: { id: food.id } })}>
            <Image source={{ uri: food.image }} style={{ width: 100, height: 100, borderRadius: 12 }} />
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{food.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#B22203' }}>{discount_price}đ</Text>
                    <View style={{ width: 10 }} />
                    {discount_price !== base_price && (
                        <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through' }}>{base_price}đ</Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="star" size={10} color="black" />
                    <Text> {rating}</Text>
                    <View style={{ width: 20 }} />
                    <AntDesign name="field-time" size={10} color="black" />
                    <Text> {prep_time} mins</Text>
                </View>
            </View>

        </TouchableOpacity>
    );
}
export function ProductCard_InCartDetail({ item }: { item: CartItem }) {
    const [quantity, setQuantity] = useState(item.quantity);
    function formatPrice(price: number) {
        return price.toLocaleString('vi-VN') + 'đ';
    }
    const optionPrice = item.selectedOptions.reduce((total, price) => {
        return total + price.priceDiff
    }, 0)
    const totalPrice = (item.foodItem.price + optionPrice) * quantity
    return (
        <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 12, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, padding: 10, gap: 10 }}>
            <Image source={{ uri: item.foodItem.image }} style={{ width: 100, height: 100, borderRadius: 12 }} />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.foodItem.name}</Text>
                        <Text style={{ color: 'gray', fontSize: 12 }}>{item.selectedOptions.map((option) => option.name).join(', ')}</Text>
                    </View>
                    <TouchableOpacity>
                        <MaterialIcons name="delete" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B22203' }}>{formatPrice(totalPrice)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
                        <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 10 }} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                            <AntDesign name="minus" size={16} color="#EE4D2D" />
                        </TouchableOpacity>
                        <TextInput style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a', paddingHorizontal: 6, minWidth: 24, textAlign: 'center', }} onChangeText={(text) => setQuantity(Number(text) || 1)} value={quantity.toString()} />
                        <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 10 }} onPress={() => setQuantity(q => q + 1)}>
                            <AntDesign name="plus" size={16} color="#EE4D2D" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    )
}

export function ProductCard_ForDriver({ name, quantity, selected_options }: OrderitemsData) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', width: '100%', gap: 15 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F6F6', width: 40, height: 40, borderRadius: 12 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B22203' }}>{quantity}x</Text>
            </View>
            <View style={{ alignItems: 'flex-start', }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{name}</Text>
                <Text>{selected_options}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    small: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 12,
        width: '100%',
        height: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    medium: {
        flexDirection: 'column',
        borderRadius: 12,
        width: 145,
    },
    large: {
        backgroundColor: 'white',
        flexDirection: 'column',
        borderRadius: 12,
        width: 240,
        height: 245,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
})