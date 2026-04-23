import { ProductCardData } from "../../mock/home";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { ProductCard_Small } from "./ProductCard";
import { useState } from "react";

export function NearbyRestaurant({ nearbyrestaurants }: { nearbyrestaurants: ProductCardData[] }) {
    const [selection, setSelection] = useState('nearby');
    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Nearby Restaurant</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 5 }}>
                <TouchableOpacity style={selection === 'nearby' ? styles.selected : styles.normal} onPress={() => setSelection('nearby')}>
                    <Text style={selection === 'nearby' ? { color: '#EE4D2D' } : {}}>Nearby</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selection === 'rating' ? styles.selected : styles.normal} onPress={() => setSelection('rating')}>
                    <Text style={selection === 'rating' ? { color: '#EE4D2D' } : {}}>Rating 4+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selection === 'fast' ? styles.selected : styles.normal} onPress={() => setSelection('fast')}>
                    <Text style={selection === 'fast' ? { color: '#EE4D2D' } : {}}>Fast Delivery</Text>
                </TouchableOpacity>
            </View>
            <View style={{ gap: 15 }}>
                {nearbyrestaurants.map((nearbyrestaurant) => (
                    <ProductCard_Small key={nearbyrestaurant.id} {...nearbyrestaurant} />
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