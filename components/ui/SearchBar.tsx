import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from '@expo/vector-icons/Feather';
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";

export function SearchBar({ onPressfunction, onSubmit, value = "", onChangeText }: { onPressfunction?: () => void, onSubmit?: () => void, value?: string, onChangeText?: (text: string) => void }) {
    return (
        <View style={styles.searchbar}>
            <EvilIcons name="search" size={24} color="#EE4D2D" />
            <TextInput placeholder="What are you craving today?" onPress={onPressfunction} style={{ flex: 1 }} value={value} onChangeText={onChangeText} />
            {value !== '' &&
                <TouchableOpacity onPress={onSubmit}>
                    <Feather name="send" size={20} color="#EE4D2D" />
                </TouchableOpacity>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    searchbar: {
        backgroundColor: '#E1E3E3',
        borderRadius: 12,
        height: 45,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
})