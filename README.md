# Food Delivery FE

React Native app cho đồ án môn Mobile — giao diện cho hệ thống đặt và giao đồ ăn trực tuyến.

---

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript
- **Routing:** Expo Router v3 (file-based)
- **Server state:** TanStack Query v5
- **Client state:** Zustand
- **HTTP:** Axios
- **Form:** React Hook Form + Zod
- **Maps:** react-native-maps

---

## Cấu trúc thư mục

```
app/
├── (auth)/          → login, register
├── (customer)/      → home, restaurant, cart, checkout, tracking, orders
├── (merchant)/      → dashboard, orders, menu, revenue
├── (shipper)/       → home, order-detail, history
components/
├── ui/              → Button, Input, Card, Badge (tái sử dụng)
├── features/        → RestaurantCard, OrderItem, CartItem (gắn domain)
services/
└── api.ts           → axios instance + interceptor
store/               → zustand stores (auth, cart)
hooks/               → custom hooks
types/               → TypeScript interfaces
mock/                → mock data khi BE chưa sẵn sàng
constants/
└── config.ts        → API_BASE_URL
```

---

## Git Flow

```
main        → stable, chỉ merge khi xong feature hoàn chỉnh
develop     → nhánh làm việc chính, merge feature vào đây
└── feature/ten-man-hinh  → mỗi người tạo từ develop
```

### Quy trình

```bash
# 1. Luôn bắt đầu từ develop mới nhất
git checkout develop
git pull origin develop

# 2. Tạo nhánh feature mới
git checkout -b feature/ten-man-hinh

# 3. Code xong thì push
git add .
git commit -m "feat: ten man hinh"
git push origin feature/ten-man-hinh

# 4. Lên GitHub tạo Pull Request: feature/... → develop
# 5. Người kia review rồi merge
```

---

## Đặt tên commit

| Prefix | Dùng khi | Ví dụ |
|--------|----------|-------|
| `feat:` | thêm tính năng mới | `feat: home screen restaurant list` |
| `fix:` | sửa bug | `fix: cart total calculation wrong` |
| `chore:` | việc lặt vặt, cấu hình | `chore: update dependencies` |
| `style:` | chỉnh UI, không đổi logic | `style: adjust restaurant card spacing` |
| `refactor:` | refactor code | `refactor: extract useRestaurantList hook` |

---

## Phân công màn hình

| 1 | 2 |
|-----------|----------------|
| Auth (login, register) | Home (danh sách nhà hàng) |
| Checkout | Restaurant detail + menu |
| Order tracking | Cart |
| Merchant screens | Shipper screens |

---

## Coding Rules

- Tên biến/function rõ nghĩa, không viết tắt lạ
- Không inline style quá 2 dòng → dùng `StyleSheet.create` cuối file
- Mỗi component 1 file, không quá 150 dòng — dài thì tách component con
- Custom hook để tách logic khỏi UI (`useRestaurantList` thay vì fetch thẳng trong component)
- TanStack Query cho mọi server state (GET → `useQuery`, POST/PUT/DELETE → `useMutation`)
- Zustand chỉ dùng cho client state (auth, cart) — không dùng cho data từ API
- Zod validate form, không validate thủ công bằng if/else
- Không dùng `any` — phải có type rõ ràng
- Loading state và error state phải handle đủ, không bỏ trống
- Mock data đặt trong `mock/[tên].ts` khi BE chưa xong

---

## Kết nối BE

FE chỉ giao tiếp với API Gateway qua 1 URL duy nhất.

```
React Native App → API Gateway (nginx :80)
                       ├── /api/auth      → Auth Service
                       ├── /api/orders    → Order Service
                       ├── /api/merchants → Merchant Service
                       └── /api/tracking  → Tracking Service
```

### Thống nhất với BE

| Thứ | Quy ước |
|-----|---------|
| Base URL | Cập nhật vào `constants/config.ts` khi BE deploy xong |
| Auth | Bearer token trong header `Authorization` |
| Response success | `{ success: true, data: T, message: string }` |
| Response error | `{ success: false, message: string, errors?: Record }` |
| Paginated | `{ success: true, data: { items: T[], total, page, perPage } }` |

---

## Chạy local

```bash
npm install
npx expo start
```

- Nhấn `a` để mở Android emulator
- Nhấn `i` để mở iOS simulator (cần Mac)
- Quét QR bằng app Expo Go trên điện thoại thật
