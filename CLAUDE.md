# CLAUDE.md — โน้ตอ้างอิงสำหรับโปรเจกต์ chacha

โน้ตนี้มีไว้ให้ AI (และนักพัฒนา) อ่านก่อนเริ่มงานในขั้นตอนถัดไปของโปรเจกต์นี้เสมอ

## เทคสแตก

- Next.js (App Router) — **เวอร์ชันล่าสุด (15.x)**, JavaScript ล้วน (ไม่ใช้ TypeScript)
- React 19
- Supabase (`@supabase/supabase-js`) — ใช้ผ่าน `lib/supabaseClient.js`
- Deploy บน Vercel

## ⚠️ กฎสำคัญ: Dynamic Route params เป็น Promise

Next.js เวอร์ชันที่ใช้ในโปรเจกต์นี้ (15.x) เปลี่ยนให้ `params` (และ `searchParams`)
ใน Dynamic Route เป็น **Promise** แล้ว ไม่ใช่ object ธรรมดาเหมือนเวอร์ชันเก่า

**ต้อง unwrap ด้วย `use()` จาก React เสมอ** เช่นตอนสร้างหน้าสั่งอาหารที่ table เช่น
`app/order/[tableNumber]/page.js`:

```jsx
'use client';
import { use } from 'react';

export default function OrderPage({ params }) {
  const { tableNumber } = use(params); // ✅ ถูกต้อง

  // ❌ ห้ามทำแบบนี้ (แบบเก่า ใช้ไม่ได้แล้ว)
  // const { tableNumber } = params;

  return <div>โต๊ะ {tableNumber}</div>;
}
```

สำหรับ Server Component (async function) สามารถ `await params` ได้โดยตรงแทน `use()`:

```jsx
export default async function OrderPage({ params }) {
  const { tableNumber } = await params;
  return <div>โต๊ะ {tableNumber}</div>;
}
```

กฎนี้ใช้กับทุกหน้าที่มี dynamic segment (`[param]`) ในโปรเจกต์นี้ — ห้ามลืมเด็ดขาด

## โครงสร้างฐานข้อมูล Supabase (มีอยู่แล้ว — ไม่ต้องสร้างใหม่)

ตารางเหล่านี้ถูกสร้างไว้แล้วใน Supabase project จริง โค้ดในโปรเจกต์นี้ต้องอ้างอิง
ชื่อตาราง/คอลัมน์ตามนี้เท่านั้น ห้ามเปลี่ยนชื่อหรือสมมติโครงสร้างใหม่เอง

### `sessions`
| คอลัมน์ | ความหมาย |
|---|---|
| `id` | primary key |
| `table_number` | หมายเลขโต๊ะ |
| `adult_count` | จำนวนผู้ใหญ่ |
| `child_count` | จำนวนเด็ก |
| `status` | สถานะของ session |
| `created_at` | เวลาที่สร้าง |

### `menu_categories`
| คอลัมน์ | ความหมาย |
|---|---|
| `id` | primary key |
| `name` | ชื่อหมวดหมู่เมนู |
| `sort_order` | ลำดับการแสดงผล |

### `menu_items`
| คอลัมน์ | ความหมาย |
|---|---|
| `id` | primary key |
| `category_id` | FK ไปยัง `menu_categories.id` |
| `name` | ชื่อเมนู |

### `orders`
| คอลัมน์ | ความหมาย |
|---|---|
| `id` | primary key |
| `session_id` | FK ไปยัง `sessions.id` |
| `table_number` | หมายเลขโต๊ะ (denormalized ไว้เพื่อ query ง่าย) |
| `items` | `jsonb` — รายการอาหารที่สั่ง |
| `status` | สถานะออเดอร์ |
| `created_at` | เวลาที่สร้าง |

## Environment variables

ตั้งค่าใน `.env.local` (ดู `.env.local.example`) และใน Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## หน้าที่มีอยู่แล้ว (placeholder)

- `/` — หน้าแรก แสดงชื่อร้านและลิงก์ทดสอบ
- `/generate-qr` — placeholder รอสร้างฟีเจอร์สร้าง QR โค้ดต่อโต๊ะ
- `/kitchen` — placeholder รอสร้างหน้าจอครัวดูออเดอร์แบบเรียลไทม์
