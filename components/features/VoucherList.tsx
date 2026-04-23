import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VoucherData } from "../../types/type";

export function Voucher({ description, start_date, end_date, image_url }: VoucherData) {
    return (
        <TouchableOpacity style={styles.voucherbanner}>
            <Image style={{ position: 'absolute', width: 305, height: 130 }} source={{ uri: image_url }} />
            <View style={{ position: 'absolute', width: 305, height: 130, backgroundColor: 'black', opacity: 0.5 }} />
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>{description}</Text>
            <Text style={{ fontSize: 13, color: 'white' }}>{start_date} - {end_date}</Text>
        </TouchableOpacity>
    );
}

export function VoucherList({ vouchers }: { vouchers: VoucherData[] }) {
    return (
        <View style={{ height: 130 }}>
            <FlatList
                data={vouchers}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                renderItem={({ item }) => <Voucher {...item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    voucherbanner: {
        width: 305,
        height: 130,
        backgroundColor: 'lightgray',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 8,
        overflow: 'hidden'
    },
})
