import { useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function ProfileDetail() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const router = useRouter();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ReturnButton onpressfunction={router.back} />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#EE4D2D' }}>Cập nhật thông tin</Text>
                </View>
                <View style={styles.body}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', overflow: 'hidden', borderRadius: 10, borderColor: '#ee4d2d25', borderWidth: 3 }}>
                        <Image source={{ uri: 'https://wqtjigusdqbtcmdykboy.supabase.co/storage/v1/object/public/photos/aya.jpg' }} style={{ width: 120, height: 120 }} />
                        <MaterialIcons name="add-a-photo" size={24} color="#ffffffff" style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, paddingLeft: 3, paddingTop: 3, backgroundColor: '#00000083', borderTopLeftRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ alignSelf: 'center' }}>Avatar</Text>

                    <Text style={styles.text}>Full name</Text>
                    <TextInput style={styles.input} placeholder="Your full name" value={fullName} onChangeText={setFullName} />
                    <Text style={styles.text}>Phone number</Text>
                    <TextInput style={styles.input} placeholder="Your phone number" value={phoneNumber} onChangeText={setPhoneNumber} />
                    <Text style={styles.text}>Vehicle plate</Text>
                    <TextInput style={styles.input} placeholder="Your vehicle plate" value={vehiclePlate} onChangeText={setVehiclePlate} />
                    <Text style={styles.text}>License number</Text>
                    <TextInput style={styles.input} placeholder="Your license number" value={licenseNumber} onChangeText={setLicenseNumber} />

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: 60, gap: 10, backgroundColor: '#EE4D2D', borderRadius: 12, marginTop: 10 }}>
                        <FontAwesome5 name="save" size={20} color="white" />
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Lưu thông tin</Text>
                    </TouchableOpacity>
                </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: 'auto',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        gap: 8,
    },
    body: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 2,
        borderColor: '#ee4d2d25',
        backgroundColor: 'white',
        borderRadius: 7,
        paddingHorizontal: 15,
        marginBottom: 20,
        marginTop: 5
    },
    text: {
        fontSize: 18,
        fontWeight: '400'
    },
});