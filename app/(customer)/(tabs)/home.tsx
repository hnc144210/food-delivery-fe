import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SearchBar } from "../../../components/ui/SearchBar";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { DealsOfTheDay } from "../../../components/features/DealsofthedayCard";
import { NearbyRestaurant } from "../../../components/features/NearbyrestaurantCard";
import { CategoriesList } from "../../../components/features/CategoriesList";
import { VoucherList } from "../../../components/features/VoucherList";
import { useRouter } from "expo-router"

import { mock_categories, mock_dealoftheday, mock_vouchers } from "../../../mock/home";

export default function HomeScreen() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();

    const handlePressSearch = () => {
        //do something
        router.push('/searchresult');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {/**header */}
                <View style={styles.header}>
                    {!isSearching &&
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <EvilIcons name="location" size={20} color="white" />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Delivery to: Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <AntDesign name="shopping-cart" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10 }}>
                        {isSearching && <ReturnButton onpressfunction={() => { setIsSearching(false) }} />}
                        <SearchBar value={searchQuery} onChangeText={(e) => setSearchQuery(e)} onPressfunction={() => { setIsSearching(true) }} onSubmit={handlePressSearch} />
                    </View>
                </View>

                {/**body */}
                {!isSearching && <ScrollView style={styles.body}>
                    <VoucherList vouchers={mock_vouchers} />
                    <CategoriesList categories={mock_categories} />
                    <DealsOfTheDay dealoftheday={mock_dealoftheday} />
                    <NearbyRestaurant nearbyrestaurants={mock_dealoftheday} />
                    <View style={{ height: 80, width: '100%' }} />
                </ScrollView>}
                {isSearching && <View style={styles.body}>
                    <CategoriesList categories={mock_categories} />
                </View>}
            </View>
        </TouchableWithoutFeedback>
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

    //header
    header: {
        flexDirection: 'column',
        backgroundColor: '#EE4D2D',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 8,
    },

    //body
    body: {
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        padding: 20,
    },
});