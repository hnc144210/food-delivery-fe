export interface MerchantOrderItem {
  id: string
  name: string
  quantity: number
  optionSummary?: string // "Little Dairy, No Onions"
}

export type MerchantOrderStatus = "new" | "confirmed" | "preparing" | "delivering" | "cancelled";
export type DeliverySubStatus = 'waiting_pickup' | 'on_the_way'

export interface MerchantOrder {
  id: string
  orderNumber: string
  customerName: string
  createdAt: string
  items: MerchantOrderItem[]
  notes?: string
  total: number
  paymentMethod: 'COD' | 'Online'
  status: MerchantOrderStatus
  deliverySubStatus?: DeliverySubStatus
  tag?: string // "VÀO MÃI", "TOP ORDER"...
}

const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString()

export const mockMerchantOrders: MerchantOrder[] = [
  {
    id: '1',
    orderNumber: 'ORDER #KK-4302',
    customerName: 'Kinetic Feast Box',
    createdAt: ago(3),
    items: [
      { id: 'i1', name: 'Bún Bò Huế Special', quantity: 2, optionSummary: 'Little Dairy, No Onions' },
      { id: 'i2', name: 'Summer Rolls (Pork)', quantity: 1, optionSummary: 'Teriyaki Sauce on Side' },
    ],
    notes: 'Thêm ớt',
    total: 42.50,
    paymentMethod: 'Online',
    status: 'new',
    tag: 'VÀO MÃI',
  },
  {
    id: '2',
    orderNumber: 'ORDER #KK-4301',
    customerName: 'Kinetic Feast Box',
    createdAt: ago(6),
    items: [
      { id: 'i3', name: 'Bún Bò Huế Special', quantity: 2, optionSummary: 'Little Dairy, No Onions' },
      { id: 'i4', name: 'Summer Rolls (Pork)', quantity: 1, optionSummary: 'Teriyaki Sauce on Side' },
    ],
    notes: 'Thêm ớt',
    total: 42.50,
    paymentMethod: 'Online',
    status: 'new',
    tag: 'VÀO MÃI',
  },
  {
    id: '3',
    orderNumber: 'ORDER #KK-4299',
    customerName: 'Marcus T.',
    createdAt: ago(11),
    items: [
      { id: 'i5', name: 'Chicken Pho', quantity: 2 },
      { id: 'i6', name: 'Veggie Rolls', quantity: 1 },
    ],
    total: 78000,
    paymentMethod: 'Online',
    status: 'preparing',
  },
  {
    id: '4',
    orderNumber: 'ORDER #KK-4295',
    customerName: 'Elena R.',
    createdAt: ago(28),
    items: [
      { id: 'i7', name: 'Pork Bánh Mì', quantity: 4 },
      { id: 'i8', name: 'Iced Tea', quantity: 4 },
    ],
    total: 156000,
    paymentMethod: 'COD',
    status: 'delivering',
    deliverySubStatus: 'waiting_pickup',
  },
  {
    id: '5',
    orderNumber: 'ORDER #KK-4290',
    customerName: 'Office Pack B',
    createdAt: ago(28),
    items: [
      { id: 'i9', name: 'Mixed Spring Rolls', quantity: 10 },
      { id: 'i10', name: 'Large Platter', quantity: 1 },
    ],
    total: 320000,
    paymentMethod: 'Online',
    status: 'delivering',
    deliverySubStatus: 'on_the_way',
  },
]

export const mockShopStats = {
  active: 10,
  today: 42,
  feedbacks: 36,
}