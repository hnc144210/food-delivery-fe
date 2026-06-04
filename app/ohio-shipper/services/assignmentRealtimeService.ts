import AsyncStorage from '@react-native-async-storage/async-storage';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '@/constants/config';

// SignalR expects base gateway URL, not /api path
const gatewayBaseUrl = API_BASE_URL.includes('/api')
  ? API_BASE_URL.replace(/\/api\/?$/, '')
  : API_BASE_URL;

export function createAssignmentConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${gatewayBaseUrl}/hubs/assignments`, {
      accessTokenFactory: async () => {
        const token = await AsyncStorage.getItem('access_token');
        return token ?? '';
      },
    })
    .withAutomaticReconnect([0, 1000, 3000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Information)
    .build();
}

export type AssignmentOfferedPayload = {
  type: 'ASSIGNMENT_OFFERED';
  assignmentId: string;
  offerId: string;
  orderId: string;
  merchant: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  dropoff: {
    address: string;
    latitude: number;
    longitude: number;
  };
  estimatedDistanceToMerchantKm: number;
  estimatedDeliveryDistanceKm: number;
  estimatedFee: number;
  expiresAt: string;
};

export const realtimeEvents = {
  ASSIGNMENT_OFFERED: 'AssignmentOffered',
  ASSIGNMENT_EXPIRED: 'AssignmentExpired',
  ASSIGNMENT_ACCEPTED: 'AssignmentAccepted',
  ASSIGNMENT_TAKEN: 'AssignmentTaken',
  ASSIGNMENT_REJECTED: 'AssignmentRejected',
} as const;
