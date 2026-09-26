# chacha

ระบบสั่งอาหารร้านชา "chacha" — Next.js (App Router, JavaScript) + Supabase, deploy บน Vercel

> 📌 อ่าน [`CLAUDE.md`](./CLAUDE.md) ก่อนพัฒนาต่อเสมอ — มีโครงสร้างฐานข้อมูลและกฎสำคัญ
> เรื่อง Dynamic Route params ที่เป็น Promise ใน Next.js เวอร์ชันล่าสุด

## เริ่มต้นใช้งาน (local)

```bash
npm install
cp .env.local.example .env.local   # แล้วใส่ค่า Supabase ของจริง
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Environment variables

ต้องตั้งค่าทั้งใน `.env.local` (local) และใน Vercel Project Settings > Environment Variables (production):

| ชื่อตัวแปร | คำอธิบาย |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL ของ Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key |

## โครงสร้างโปรเจกต์

```
chacha/
├── app/
│   ├── layout.js
│   ├── page.js              # หน้าแรก
│   ├── generate-qr/
│   │   └── page.js          # placeholder
│   └── kitchen/
│       └── page.js          # placeholder
├── lib/
│   └── supabaseClient.js    # Supabase client
├── next.config.js
├── package.json
├── .gitignore
├── .env.local.example
├── CLAUDE.md                 # โน้ตอ้างอิง (DB schema, กฎ params เป็น Promise)
└── README.md
```

## Deploy บน Vercel

1. Push โปรเจกต์นี้ขึ้น GitHub repo
2. Import repo เข้า Vercel
3. ตั้งค่า Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) ใน Vercel Project Settings
4. Deploy — ตรวจสอบว่าหน้า `/`, `/generate-qr`, `/kitchen` เข้าถึงได้

## ฐานข้อมูล (Supabase)

โปรเจกต์นี้อ้างอิงตารางที่มีอยู่แล้วใน Supabase: `sessions`, `menu_categories`,
`menu_items`, `orders` — รายละเอียดคอลัมน์ทั้งหมดอยู่ใน [`CLAUDE.md`](./CLAUDE.md)
