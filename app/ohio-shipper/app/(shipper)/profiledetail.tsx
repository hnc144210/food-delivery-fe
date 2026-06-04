import { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { fileService } from "@/services/fileService";
import * as ImagePicker from "expo-image-picker";

export default function ProfileDetail() {
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { data: readUrlResponse } = useQuery({
    queryKey: ["read-url", user?.avatarFileKey],
    queryFn: () => fileService.getReadUrl(user?.avatarFileKey || ""),
    enabled: !!user?.avatarFileKey,
  });

  const { data: shipperdata } = useQuery({
    queryKey: ["shipper"],
    queryFn: () => userService.getShipperByUserId(user?.id || ""),
  });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (readUrlResponse?.readUrl) {
      setAvatarUrl(readUrlResponse.readUrl);
    }
  }, [readUrlResponse]);

  useEffect(() => {
    if (shipperdata) {
      setVehiclePlate(shipperdata.vehiclePlate || "");
    }
  }, [shipperdata]);

  const updateUserProfile = useMutation({
    mutationFn: (data: {
      userId: string;
      name: string;
      avatarUrl: string;
      phoneNumber: string;
    }) =>
      userService.updateProfile(data.userId, {
        fullName: data.name,
        avatarUrl: data.avatarUrl,
        phoneNumber: data.phoneNumber,
      }),
    onSuccess: (_, variables) => {
      if (user) {
        setUser({
          ...user,
          fullName: variables.name,
          avatarFileKey: variables.avatarUrl,
          phoneNumber: variables.phoneNumber,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Lỗi", "Cập nhật thông tin cá nhân thất bại");
    },
  });

  const updateShipperProfile = useMutation({
    mutationFn: (data: { shipperId: string; vehiclePlate: string }) =>
      userService.updateShipperProfile(data.shipperId, {
        vehiclePlate: data.vehiclePlate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipper"] });
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      router.back();
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Lỗi", "Cập nhật thông tin shipper thất bại");
    },
  });

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập",
          "Vui lòng cấp quyền truy cập thư viện ảnh!",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setLocalImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh!");
    }
  };

  const handleSave = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !vehiclePlate.trim()) {
      Alert.alert("Thông tin", "Thông tin không được để trống!");
      return;
    }
    setIsSaving(true);
    try {
      let finalAvatarFileKey = user?.avatarFileKey || "";

      if (localImageUri) {
        const fileName = localImageUri.split("/").pop() || "image.jpg";
        const fileExtension = fileName.split(".").pop()?.toLowerCase();
        const contentType =
          fileExtension === "png" ? "image/png" : "image/jpeg";

        const uploadUrlResponse = await fileService.getUploadUrl(
          fileName,
          contentType,
        );
        const { uploadUrl, fileKey } = uploadUrlResponse;
        await fileService.uploadFile(uploadUrl, localImageUri, contentType);
        finalAvatarFileKey = fileKey;
      }

      updateUserProfile.mutate({
        userId: user?.id || "",
        name: fullName,
        avatarUrl: finalAvatarFileKey,
        phoneNumber: phoneNumber,
      });

      updateShipperProfile.mutate({
        shipperId: shipperdata?.id || "",
        vehiclePlate: vehiclePlate,
      });
    } catch (error) {
      Alert.alert(
        "Lỗi",
        (error as Error).message || "Có lỗi xảy ra khi upload ảnh.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ReturnButton onpressfunction={router.back} />
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#EE4D2D" }}>
            Cập nhật thông tin
          </Text>
        </View>
        <View style={styles.body}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              overflow: "hidden",
              borderRadius: 10,
              borderColor: "#ee4d2d25",
              borderWidth: 3,
            }}
            onPress={handlePickImage}
          >
            <Image
              source={{ uri: localImageUri ?? avatarUrl }}
              style={{ width: 120, height: 120 }}
            />
            <MaterialIcons
              name="add-a-photo"
              size={24}
              color="#ffffffff"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                paddingLeft: 3,
                paddingTop: 3,
                backgroundColor: "#00000083",
                borderTopLeftRadius: 10,
              }}
            />
          </TouchableOpacity>
          <Text style={{ alignSelf: "center" }}>Avatar</Text>

          <Text style={styles.text}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
          />
          <Text style={styles.text}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Text style={styles.text}>Biển kiểm soát xe</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập biển kiểm soát xe"
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
          />

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 60,
              gap: 10,
              backgroundColor: "#EE4D2D",
              borderRadius: 12,
            }}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <FontAwesome5 name="save" size={20} color="white" />
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Lưu thông tin
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: "#F6F6F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 8,
  },
  body: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#ee4d2d25",
    backgroundColor: "white",
    borderRadius: 7,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
  },
});
