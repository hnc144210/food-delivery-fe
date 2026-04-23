import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { RestaurantCardData } from "../../types/type";
import { ProductCard_Medium } from "./ProductCard";
import { useRouter } from "expo-router";


export function RestaurantCard({ name, rating, distance, preparetime, popularproduct }: RestaurantCardData) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.name}>{name}</Text>
                <TouchableOpacity onPress={() => { router.push('/restaurant') }}>
                    <Text style={styles.menu_button}>Menu</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.restaurantinfo}>
                <Text><AntDesign name="star" size={10} color="#B22203" /> {rating}</Text>
                <Text><Feather name="navigation" size={10} color="black" /> {distance}km</Text>
                <Text><AntDesign name="clock-circle" size={10} color="black" /> {preparetime} mins</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <FlatList
                    data={popularproduct}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 20 }}
                    renderItem={({ item }) => <ProductCard_Medium {...item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 300,
        width: "100%",
        borderRadius: 20,
        padding: 30,
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    menu_button: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#B22203',
    },
    restaurantinfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 8,
    },
})