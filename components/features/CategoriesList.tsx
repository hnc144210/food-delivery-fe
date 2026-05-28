import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { CategoryResponseDto } from "@/types/category";

export function CategoryButton({ id, name, iconUrl }: CategoryResponseDto) {
    return (
        <TouchableOpacity style={styles.categorybutton}>
            <Image source={{ uri: iconUrl || '' }} style={styles.image} />
            <Text style={{ fontSize: 13, paddingTop: 5 }}>{name}</Text>
        </TouchableOpacity>
    );
}

export function CategoriesList({ categories }: { categories: CategoryResponseDto[] }) {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Danh mục</Text>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => <CategoryButton {...item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        marginVertical: 20,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    categorybutton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        margin: 5,
    },
    category_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginVertical: 10
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
        overflow: 'hidden',
    },
})
