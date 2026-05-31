# K-MATE Frontend — Báo Cáo Thay Đổi

> **Ngày cập nhật:** 30/05/2026
> **Frontend version:** Build 27 pages thành công

---

## 1. Tổng quan

Toàn bộ frontend K-MATE đã được kiểm tra, bổ sung và build thành công với 27 trang. Các pages mới đã được kết nối API thực, design system đồng bộ với hệ thống hiện tại.

---

## 2. Danh sách files mới tạo

### 2.1. Tài liệu

| File | Mô tả |
|------|--------|
| `src/docs/NGHIEP_VU_DEV.md` | Tài liệu nghiệp vụ đầy đủ cho USER và ADMIN |

### 2.2. API Services

| File | Mô tả |
|------|--------|
| `src/lib/api-services.ts` | Typed API service layer cho toàn bộ endpoints |

### 2.3. User Pages (Route)

| File | Route | Mô tả |
|------|-------|--------|
| `app/user/wallet/page.tsx` | `/user/wallet` | Ví xu + lịch sử giao dịch |
| `app/user/profile/page.tsx` | `/user/profile` | Trang cá nhân |
| `app/user/settings/page.tsx` | `/user/settings` | Cài đặt tài khoản |
| `app/user/notifications/page.tsx` | `/user/notifications` | Trung tâm thông báo |

### 2.4. User Components

| File | Mô tả |
|------|--------|
| `components/user/UserWalletPage.tsx` | Hiển thị số dư, nhận thưởng đăng nhập, lịch sử giao dịch, mua coin |
| `components/user/UserProfilePage.tsx` | Edit profile, xem stats, achievements |
| `components/user/UserSettingsPage.tsx` | Đổi mật khẩu, quản lý sessions, tùy chọn thông báo |
| `components/user/UserNotificationsPage.tsx` | Danh sách notifications, mark as read, delete |

### 2.5. Admin Layout & Pages

| File | Route | Mô tả |
|------|-------|--------|
| `app/admin/layout.tsx` | — | Admin layout wrapper (Suspense) |
| `app/admin/login/page.tsx` | `/admin/login` | Trang đăng nhập admin |
| `app/admin/dashboard/page.tsx` | `/admin/dashboard` | Tổng quan |
| `app/admin/users/page.tsx` | `/admin/users` | Danh sách users |
| `app/admin/users/[id]/page.tsx` | `/admin/users/:id` | Chi tiết user |
| `app/admin/payments/page.tsx` | `/admin/payments` | Quản lý payments |
| `app/admin/ai-queue/page.tsx` | `/admin/ai-queue` | AI queue |
| `app/admin/achievements/page.tsx` | `/admin/achievements` | CRUD achievements |
| `app/admin/packages/page.tsx` | `/admin/packages` | CRUD coin packages |
| `app/admin/logs/page.tsx` | `/admin/logs` | Audit log |

### 2.6. Admin Components

| File | Mô tả |
|------|--------|
| `components/admin/AdminLayout.tsx` | Sidebar + header + auth guard cho admin |
| `components/admin/AdminDashboardPage.tsx` | Stats grid + quick actions |
| `components/admin/AdminUsersPage.tsx` | Bảng users, search, ban/unban |
| `components/admin/AdminPaymentsPage.tsx` | Bảng payments, filter by status |
| `components/admin/AdminAIQueuePage.tsx` | AI jobs, retry/cancel actions |
| `components/admin/AdminAchievementsPage.tsx` | CRUD achievements với modal form |
| `components/admin/AdminPackagesPage.tsx` | CRUD coin packages với modal form |
| `components/admin/AdminLogsPage.tsx` | Audit log table, filter by action |

---

## 3. Các files đã sửa

| File | Thay đổi |
|------|-----------|
| `components/user/UserSidebar.tsx` | Thay "Cộng đồng" bằng "Trang cá nhân" + "Thông báo"; loại bỏ icon không dùng |
| `components/user/UserHeader.tsx` | Thêm badge thông báo thực từ API, cập nhật user menu điều hướng |
| `components/auth/LoginPage.tsx` | Chuyển sang `authService` (typed), redirect `/user/dashboard`, fix error handling |
| `components/auth/RegisterPage.tsx` | Chuyển sang `authService` (typed) |
| `components/auth/ForgotPasswordPage.tsx` | Chuyển sang `authService` (typed) |
| `components/user/UserQuizPage.tsx` | Fix JSX syntax error (`</button>>` → `</button>`) |

---

## 4. Route Map đầy đủ

### 4.1. Public Routes

| Route | File | Trạng thái |
|-------|------|-----------|
| `/` | `app/page.tsx` | Landing page |
| `/login` | `app/login/page.tsx` | Login |
| `/register` | `app/register/page.tsx` | Register |
| `/forgot-password` | `app/forgot-password/page.tsx` | Forgot password |

### 4.2. User Routes (cần đăng nhập)

