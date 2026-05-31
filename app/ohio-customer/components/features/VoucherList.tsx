import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VoucherResponseDto } from "@/types/voucher";
import { LinearGradient } from "expo-linear-gradient";

export function Voucher({ name, description, startDate, endDate }: VoucherResponseDto) {
    return (
        <TouchableOpacity style={styles.voucherbanner}>
            <LinearGradient
                colors={['#EE4D2D', '#ffd900ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', width: 305, height: 130, borderRadius: 12 }}
            />
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>{name}</Text>
            <Text style={{ fontSize: 13, color: 'white' }}>{description}</Text>
            <Text style={{ fontSize: 13, color: 'white' }}>{startDate} - {endDate}</Text>
        </TouchableOpacity>
    );
}

export function VoucherList({ vouchers }: { vouchers: VoucherResponseDto[] }) {
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
