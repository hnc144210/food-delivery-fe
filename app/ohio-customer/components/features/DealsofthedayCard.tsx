import { ProductCardData } from '@/types';
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ProductCard_Large } from "./ProductCard";
import { ProductResponseDto } from '@/types/product';

export function DealsOfTheDay({ dealoftheday, title, categoryfilter }: { dealoftheday: ProductResponseDto[], title: string, categoryfilter: string }) {
    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
            <FlatList
                data={dealoftheday.filter(item => categoryfilter === '' || item.categoryId?.includes(categoryfilter))}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                renderItem={({ item }) => <ProductCard_Large {...item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}