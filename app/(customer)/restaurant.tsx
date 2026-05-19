import { Image, StyleSheet, TouchableOpacity, View, Text, ScrollView, FlatList } from "react-native";
import { useState, useEffect, useMemo } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { ProductCard_Large, ProductCard_Small } from "../../components/features/ProductCard";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { mock_nearbyrestaurant } from "../../mock/home";
import { ProductCardData } from "@/types";

export default function Restaurant() {
    const [isMenu, setIsMenu] = useState(true);
    const [isReview, setIsReview] = useState(false);
    const [isInfo, setIsInfo] = useState(false);

    const { id } = useLocalSearchParams<{ id: string }>();
    const restaurant = useMemo(() => mock_nearbyrestaurant.find(r => r.id === id), [id]);
    if (!restaurant) {
        return (
            <View style={styles.container}>
                <Text>Restaurant not found</Text>
            </View>
        );
    }
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={{ width: '100%', height: 320, position: 'relative' }}>
                <Image source={{ uri: restaurant.banner_url }} style={{ width: '100%', height: 320, backgroundColor: 'lightgray' }} />
                <View style={{ position: 'absolute', top: 50, left: 20, }}>
                    <ReturnButton onpressfunction={router.back} />
                </View>
                <View style={styles.restaurantinfo_container}>
                    <Image source={{ uri: restaurant.logo_url }} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }} />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.restaurantname}>{restaurant.name}</Text>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="field-time" size={15} color="black" />
                            <Text> Delivery in {restaurant.preparetime} mins</Text>
                            <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <AntDesign name="star" size={15} color="black" />
                                <Text >{restaurant.rating}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 20, paddingHorizontal: 20, paddingTop: 15 }}>
                <TouchableOpacity style={isMenu ? styles.active : styles.inactive} onPress={() => { setIsMenu(true); setIsReview(false); setIsInfo(false); }}>
                    <Text style={isMenu ? styles.activeText : styles.inactiveText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={isReview ? styles.active : styles.inactive} onPress={() => { setIsMenu(false); setIsReview(true); setIsInfo(false); }}>
                    <Text style={isReview ? styles.activeText : styles.inactiveText}>Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={isInfo ? styles.active : styles.inactive} onPress={() => { setIsMenu(false); setIsReview(false); setIsInfo(true); }}>
                    <Text style={isInfo ? styles.activeText : styles.inactiveText}>Info</Text>
                </TouchableOpacity>
            </View>
            {/**main menu */}
            {isMenu && (
                <View style={styles.body}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 23 }}>Best Sellers</Text>
                        <View style={{ height: 1, flex: 1, backgroundColor: 'lightgray', marginLeft: 10 }} />
                    </View>
                    <View>
                        <FlatList
                            data={restaurant.popularproduct}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                            renderItem={({ item }) => <ProductCard_Large {...item} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 23 }}>Main Dishes</Text>
                        <View style={{ height: 1, flex: 1, backgroundColor: 'lightgray', marginLeft: 10 }} />
                    </View>
                    <View style={{ flexDirection: 'column', gap: 20 }}>
                        {restaurant.popularproduct.map((product, index) => (
                            <ProductCard_Small key={index} {...product} />
                        ))}
                    </View>
                </View>
            )}
            {isReview && (
                <View style={styles.body}>
                    <Text>Review</Text>
                </View>
            )}
            {isInfo && (
                <View style={styles.body}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>About restaurant</Text>
                        <View style={{ height: 1, flex: 1, backgroundColor: 'lightgray', marginLeft: 10 }} />
                    </View>
                    <View style={{ flexDirection: 'column', gap: 20 }}>
                        <Text>{restaurant.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Opening time</Text>
                        <View style={{ height: 1, flex: 1, backgroundColor: 'lightgray', marginLeft: 10 }} />
                    </View>
                    <View style={{ flexDirection: 'column', gap: 20 }}>
                        <Text>{restaurant.opening_time} - {restaurant.closing_time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Location</Text>
                        <View style={{ height: 1, flex: 1, backgroundColor: 'lightgray', marginLeft: 10 }} />
                    </View>
                </View>
            )}
            <View style={{ height: 50 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    restaurantinfo_container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: "90%",
        height: 110,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    restaurantname: {
        fontWeight: 'bold',
        fontSize: 30,
        width: 240,
    },
    body: {
        width: '100%',
        height: '100%',
        padding: 20,
        backgroundColor: 'rgba(240, 240, 240, 1)',
    },
    active: {
        borderBottomWidth: 2,
        height: 35,
        borderBottomColor: '#EE4D2D',
    },
    inactive: {
        borderBottomWidth: 0,
    },
    activeText: {
        color: '#EE4D2D',
        fontWeight: 'bold',
        fontSize: 15
    },
    inactiveText: {
        color: '#c2c2c2ff',
    }
});