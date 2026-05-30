import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { Category } from '@/types';
import { CategoryResponseDto } from "@/types/category";

export function CategoryButton({ id, name, iconUrl, onCategorySelected }: CategoryResponseDto & { onCategorySelected?: (categoryId: string) => void }) {
    return (
        <TouchableOpacity style={styles.categorybutton} onPress={() => onCategorySelected?.(id)}>
            <Image source={{ uri: iconUrl || '' }} style={styles.image} />
            <Text style={{ fontSize: 15, paddingTop: 5, textAlign: 'center' }}>{name}</Text>
        </TouchableOpacity>
    );
}

export function CategoriesList({ categories, onCategorySelected }: { categories: CategoryResponseDto[], onCategorySelected: (categoryId: string) => void }) {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Danh mục</Text>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => <CategoryButton {...item} onCategorySelected={onCategorySelected} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 80,
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
