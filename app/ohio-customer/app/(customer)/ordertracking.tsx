import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useOrderTracking } from "@/hooks/useOrderTracking";

const ORANGE = "#EE4D2D";
type LatLng = { latitude: number; longitude: number };
function LeafletMap({
  pickup,
  dropoff,
  shipper,
}: {
  pickup: LatLng | null;
  dropoff: LatLng | null;
  shipper: LatLng | null;
}) {
  const center = shipper ??
    dropoff ?? { latitude: 10.8231, longitude: 106.6297 };

  const markersJs = [
    pickup
      ? `L.marker([${pickup.latitude}, ${pickup.longitude}], {
          icon: L.divIcon({ className: '', html: '<div style="background:#f59e0b;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:14px">🏪</div>', iconSize:[28,28], iconAnchor:[14,14] })
        }).addTo(map).bindPopup("Nhà hàng");`
      : "",
    dropoff
      ? `L.marker([${dropoff.latitude}, ${dropoff.longitude}], {
          icon: L.divIcon({ className: '', html: '<div style="background:#22c55e;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:14px">🏠</div>', iconSize:[28,28], iconAnchor:[14,14] })
        }).addTo(map).bindPopup("Điểm giao");`
      : "",
    shipper
      ? `L.marker([${shipper.latitude}, ${shipper.longitude}], {
          icon: L.divIcon({ className: '', html: '<div style="background:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:2px solid #EE4D2D;font-size:16px">🛵</div>', iconSize:[32,32], iconAnchor:[16,16] })
        }).addTo(map).bindPopup("Shipper");`
      : "",
    shipper && dropoff
      ? `L.polyline([[${shipper.latitude},${shipper.longitude}],[${dropoff.latitude},${dropoff.longitude}]], {color:'#EE4D2D', weight:3, dashArray:'6,4'}).addTo(map);`
      : "",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>html,body,#map{margin:0;padding:0;height:100%;width:100%;}</style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${center.latitude}, ${center.longitude}], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    ${markersJs}
  </script>
</body>
</html>`;

  return (
    <WebView
      source={{ html }}
      style={{ flex: 1 }}
      scrollEnabled={false}
      javaScriptEnabled
    />
  );
}
// mapping delivery assignment status → order step index
const DELIVERY_STEP: Record<string, number> = {
  Created: 2,
  Assigned: 2,
  PickingUp: 2,
  PickedUp: 3,
  Delivering: 3,
  Delivered: 4,
  Failed: 3,
};

const ORDER_STEP: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PREPARING: 1,
  READY: 2,
  PICKED_UP: 3,
  DELIVERING: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

const STEPS = [
  { label: "Đặt hàng thành công", icon: "checkmark-circle" },
  { label: "Merchant xác nhận", icon: "storefront" },
  { label: "Shipper đến lấy", icon: "bicycle" },
  { label: "Đang giao hàng", icon: "navigate" },
  { label: "Đã giao thành công", icon: "flag" },
] as const;

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị",
  READY: "Sẵn sàng giao",
  PICKED_UP: "Shipper đã lấy hàng",
  DELIVERING: "Đang giao hàng",
  DELIVERED: "Đã giao thành công",
  CANCELLED: "Đã hủy",
};

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { order, shipperLocation, isLoading } = useOrderTracking(id!);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#888" }}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity onPress={router.back} style={{ marginTop: 12 }}>
          <Text style={{ color: ORANGE, fontWeight: "700" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStep = ORDER_STEP[order.status] ?? 0;

  const dropoffCoord =
    order.deliveryLat && order.deliveryLng
      ? { latitude: order.deliveryLat, longitude: order.deliveryLng }
      : null;

  const handleChat = () => {
    router.push({
      pathname: "/(customer)/chatroom",
      params: { orderId: order.id, type: "ORDER_SHIPPER" },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
          <Text style={styles.headerSub}>
            #{order.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Status */}
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusLabel}>
            {STATUS_LABEL[order.status] ?? order.status}
          </Text>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <LeafletMap
            pickup={null}
            dropoff={dropoffCoord}
            shipper={shipperLocation}
          />
        </View>

        {/* Stepper */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tiến trình đơn hàng</Text>
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const pending = i > currentStep;
            return (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepCircle,
                      done && styles.stepCircleDone,
                      active && styles.stepCircleActive,
                      pending && styles.stepCirclePending,
                    ]}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={12} color="white" />
                    ) : (
                      <Ionicons
                        name={step.icon as any}
                        size={12}
                        color={active ? "white" : "#ccc"}
                      />
                    )}
                  </View>
                  {i < STEPS.length - 1 && (
                    <View
                      style={[styles.stepLine, done && styles.stepLineDone]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    done && styles.stepLabelDone,
                    active && styles.stepLabelActive,
                    pending && styles.stepLabelPending,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Delivery address */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="location" size={18} color={ORANGE} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
              <Text style={styles.addressText}>
                {[order.deliveryAddress, order.deliveryWard, order.deliveryCity]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Chat CTA */}
        <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color="white"
          />
          <Text style={styles.chatBtnText}>Nhắn tin với shipper</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#888" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "white" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },

  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    margin: 12,
    marginBottom: 0,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  statusLabel: { fontSize: 15, fontWeight: "700", color: "#1f2937" },
  statusSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },

  mapContainer: {
    margin: 12,
    borderRadius: 14,
    overflow: "hidden",
    height: 220,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  map: { flex: 1 },

  markerMerchant: {
    backgroundColor: "#f59e0b",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  markerDropoff: {
    backgroundColor: "#22c55e",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  markerShipper: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: ORANGE,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  card: {
    backgroundColor: "white",
    margin: 12,
    marginBottom: 0,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  cardRow: { flexDirection: "row", alignItems: "flex-start" },

  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 0 },
  stepLeft: { alignItems: "center", marginRight: 12, width: 24 },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleDone: { backgroundColor: ORANGE },
  stepCircleActive: { backgroundColor: ORANGE },
  stepCirclePending: { backgroundColor: "#e5e7eb" },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: "#e5e7eb",
    marginVertical: 2,
  },
  stepLineDone: { backgroundColor: ORANGE },
  stepLabel: { fontSize: 13, paddingTop: 4, paddingBottom: 26 },
  stepLabelDone: { color: "#6b7280" },
  stepLabelActive: { color: ORANGE, fontWeight: "700" },
  stepLabelPending: { color: "#d1d5db" },

  shipperRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  shipperAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEF3E8",
    alignItems: "center",
    justifyContent: "center",
  },
  shipperName: { fontSize: 14, fontWeight: "700", color: "#1f2937" },
  shipperSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  chatIconBtn: { padding: 8 },

  addressText: { fontSize: 13, color: "#6b7280", lineHeight: 20 },

  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 14,
    margin: 12,
    marginTop: 16,
  },
  chatBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
});
