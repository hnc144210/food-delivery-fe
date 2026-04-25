import { TouchableOpacity, Image, View, Text } from "react-native";
import { ProductCardData } from "../../mock/home";
import AntDesign from "@expo/vector-icons/AntDesign";

export function ProductCard_Large({ name, base_price, discount_price, image_url, prep_time, rating }: ProductCardData) {
    return (
        <TouchableOpacity style={{ backgroundColor: 'white', flexDirection: 'column', borderRadius: 12, width: 240, height: 245, marginBottom: 20 }}>
            <Image source={{ uri: image_url }} style={{ height: 160, width: 240, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
            <View style={{ paddingVertical: 7, paddingHorizontal: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
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

export function ProductCard_Medium({ name, base_price, discount_price, image_url, prep_time, rating }: ProductCardData) {
    return (
        <TouchableOpacity style={{ flexDirection: 'column', borderRadius: 12, width: 145, height: 200 }}>
            <Image source={{ uri: image_url }} style={{ height: 145, width: 145, borderRadius: 20 }} />
            <View style={{ padding: 0, marginTop: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#B22203' }}>{base_price}đ</Text>
            </View>

        </TouchableOpacity>
    );
}

export function ProductCard_Small({ name, base_price, discount_price, image_url, prep_time, rating }: ProductCardData) {
    return (
        <TouchableOpacity style={{ backgroundColor: 'white', flexDirection: 'row', borderRadius: 12, width: '100%', height: 100, alignItems: 'center' }}>
            <Image source={{ uri: image_url }} style={{ width: 100, height: 100, borderRadius: 12 }} />
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{name}</Text>
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