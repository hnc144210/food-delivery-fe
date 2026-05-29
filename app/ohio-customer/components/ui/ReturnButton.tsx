import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity, StyleSheet } from "react-native";

export function ReturnButton({ onpressfunction }: { onpressfunction?: () => void }) {
    return (
        <TouchableOpacity style={styles.return_button} onPress={onpressfunction}>
            <AntDesign name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    return_button: {
        backgroundColor: '#ffffffa9',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
})