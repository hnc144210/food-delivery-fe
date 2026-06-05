import { extractData } from "@/lib/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PaginatedResponse, PageParams } from "@/types/api";

const BASE_URL = "http://192.168.48.47:8083";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  referenceId: string | null;
  referenceType: string;
}

const notifApi = axios.create({ baseURL: BASE_URL, timeout: 20000 });
notifApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const notificationService = {
  async getNotifications(params?: PageParams): Promise<PaginatedResponse<Notification>> {
    const res = await notifApi.get("/api/Notifications", { params });
    return extractData<PaginatedResponse<Notification>>(res);
  },

  async markAsRead(notificationId: string): Promise<void> {
    await notifApi.patch(`/api/Notifications/${notificationId}/read`);
  },
};