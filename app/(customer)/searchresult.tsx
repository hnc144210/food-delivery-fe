import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SearchBar } from "../../components/ui/SearchBar";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { RestaurantCard } from "../../components/features/RestaurantCard";
import { mock_nearbyrestaurant } from "../../mock/home";
import { useRouter } from "expo-router";


export default function SearchResult() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ReturnButton onpressfunction={router.back} />
                <SearchBar />
            </View>
            <ScrollView style={styles.body}>
                <View style={{ gap: 20 }}>
                    {mock_nearbyrestaurant.map((item, index) => <RestaurantCard key={index} {...item} />)}
                </View>
                <View style={{ height: 80, width: '100%' }} />
            </ScrollView>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F6F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 10
    },
    body: {
        paddingHorizontal: 20,
        flex: 1,
        width: '100%',
    }
})