import { useState, useEffect } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ReturnButton } from "../../components/ui/ReturnButton";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { fileService } from "@/services/fileService";
import { boolean } from "zod";

export default function ProfileDetail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  console.log(user);
  // Form inputs state
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { data: readUrlResponse } = useQuery({
    queryKey: ["read-url"],
    queryFn: () => fileService.getReadUrl(user?.avatarFileKey || ""),
    enabled: !!user?.avatarFileKey,
  });
  const [change, setChange] = useState(false);
  // Sync input states with Zustand user context when loaded
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

  // Function to pick image from device storage
  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Vui lòng cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện!",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setAvatarUrl(selectedUri);
        setChange(true);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      alert("Có lỗi xảy ra khi chọn ảnh!");
    }
  };

  // Mutation to update profile on backend (PUT /users/{id})
  const updateProfileMutation = useMutation({
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
      console.log("Thành công", "Cập nhật thông tin cá nhân thành công");
    },
    onError: (error) => {
      console.log(error);
      console.log("Lỗi", "Cập nhật thông tin cá nhân thất bại");
    },
  });

  const handleSave = async () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      Alert.alert("Thông tin", "Thông tin không được để trống!");
      return;
    }

    try {
      let finalAvatarFileKey = user?.avatarFileKey || "";

      if (change) {
        const fileName = avatarUrl.split("/").pop() || "image.jpg";
        const fileExtension = fileName.split(".").pop()?.toLowerCase();
        const contentType =
          fileExtension === "png" ? "image/png" : "image/jpeg";

        const uploadUrlResponse = await fileService.getUploadUrl(
          fileName,
          contentType,
        );
        const { uploadUrl, fileKey } = uploadUrlResponse;

        await fileService.uploadFile(uploadUrl, avatarUrl, contentType);

        finalAvatarFileKey = fileKey;
      }

      updateProfileMutation.mutate({
        userId: user?.id || "",
        name: fullName,
        avatarUrl: finalAvatarFileKey,
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý:", error);
      Alert.alert(
        "Lỗi",
        (error as Error).message || "Có lỗi xảy ra khi upload ảnh.",
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ReturnButton onpressfunction={router.back} />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#EE4D2D",
              flex: 1,
              textAlign: "center",
              marginRight: 40,
            }}
          >
            Cập nhật thông tin
          </Text>
        </View>

        {/* Form Body */}
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Picker Container */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.85}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={50} color="#9ca3af" />
              </View>
            )}
            <View style={styles.photoIconWrapper}>
              <MaterialIcons name="add-a-photo" size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Thay đổi ảnh đại diện</Text>

          {/* Input Fields */}
          <Text style={styles.text}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên của bạn"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.text}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              updateProfileMutation.isPending && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={updateProfileMutation.isPending}
            activeOpacity={0.85}
          >
            {updateProfileMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <FontAwesome5 name="save" size={20} color="white" />
                <Text style={styles.saveButtonText}>Lưu thông tin</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 8,
  },
  body: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "relative",
    borderRadius: 10,
    borderColor: "#ee4d2d25",
    borderWidth: 4,
    width: 120,
    height: 120,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
  avatarImage: {
    width: 112,
    height: 112,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
  },
  photoIconWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: {
    alignSelf: "center",
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 24,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
    marginBottom: 16,
    marginTop: 6,
  },
  readonlyInput: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    color: "#9ca3af",
  },
  fieldNote: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: -10,
    marginBottom: 16,
    paddingLeft: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginTop: 4,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    gap: 10,
    backgroundColor: "#EE4D2D",
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#EE4D2D",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
