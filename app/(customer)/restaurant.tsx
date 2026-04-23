import { Image, StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { ProductCard_Small } from "../../components/features/ProductCard";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import { ProductCardData } from "../../types/type";
import { mock_productdata } from "../../mock/home";

export default function Restaurant() {
    const [resBackgroudImage, setResBackgroudImage] = useState('https://i.pinimg.com/736x/cd/dc/7c/cddc7c0939c3c9ee479605beb6a8f9f8.jpg');
    const [resName, setResName] = useState('Cơm Tấm HiHi');
    const [resReview, setResReview] = useState('1k+');
    const [resDeliveryTime, setResDeliveryTime] = useState(14);
    const [resRating, setResRating] = useState(4);

    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={{ width: '100%', height: 320, position: 'relative' }}>
                <Image source={{ uri: resBackgroudImage }} style={{ width: '100%', height: 320, backgroundColor: 'lightgray' }} />
                <View style={{ position: 'absolute', top: 50, left: 20, }}>
                    <ReturnButton onpressfunction={router.back} />
                </View>
                <View style={styles.restaurantinfo_container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.restaurantname}>{resName}</Text>
                        <View style={styles.rating_container}>
                            <AntDesign name="star" size={10} color="black" />
                            <Text >{resRating}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="message-square" size={15} color="black" />
                            <Text> {resReview} reviews</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="field-time" size={15} color="black" />
                            <Text> Delivery in {resDeliveryTime} mins</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
                <TouchableOpacity>
                    <Text>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Info</Text>
                </TouchableOpacity>
            </View>
            {/**main menu */}
            <View style={styles.body}>
                <Text>Best Sellers</Text>
                <ProductCard_Small {...mock_productdata[0]} />

                <Text>Main Dishes</Text>
                <ProductCard_Small {...mock_productdata[1]} />
                <ProductCard_Small {...mock_productdata[2]} />
            </View>
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
        width: "90%",
        height: 110,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 25,
    },
    restaurantname: {
        fontWeight: 'bold',
        fontSize: 30,
        width: 240,
    },
    rating_container: {
        backgroundColor: '#ff765b65',
        width: 50,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    body: {
        width: '100%',
        height: '100%',
        padding: 20,
        backgroundColor: 'rgba(240, 240, 240, 1)',
    }
});