---
phase: requirements
title: UI Layout Standardization
description: Standardize layout structure across admin pages
---

# 🎨 Feature: UI Layout Standardization (Admin Pages)

## 🧩 Problem Statement

<!-- 
Hiện tại các trang:
- Dịch vụ
- Sản phẩm
- Tin tức
- Dự án
- Liên hệ
- Video

Chưa đồng bộ về:
- Layout tổng thể
- Header structure
- Spacing
- Component structure
- Kiểu hiển thị nội dung (list full width vs grid)

Hệ quả:
- UI thiếu nhất quán
- Khó maintain
- Khó scale
- AI dev tool generate code thiếu consistency
-->

Các trang admin hiện chưa có layout và cấu trúc component đồng bộ, gây khó khăn trong bảo trì và mở rộng.

---

## 🎯 Goals & Objectives

### 🎯 Primary Goals

<!--
1. Tạo layout wrapper dùng chung cho tất cả page
2. Chuẩn hóa header (title + search + action)
3. Dùng grid thay vì list full width
4. Thiết kế reusable component
-->

1. Tạo một `PageLayout` dùng chung cho toàn bộ trang.
2. Chuẩn hóa cấu trúc header gồm:
   - Title
   - Search / Filter
   - Action buttons (Add, Export, etc.)
3. Sử dụng Grid layout thay vì list full width.
4. Tách component để tái sử dụng.

---

## 🧱 Proposed Layout Structure

<!--
PageLayout
 ├── PageHeader
 │    ├── Title
 │    ├── SearchBar
 │    └── ActionButtons
 ├── PageContent
 │    ├── Grid / Table
 └── Pagination (optional)
-->

Tất cả trang sẽ tuân theo cấu trúc:


---

## 🧩 Reusable Components

<!--
Shared components:
- PageLayout
- PageHeader
- SearchBar
- ActionButtons
- StatusBadge
- CardWrapper
-->

Các component dùng chung:

- `PageLayout`
- `PageHeader`
- `SearchBar`
- `ActionButtons`
- `StatusBadge`
- `CardWrapper`

---

## 📱 Responsiveness Requirements

<!--
- Desktop: 3 columns grid
- Tablet: 2 columns
- Mobile: 1 column
- Consistent spacing
-->

- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 1-column grid
- Spacing consistent (24px gap)
- Max-width container: 1280px

---

## ✅ Success Criteria

<!--
1. Tất cả trang dùng chung PageLayout
2. Header structure giống nhau
3. Responsive hoạt động đúng
4. Không còn list full width không đồng bộ
5. Code chia nhỏ component rõ ràng
-->

1. Tất cả trang sử dụng `PageLayout`.
2. Header đồng bộ cấu trúc.
3. Responsive hoạt động đúng.
4. Không còn layout full-width list không đồng bộ.
5. Code được chia thành component rõ ràng, không file dài >500 dòng.

---

## 🚫 Non-Goals

<!--
- Không redesign lại brand
- Không thay đổi logic backend
- Không thay đổi API
-->

- Không thay đổi business logic.
- Không thay đổi API backend.
- Không redesign toàn bộ theme.
