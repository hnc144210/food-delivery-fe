import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const { data: readUrlResponse } = useQuery({
    queryKey: ["read-url", user?.avatarFileKey],
    queryFn: () => fileService.getReadUrl(user?.avatarFileKey || ""),
    enabled: !!user?.avatarFileKey,
  });
  const handleLogout = () => {
    clearUser();
    router.replace("/login");
  };
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{
            uri:
              readUrlResponse?.readUrl ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            borderColor: "#ee4d2d41",
            borderWidth: 3,
          }}
        />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {user?.fullName}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ee4d2d1c",
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 90,
          }}
          onPress={() => router.push("/profiledetail")}
        >
          <EvilIcons name="pencil" size={20} color="#EE4D2D" />
          <Text style={{ color: "#EE4D2D" }}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wallet}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
            <Text style={{ color: "#bdbdbdff" }}>Ví tài xế</Text>
            <Text style={{ color: "white", fontSize: 35, fontWeight: "bold" }}>
              120000đ
            </Text>
          </View>
          <MaterialIcons
            name="account-balance-wallet"
            size={25}
            color="#bdbdbdff"
          />
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 50,
            gap: 10,
            backgroundColor: "#cfcfcfff",
            borderRadius: 12,
          }}
          onPress={() => router.push("/(shipper)/wallethistory")}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Lịch sử giao dịch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 50,
            gap: 10,
            backgroundColor: "#f36a4eff",
            borderRadius: 12,
          }}
          onPress={() => router.push("/(shipper)/topup")}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Nạp tiền vào ví
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#696969ff" />
        <Text style={{ fontSize: 15, color: "#696969ff" }}>
          Đăng xuất tài khoản
        </Text>
      </TouchableOpacity>
    </View>
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
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 20,
  },
  profile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    padding: 20,
    borderRadius: 20,
    gap: 5,
  },
  wallet: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#2e2e2eff",
    width: "100%",
    height: "auto",
    padding: 20,
    borderRadius: 20,
    gap: 5,
  },
  logout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    padding: 20,
    borderWidth: 2,
    borderColor: "#69696941",
    borderRadius: 12,
    gap: 5,
  },
});
