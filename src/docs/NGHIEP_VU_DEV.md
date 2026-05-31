# K-MATE — Nghiệp Vụ & Phát Triển Frontend

> **Ngày cập nhật:** 30/05/2026
> **Phiên bản:** 1.0.0
> **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Ant Design 5
> **Backend API:** http://localhost:4000/api

---

## Mục lục

1. [Tổng quan vai trò](#1-tổng-quan-vai-trò)
2. [Nghiệp vụ USER](#2-nghiệp-vụ-user)
3. [Nghiệp vụ ADMIN](#3-nghiệp-vụ-admin)
4. [Các màn hình cần xây dựng](#4-các-màn-hình-cần-xây-dựng)
5. [Route map](#5-route-map)
6. [API integration](#6-api-integration)
7. [Quyền truy cập (Role-based Access)](#7-quyền-truy-cập-role-based-access)
8. [Design system](#8-design-system)

---

## 1. Tổng quan vai trò

### 1.1. USER — Người dùng thông thường

Màn hình hiện có:
- `/` — Landing page
- `/login` — Đăng nhập
- `/register` — Đăng ký
- `/forgot-password` — Quên mật khẩu
- `/user/dashboard` — Dashboard
- `/user/explore` — Khám phá video
- `/user/flashcards` — Flashcard
- `/user/quiz` — Quiz
- `/user/progress` — Tiến độ
- `/learn/:videoId` — Trang học video
- `/waiting` — Chờ xử lý subtitle

Màn hình cần xây thêm:
- `/user/wallet` — Ví xu + lịch sử giao dịch
- `/user/profile` — Trang cá nhân (profile + preferences)
- `/user/settings` — Cài đặt tài khoản
- `/user/notifications` — Trung tâm thông báo

### 1.2. ADMIN — Quản trị viên

Màn hình cần xây hoàn toàn mới tại `/admin/*`:
- `/admin/login` — Đăng nhập admin
- `/admin/dashboard` — Tổng quan hệ thống
- `/admin/users` — Quản lý người dùng
- `/admin/users/:id` — Chi tiết người dùng
- `/admin/payments` — Quản lý thanh toán
- `/admin/achievements` — Quản lý thành tựu
- `/admin/packages` — Quản lý gói coin
- `/admin/ai-queue` — Queue AI
- `/admin/logs` — Audit log

---

## 2. Nghiệp vụ USER

### 2.1. Auth

| Luồng | Mô tả |
|-------|--------|
| Đăng ký | Email + password + name → tạo user → tự động login |
| Đăng nhập | Email + password → JWT tokens → lưu localStorage |
| Google OAuth | ID token → backend verify → JWT tokens |
| Refresh token | Tự động refresh khi 401, revoke khi hết hạn |
| Đăng xuất | Xóa localStorage → redirect `/login` |
| Đổi mật khẩu | Authenticated, revoke tất cả sessions |
| Quên mật khẩu | Gửi email reset (nếu EMAIL_* configured) |
| Xác minh email | Token từ email → verify endpoint |

### 2.2. Ví xu (Wallet)

**Màn hình:** `/user/wallet`

**Tính năng:**
- Hiển thị số dư coin hiện tại (from `GET /coins/balance`)
- Nút "Nhận thưởng đăng nhập" → `POST /coins/daily-login` (+5 coin/ngày)
- Lịch sử giao dịch (from `GET /coins/history`, paginated)
- Filter theo type: PURCHASE, DAILY_LOGIN, ACHIEVEMENT, etc.
- Nút "Mua thêm coin" → `/user/wallet/buy`
- Danh sách gói coin (from `GET /coins/packages`)
- Danh sách chương trình thưởng (from `GET /coins/rewards`)

**API calls:**
```typescript
GET  /coins/balance        // Số dư
POST /coins/daily-login    // Nhận thưởng
GET  /coins/history        // Lịch sử (page, limit, type)
GET  /coins/packages       // Danh sách gói
GET  /coins/rewards       // Chương trình thưởng
```

### 2.3. Profile

**Màn hình:** `/user/profile`

**Tính năng:**
- Xem thông tin cá nhân (from `GET /users/profile`)
- Edit profile: name, avatar
- Edit preferences (from `PUT /users/preferences`)
- Xem thống kê học tập (from `GET /users/statistics`)
- Xem achievements (from `GET /users/achievements`)
- Linked OAuth providers (from `GET /auth/providers`)

**API calls:**
```typescript
GET  /users/profile        // Thông tin profile
PUT  /users/profile        // Cập nhật profile
PUT  /users/preferences    // Cập nhật preferences
GET  /users/statistics     // Thống kê học tập
GET  /users/achievements  // Achievements
GET  /auth/providers       // OAuth providers
```

### 2.4. Settings

**Màn hình:** `/user/settings`

**Tính năng:**
- Đổi mật khẩu (`PUT /auth/password`)
- Quản lý sessions (`GET /auth/sessions`, `DELETE /auth/sessions/:id`)
- Thông báo (notification preferences — từ `PUT /users/preferences`)
- Xóa tài khoản (soft delete — nếu backend hỗ trợ)

### 2.5. Notifications

**Màn hình:** `/user/notifications`

**Tính năng:**
- Danh sách notifications (from `GET /notifications`)
- Unread badge trên header
- Đánh dấu đã đọc 1 notification (`PUT /notifications/:id/read`)
- Đánh dấu đã đọc tất cả (`PUT /notifications/read-all`)
- Xóa notification (`DELETE /notifications/:id`)

**API calls:**
```typescript
GET    /notifications              // Danh sách (paginated)
PUT    /notifications/:id/read      // Mark 1 đã đọc
PUT    /notifications/read-all     // Mark all đã đọc
DELETE /notifications/:id          // Xóa 1 notification
```

### 2.6. Flashcards

**Màn hình:** `/user/flashcards`

**Tính năng:**
- Danh sách decks (from `GET /flashcards/decks`)
- Tạo deck mới (`POST /flashcards/decks`)
- Danh sách cards trong deck (from `GET /flashcards?deckId=...`)
- Review mode (SM-2) → `POST /flashcards/review`
- Cards due for review (from `GET /flashcards/due`)
- Stats (from `GET /flashcards/stats`)

### 2.7. Quiz

**Màn hình:** `/user/quiz`

**Tính năng:**
- Danh sách quiz đã làm
- Làm quiz mới (from `GET /quiz/:videoId`)
- Submit quiz → `POST /quiz/submit`
- Lịch sử quiz (from `GET /quiz/history`)

### 2.8. Video Learning

**Màn hình:** `/learn/:videoId`

**Luồng:**
1. User unlock video → `POST /videos/:id/unlock` (trừ 1 coin)
2. Nếu subtitle chưa có → redirect `/waiting?jobId=...`
3. Khi subtitle ready → redirect `/learn/:videoId`
4. User xem video, click từ → lưu flashcard (`POST /flashcards`)
5. Player gửi progress định kỳ → `PUT /videos/:id/progress`

### 2.9. Waiting

**Màn hình:** `/waiting`

**Tính năng:**
- Hiển thị progress job (from `GET /waiting/jobs/:jobId/progress`)
- Socket.IO real-time updates
- Short video feed để giải trí trong lúc chờ
- Auto-redirect khi hoàn thành

---

## 3. Nghiệp vụ ADMIN

### 3.1. Admin Login

**Route:** `/admin/login`

- Dùng chung form login, backend phân biệt bằng `role === 'ADMIN'`
- Nếu user thường đăng nhập → redirect về `/user/dashboard`
- Nếu admin → redirect về `/admin/dashboard`

### 3.2. Admin Dashboard

**Route:** `/admin/dashboard`

**API:** `GET /admin/dashboard`

**Data hiển thị:**
- Tổng số users, users active (24h)
- Tổng videos
- Tổng payments, total revenue
- Pending AI jobs
- Biểu đồ analytics

### 3.3. User Management

**Route:** `/admin/users` + `/admin/users/:id`

**API:**
```typescript
GET /admin/users              // Paginated, searchable
GET /admin/users/:id          // Chi tiết user
POST /admin/users/:id/ban    // Ban user
POST /admin/users/:id/unban  // Unban user
```

**Tính năng:**
- Bảng danh sách: email, name, role, isBanned, coinBalance, streak
- Search theo email/name
- Filter: all, banned, active
- Action: Ban/Unban (confirm dialog)
- Click row → User detail

### 3.4. Payments

**Route:** `/admin/payments`

**API:** `GET /admin/payments`

**Tính năng:**
- Bảng payments: user, amount, coinAmount, status, createdAt
- Filter: PENDING, SUCCESS, FAILED, EXPIRED
- Pagination

### 3.5. AI Queue

**Route:** `/admin/ai-queue`

**API:** `GET /admin/ai-queue`

**Tính năng:**
- Bảng jobs: user, video, type, status, progress, stage, retryCount
- Filter: QUEUED, PROCESSING, FAILED, COMPLETED
- Action: Retry (`POST /admin/ai-queue/:id/retry`)
- Action: Cancel (`POST /admin/ai-queue/:id/cancel`)

### 3.6. Achievements

**Route:** `/admin/achievements`

**API:**
```typescript
GET  /admin/achievements     // Danh sách
POST /admin/achievements     // Tạo mới
PUT  /admin/achievements/:id // Cập nhật
```

### 3.7. Coin Packages

**Route:** `/admin/packages`

**API:**
```typescript
GET  /admin/packages         // Danh sách
POST /admin/packages         // Tạo mới
PUT  /admin/packages/:id     // Cập nhật
```

### 3.8. Admin Logs

**Route:** `/admin/logs`

**API:** `GET /admin/logs`

**Tính năng:**
- Bảng audit log: admin, action, targetType, targetId, createdAt
- Filter theo action: USER_BAN, USER_UNBAN, ACHIEVEMENT_CREATE, etc.

---

## 4. Các màn hình cần xây dựng

### 4.1. Priority Cao

| Màn hình | Route | File | Ghi chú |
|----------|-------|------|---------|
| Wallet | `/user/wallet` | `user/UserWalletPage.tsx` | Ví xu + giao dịch |
| Profile | `/user/profile` | `user/UserProfilePage.tsx` | Profile + preferences |
| Settings | `/user/settings` | `user/UserSettingsPage.tsx` | Settings + sessions |
| Notifications | `/user/notifications` | `user/UserNotificationsPage.tsx` | Thông báo |

### 4.2. Priority Trung bình

| Màn hình | Route | File | Ghi chú |
|----------|-------|------|---------|
| Buy Coins | `/user/wallet/buy` | `user/UserBuyCoinsPage.tsx` | Flow mua coin |
| Admin Login | `/admin/login` | `admin/AdminLoginPage.tsx` | Đăng nhập admin |
| Admin Dashboard | `/admin/dashboard` | `admin/AdminDashboardPage.tsx` | Tổng quan |
| Admin Users | `/admin/users` | `admin/AdminUsersPage.tsx` | Bảng users |
| Admin User Detail | `/admin/users/:id` | `admin/AdminUserDetailPage.tsx` | Chi tiết user |

### 4.3. Priority Thấp

| Màn hình | Route | File | Ghi chú |
|----------|-------|------|---------|
| Admin Payments | `/admin/payments` | `admin/AdminPaymentsPage.tsx` | Bảng payments |
| Admin AI Queue | `/admin/ai-queue` | `admin/AdminAIQueuePage.tsx` | AI jobs |
| Admin Achievements | `/admin/achievements` | `admin/AdminAchievementsPage.tsx` | CRUD achievements |
| Admin Packages | `/admin/packages` | `admin/AdminPackagesPage.tsx` | CRUD packages |
| Admin Logs | `/admin/logs` | `admin/AdminLogsPage.tsx` | Audit log |

---

## 5. Route Map

```
/                           → Landing page
/login                      → Login
/register                   → Register
/forgot-password            → Forgot password

/user/*                    → User layout (có sidebar)
/user/dashboard            → Dashboard (có)
/user/explore              → Explore (có)
/user/flashcards           → Flashcards (có)
/user/quiz                → Quiz (có)
/user/progress             → Progress (có)
/user/wallet               → Wallet (MỚI)
/user/wallet/buy           → Buy coins (MỚI)
/user/profile              → Profile (MỚI)
/user/settings             → Settings (MỚI)
/user/notifications        → Notifications (MỚI)

/learn/:videoId            → Video learning (có)
/waiting                   → Waiting room (có)

/admin/*                   → Admin layout (MỚI - sidebar riêng)
/admin/login               → Admin login (MỚI)
/admin/dashboard           → Admin overview (MỚI)
/admin/users               → User management (MỚI)
/admin/users/:id           → User detail (MỚI)
/admin/payments            → Payments (MỚI)
/admin/ai-queue           → AI queue (MỚI)
/admin/achievements        → Achievements (MỚI)
/admin/packages           → Packages (MỚI)
/admin/logs               → Audit logs (MỚI)
```

---

## 6. API Integration

### 6.1. Axios Setup

API client đã có tại `src/lib/api.ts`. Sử dụng:

```typescript
import { api } from '@/lib/api';

api.get('/auth/login', data);
api.post('/auth/register', data);
api.put('/profile', data);
api.delete('/sessions/:id');
```

### 6.2. Auth Interceptor

Interceptor trong `api.ts` tự động gắn `Authorization: Bearer <token>` từ localStorage và xử lý refresh token khi 401.

### 6.3. Token Storage

```typescript
// Sau login thành công:
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Sau logout:
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

### 6.4. Role Check

```typescript
// Kiểm tra role từ auth store:
const { user } = useAuthStore();
const isAdmin = user?.role === 'ADMIN';
const isAuthenticated = useAuthStore(state => state.isAuthenticated);
```

### 6.5. Route Protection

Dùng Next.js middleware hoặc wrapper component:

```typescript
// Admin route guard
if (!isAuthenticated || user?.role !== 'ADMIN') {
  redirect('/login');
}
```

---

## 7. Quyền truy cập (Role-based Access)

| Route | USER | ADMIN | Unauthenticated |
|-------|------|-------|---------------|
| `/login`, `/register` | → dashboard | → admin/dashboard | OK |
| `/user/*` | OK | OK | → /login |
| `/admin/*` | → /user/dashboard | OK | → /admin/login |
| `/learn/:videoId` | OK (nếu unlock) | OK | → /login |

---

## 8. Design System

### 8.1. Color Palette

```css
/* Primary */
--color-primary: #7C4DFF;         /* Violet */
--color-primary-light: #9D7AFF;
--color-primary-dark: #5C35CC;

/* Secondary */
--color-secondary: #00E5FF;       /* Cyan */
--color-secondary-light: #4DFFFF;
--color-secondary-dark: #00B8CC;

/* Background */
--color-bg-dark: #0B0B0F;
--color-bg-container: #151C2A;
--color-bg-elevated: #1E2A3A;

/* Text */
--color-text-base: #FFFFFF;
--color-text-secondary: #94A3B8;
--color-text-muted: #64748B;

/* Semantic */
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;
```

### 8.2. Glass Card

```css
.user-glass-card {
  background: rgba(21, 28, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### 8.3. Typography

- Font family: Inter, system-ui, sans-serif
- Display headings: text-4xl font-black
- Section headings: text-xl font-bold
- Body: text-sm text-slate-300
- Labels: text-xs font-bold uppercase tracking-widest

### 8.4. Ant Design Theme Override

```typescript
const theme = {
  token: {
    colorPrimary: '#7C4DFF',
    colorBgBase: '#0B0B0F',
    colorTextBase: '#ffffff',
    colorBgContainer: '#151c2a',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};
```

### 8.5. Common Components

```typescript
// Glass card wrapper
<div className="user-glass-card p-6 rounded-2xl">

// Gradient heading
<span className="text-primary text-glow-primary">Title</span>

// Neon border card
<div className="border border-primary/30 rounded-xl bg-primary/5">

// Coin display
<div className="bg-secondary/20 px-3 py-1.5 rounded-full">
  <DollarOutlined /> <span>{balance} Xu</span>
</div>
```

---

## 9. File Structure

```
src/
├── app/
│   ├── user/
│   │   ├── layout.tsx           # User layout (sidebar + header)
│   │   ├── wallet/
│   │   │   ├── page.tsx         # Wallet page
│   │   │   └── buy/page.tsx     # Buy coins page
│   │   ├── profile/page.tsx     # Profile page
│   │   ├── settings/page.tsx    # Settings page
│   │   └── notifications/page.tsx # Notifications page
│   ├── admin/
│   │   ├── login/page.tsx       # Admin login
│   │   ├── layout.tsx           # Admin layout
│   │   ├── dashboard/page.tsx   # Admin dashboard
│   │   ├── users/
│   │   │   ├── page.tsx        # User list
│   │   │   └── [id]/page.tsx   # User detail
│   │   ├── payments/page.tsx    # Payments
│   │   ├── ai-queue/page.tsx   # AI queue
│   │   ├── achievements/page.tsx
│   │   ├── packages/page.tsx
│   │   └── logs/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── layout.tsx
├── components/
│   ├── user/
│   │   ├── UserWalletPage.tsx   # NEW
│   │   ├── UserProfilePage.tsx  # NEW
│   │   ├── UserSettingsPage.tsx # NEW
│   │   ├── UserNotificationsPage.tsx # NEW
│   │   ├── UserBuyCoinsPage.tsx # NEW
│   │   └── UserSidebar.tsx      # UPDATE - add wallet link
│   ├── admin/
│   │   ├── AdminLayout.tsx      # NEW
│   │   ├── AdminDashboardPage.tsx   # NEW
│   │   ├── AdminUsersPage.tsx  # NEW
│   │   ├── AdminUserDetailPage.tsx  # NEW
│   │   ├── AdminPaymentsPage.tsx    # NEW
│   │   ├── AdminAIQueuePage.tsx     # NEW
│   │   ├── AdminAchievementsPage.tsx # NEW
│   │   ├── AdminPackagesPage.tsx    # NEW
│   │   ├── AdminLogsPage.tsx        # NEW
│   │   └── AdminLoginPage.tsx        # NEW
│   └── layout/
│       └── app-sidebar.tsx
├── hooks/
│   └── use-auth-guard.ts       # NEW - auth guard hook
├── lib/
│   ├── api.ts                   # UPDATE - add admin routes
│   └── api-services/            # NEW - typed API service functions
│       ├── auth.service.ts
│       ├── coin.service.ts
│       ├── user.service.ts
│       ├── notification.service.ts
│       └── admin.service.ts
└── store/
    ├── auth.store.ts            # UPDATE - add admin check helpers
    └── notification.store.ts    # NEW - notification badge count
```