| Route | File | Trạng thái |
|-------|------|-----------|
| `/user/dashboard` | `app/user/dashboard/page.tsx` | Dashboard (đã có) |
| `/user/explore` | `app/user/explore/page.tsx` | Explore (đã có) |
| `/user/flashcards` | `app/user/flashcards/page.tsx` | Flashcards (đã có) |
| `/user/quiz` | `app/user/quiz/page.tsx` | Quiz (đã có) |
| `/user/progress` | `app/user/progress/page.tsx` | Progress (đã có) |
| `/user/wallet` | `app/user/wallet/page.tsx` | **MỚI** — Ví xu |
| `/user/profile` | `app/user/profile/page.tsx` | **MỚI** — Profile |
| `/user/settings` | `app/user/settings/page.tsx` | **MỚI** — Settings |
| `/user/notifications` | `app/user/notifications/page.tsx` | **MỚI** — Notifications |

### 4.3. Learning Routes

| Route | File | Trạng thái |
|-------|------|-----------|
| `/learn/:videoId` | `app/learn/[videoId]/page.tsx` | Video learning (đã có) |
| `/waiting` | `app/waiting/page.tsx` | Waiting room (đã có) |

### 4.4. Admin Routes (cần role ADMIN)

| Route | File | Trạng thái |
|-------|------|-----------|
| `/admin/login` | `app/admin/login/page.tsx` | **MỚI** — Admin login |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | **MỚI** — Overview |
| `/admin/users` | `app/admin/users/page.tsx` | **MỚI** — User list |
| `/admin/users/:id` | `app/admin/users/[id]/page.tsx` | **MỚI** — User detail |
| `/admin/payments` | `app/admin/payments/page.tsx` | **MỚI** — Payments |
| `/admin/ai-queue` | `app/admin/ai-queue/page.tsx` | **MỚI** — AI Queue |
| `/admin/achievements` | `app/admin/achievements/page.tsx` | **MỚI** — Achievements CRUD |
| `/admin/packages` | `app/admin/packages/page.tsx` | **MỚI** — Packages CRUD |
| `/admin/logs` | `app/admin/logs/page.tsx` | **MỚI** — Audit logs |

---

## 5. Chức năng từng màn hình

### 5.1. User — Ví xu (`/user/wallet`)

- Hiển thị số dư coin (balance, lifetime earnings, lifetime spent)
- Nút "Nhận thưởng đăng nhập" (+5 coin/ngày) → `POST /coins/daily-login`
- Bảng lịch sử giao dịch phân trang, filter theo loại
- Nút "Mua thêm Xu" → Modal chọn gói coin
- API: `GET /coins/balance`, `GET /coins/history`, `POST /coins/daily-login`, `GET /coins/packages`

### 5.2. User — Trang cá nhân (`/user/profile`)

- Avatar + tên + email
- Edit tên inline
- Stats grid: videos watched, flashcards, quizzes, achievements
- Achievements grid: unlocked vs locked, progress bar
- API: `GET /users/profile`, `PUT /users/profile`, `GET /users/statistics`, `GET /users/achievements`

### 5.3. User — Cài đặt (`/user/settings`)

- Tab Bảo mật: đổi mật khẩu, quản lý sessions (revoke per session, revoke all)
- Tab Thông báo: toggle preferences (local state)
- API: `GET /auth/sessions`, `DELETE /auth/sessions/:id`, `PUT /auth/password`

### 5.4. User — Thông báo (`/user/notifications`)

- Danh sách notifications với icon theo type
- Badge unread trên header (đếm từ API)
- Mark 1 đã đọc / Mark all đã đọc
- Xóa notification
- Infinite scroll / phân trang
- API: `GET /notifications`, `PUT /notifications/:id/read`, `PUT /notifications/read-all`, `DELETE /notifications/:id`

### 5.5. Admin — Đăng nhập (`/admin/login`)

- Form email + password
- Kiểm tra `role === 'ADMIN'` sau login
- Redirect: admin → `/admin/dashboard`, non-admin → `/user/dashboard`
- Gradient đỏ-tím để phân biệt với login thường

### 5.6. Admin — Dashboard (`/admin/dashboard`)

- Stats cards: total users, active users, total videos, revenue, pending AI jobs
- Quick action links đến các trang admin
- API: `GET /admin/dashboard`

### 5.7. Admin — Users (`/admin/users`)

- Bảng paginated + searchable
- Columns: avatar, name, email, role, coins, streak, status, actions
- Actions: Chi tiết (→ user detail), Ban/Unban
- API: `GET /admin/users`, `POST /admin/users/:id/ban`, `POST /admin/users/:id/unban`

### 5.8. Admin — User Detail (`/admin/users/:id`)

- Profile card: avatar, name, email, coins, streak, stats
- Ban/Unban button
- Tabs: Thông tin chi tiết (Descriptions), Thống kê (_count fields)
- API: `GET /admin/users/:id`

### 5.9. Admin — Payments (`/admin/payments`)

