import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { OrderCardHistory_ForDriver } from "../../../components/features/OrderCard";
import { useRouter } from "expo-router";
import { mock_assignment, mock_odercard } from "../../../mock/shipper";
import { useAuthStore } from "../../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "../../../services/deliveryService";
import { userService } from "@/services/userService";
import { MaterialIcons } from "@expo/vector-icons";

export default function HistoryPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data: shipperdata } = useQuery({
    queryKey: ["shipper"],
    queryFn: () => userService.getShipperByUserId(user?.id || ""),
  });

  const {
    data: assignedDeliveries,
    refetch: assignedDeliveriesRefetch,
    isFetching: isRefreshing,
  } = useQuery({
    queryKey: ["assigned-deliveries", shipperdata?.id],
    queryFn: () => deliveryService.getAssignedDeliveries(shipperdata?.id || ""),
    enabled: !!shipperdata?.id,
  });

  const assignedHistory =
    assignedDeliveries?.items.filter(
      (f) => f.status === "Delivered" || f.status === "Failed",
    ) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }}>
          Lịch sử giao hàng
        </Text>
      </View>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          gap: 20,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={assignedDeliveriesRefetch}
            colors={["#EE4D2D"]}
          />
        }
      >
        {assignedHistory.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
              width: "100%",
              height: 200,
              borderRadius: 12,
            }}
          >
            <MaterialIcons name="delivery-dining" size={44} color="#EE4D2D" />
            <Text style={{ fontSize: 18, color: "#EE4D2D" }}>
              Không có đơn hàng
            </Text>
          </View>
        ) : (
          assignedHistory.map((item, index) => (
            <OrderCardHistory_ForDriver key={index} data={item} />
          ))
        )}
      </ScrollView>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EE4D2D",
    width: "100%",
    height: "auto",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 30,
    gap: 8,
  },
});
