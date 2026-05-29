import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const ORANGE = '#E8441A';
const CREAM  = '#FEF3E8';

const schema = z.object({
  name:        z.string().min(1, 'Tên cửa hàng không được trống'),
  description: z.string().optional(),
  phone:       z.string().min(1, 'Số điện thoại không được trống'),
  address:     z.string().min(1, 'Địa chỉ không được trống'),
});
type FormData = z.infer<typeof schema>;

export default function StoreInfoScreen() {
  const router = useRouter();
  const [cover, setCover] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Kinetic Kitchen', description: 'Fresh, healthy food made with love', phone: '0901234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
  });

  const pickCover = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, aspect: [16, 9], quality: 0.8 });
    if (!r.canceled) setCover(r.assets[0].uri);
  };

  const onSubmit = (data: FormData) => { console.log({ ...data, cover }); router.back(); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1a1a1a" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cửa hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Cover */}
          <TouchableOpacity style={styles.cover} onPress={pickCover}>
            {cover
              ? <Image source={{ uri: cover }} style={styles.coverImg} />
              : <View style={styles.coverPlaceholder}>
                  <Ionicons name="image-outline" size={36} color={ORANGE} />
                  <Text style={styles.coverText}>Ảnh bìa cửa hàng</Text>
                  <Text style={styles.coverSub}>Tỉ lệ 16:9 · tối đa 5MB</Text>
                </View>
            }
            <View style={styles.coverCamBtn}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>Tên cửa hàng *</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Tên cửa hàng" />
              {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
            </View>
          )} />

          <Controller control={control} name="description" render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput style={[styles.input, styles.textarea]} value={value} onChangeText={onChange}
                placeholder="Giới thiệu về cửa hàng..." multiline numberOfLines={3} textAlignVertical="top" />
            </View>
          )} />

          <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="0901234567" keyboardType="phone-pad" />
              {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}
            </View>
          )} />

          <Controller control={control} name="address" render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>Địa chỉ *</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Số nhà, đường, quận, thành phố" />
              {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}
            </View>
          )} />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.saveBtnText}>Lưu thông tin</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  content:          { padding: 16, paddingBottom: 40 },
  cover:            { borderRadius: 14, overflow: 'hidden', height: 180, backgroundColor: CREAM, marginBottom: 20 },
  coverImg:         { width: '100%', height: '100%' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  coverText:        { color: ORANGE, fontWeight: '600', fontSize: 15 },
  coverSub:         { color: '#aaa', fontSize: 12 },
  coverCamBtn:      { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 8 },
  field:            { marginBottom: 16 },
  label:            { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input:            { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: '#1a1a1a' },
  textarea:         { height: 80 },
  error:            { color: '#e53e3e', fontSize: 12, marginTop: 4 },
  saveBtn:          { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
});