- Bảng paginated, filter theo status
- Columns: user, amount, coin, order code, status, timestamps
- API: `GET /admin/payments`

### 5.10. Admin — AI Queue (`/admin/ai-queue`)

- Bảng jobs với progress bar
- Filter theo status
- Actions: Retry (FAILED jobs), Cancel (QUEUED/PROCESSING jobs)
- Columns: user, video, type, stage icon, status, progress, retries
- API: `GET /admin/ai-queue`, `POST /admin/ai-queue/:id/retry`, `POST /admin/ai-queue/:id/cancel`

### 5.11. Admin — Achievements (`/admin/achievements`)

- Bảng achievements list
- Tạo mới / Sửa qua Modal form
- Toggle active/inactive trực tiếp trên bảng
- Fields: type, name, icon, description, coinReward, xpReward, requirement, isActive
- API: `GET /admin/achievements`, `POST /admin/achievements`, `PUT /admin/achievements/:id`

### 5.12. Admin — Packages (`/admin/packages`)

- Bảng packages list
- Tạo mới / Sửa qua Modal form
- Fields: name, description, coinAmount, bonusCoinAmount, price, sortOrder, isActive
- API: `GET /admin/packages`, `POST /admin/packages`, `PUT /admin/packages/:id`

### 5.13. Admin — Logs (`/admin/logs`)

- Bảng audit log paginated
- Filter theo action type
- Columns: admin, action, targetType, targetId, timestamp
- API: `GET /admin/logs`

---

## 6. Quyền truy cập

| Route | Unauthenticated | USER | ADMIN |
|-------|---------------|------|-------|
| `/`, `/login`, `/register`, `/forgot-password` | OK | → dashboard | → dashboard |
| `/user/*` | → /login | OK | OK |
| `/learn/:videoId` | → /login | OK | OK |
| `/admin/login` | OK | → /user/dashboard | → /admin/dashboard |
| `/admin/*` (except login) | → /admin/login | → /user/dashboard | OK |

Auth guard trong `AdminLayout.tsx` kiểm tra `isAuthenticated` và `role === 'ADMIN'`.

---

## 7. Design System

Tất cả pages mới tuân thủ design system có sẵn:

- **Background:** `#0B0B0F` + `bg-gradient-cyber` gradient overlay
- **Cards:** `.user-glass-card` với `backdrop-filter: blur(12px)` và border `rgba(255,255,255,0.1)`
- **Primary:** `#7C4DFF` (violet)
- **Secondary:** `#00E5FF` (cyan)
- **Ant Design dark theme** được giữ nguyên
- **Border radius:** rounded-xl / rounded-2xl

---

## 8. API Integration Layer

File `src/lib/api-services.ts` cung cấp typed functions cho mọi API calls:

```typescript
import { authService, coinService, userService, notificationService, adminService } from '@/lib/api-services';

// Ví dụ:
const res = await authService.login({ email, password });
const res = await coinService.getBalance();
const res = await adminService.getUsers({ page: 1, limit: 20 });
```

---

## 9. Build Status

```
✓ Build thành công — 27 pages
✓ Không có TypeScript errors
✓ Không có lỗi webpack
✓ Tất cả routes được prerender (Static) hoặc Dynamic

Pages mới:
  /admin/achievements    3.45 kB
  /admin/ai-queue       11.9 kB
  /admin/dashboard       4.83 kB
  /admin/login           4.19 kB
  /admin/logs            7.09 kB
  /admin/packages       14.1 kB
  /admin/payments        7.93 kB
  /admin/users           9.9 kB
  /admin/users/[id]     10.1 kB
  /user/notifications   12.2 kB
  /user/profile          9.04 kB
  /user/settings        14.8 kB
  /user/wallet           11 kB
```

---

## 10. Lưu ý khi chạy

1. **Backend phải đang chạy** tại `http://localhost:4000` (hoặc set `NEXT_PUBLIC_API_URL` trong `.env.local`)
2. **PayOS**: Flow mua coin trong `/user/wallet` hiện chỉ là mock — cần implement PayOS checkout URL thực
3. **Admin**: Cần tạo user với `role = 'ADMIN'` trong database để đăng nhập admin
4. **`OPENAI_API_KEY`**: Worker containers cần env var này để AI pipeline hoạt động

---

## 11. Cấu trúc thư mục cuối cùng

```
src/
├── app/
│   ├── admin/              # Admin site (MỚI)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx + [id]/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── ai-queue/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── packages/page.tsx
│   │   └── logs/page.tsx
│   └── user/              # User site
│       ├── wallet/page.tsx         # MỚI
│       ├── profile/page.tsx         # MỚI
│       ├── settings/page.tsx        # MỚI
│       └── notifications/page.tsx   # MỚI
├── components/
│   ├── admin/              # 8 admin components (MỚI)
│   └── user/               # 4 user components (MỚI)
└── lib/
    └── api-services.ts     # Typed API layer (MỚI)
```
