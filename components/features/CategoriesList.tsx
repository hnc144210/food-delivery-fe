import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { Category } from "../../types/type";

export function CategoryButton({ id, name, icon_url }: Category) {
    return (
        <TouchableOpacity style={styles.categorybutton}>
            <Image source={{ uri: icon_url }} style={styles.image} />
            <Text style={{ fontSize: 15, paddingTop: 5 }}>{name}</Text>
        </TouchableOpacity>
    );
}

export function CategoriesList({ categories }: { categories: Category[] }) {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Categories</Text>
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
        padding: 20
    },
    categorybutton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 100,
        margin: 10,
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
