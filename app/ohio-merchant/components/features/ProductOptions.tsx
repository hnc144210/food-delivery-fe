import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProductOption = {
    id: string;
    name?: string;
    max_selection?: number;
    options: ProductOptionValue[];
}

export type ProductOptionValue = {
    id: string,
    name: string;
    extra_price: number;
    is_selected: boolean;
}

function formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + 'đ';
}

export function ProductOptions({ option, onSelectOption }: { option: ProductOption, onSelectOption: (option: ProductOption, optionValue: ProductOptionValue) => void }) {
    const [selectedOption, setSelectedOption] = useState<boolean[]>(option.options?.map(() => false) || []);
    const handleSelectOption = (index: number) => {
        const max_selection = option.max_selection;
        const selectedCount = selectedOption.filter(Boolean).length;
        if (selectedOption[index]) {
            setSelectedOption(prev => prev.map((checked, i) => i === index ? !checked : checked));
        } else if (max_selection != null && selectedCount < max_selection) {
            setSelectedOption(prev => prev.map((checked, i) => i === index ? !checked : checked));
        }
    }
    const getOpacity = (index: number) => {
        const selectedCount = selectedOption.filter(Boolean).length;
        if (!selectedOption[index] && option.max_selection != null && selectedCount === option.max_selection) {
            return 0.6;
        }
        return 1;
    }
    const getDisable = (index: number) => {
        return !selectedOption[index] && option.max_selection != null && selectedOption.filter(Boolean).length === option.max_selection;
    }
    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 12, fontSize: 15, fontWeight: '700', color: '#1a1a1a', }}>{option.name}</Text>
            {option.options?.map((value, index) => (
                <TouchableOpacity key={index} style={[styles.optionRow, { opacity: getOpacity(index) }]} onPress={() => { handleSelectOption(index); onSelectOption(option, value) }} disabled={getDisable(index)}>
                    <View style={[styles.checkbox, selectedOption[index] && styles.checkboxSelected]}>
                        {selectedOption[index] && <AntDesign name="check" size={11} color="white" />}
                    </View>
                    <Text style={styles.optionLabel}>{value.name}</Text>
                    <Text style={styles.optionPrice}>+{formatPrice(value.extra_price)}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        gap: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        borderColor: '#EE4D2D',
        backgroundColor: '#EE4D2D',
    },
    optionLabel: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    optionPrice: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
})
