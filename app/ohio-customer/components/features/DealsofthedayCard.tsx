import { ProductCardData } from '@/types';
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ProductCard_Large } from "./ProductCard";

export function DealsOfTheDay({ dealoftheday }: { dealoftheday: ProductCardData[] }) {
    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ưu đãi hôm nay</Text>
            <FlatList
                data={dealoftheday}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                renderItem={({ item }) => <ProductCard_Large {...item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}