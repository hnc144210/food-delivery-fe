import { ProductCardData } from "../../mock/home";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ProductCard_Large } from "./ProductCard";

export function DealsOfTheDay({ dealoftheday }: { dealoftheday: ProductCardData[] }) {
    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Deal of the Day</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text>Handpicked savings just for you</Text>
                <TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', color: '#EE4D2D' }}>View All</Text>
                </TouchableOpacity>
            </View>
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