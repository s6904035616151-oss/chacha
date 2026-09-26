import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // ไม่ throw error ตอน build (เช่นตอน Vercel build โดยยังไม่ตั้งค่า env)
  // แต่จะ error ตอน runtime ถ้าเรียกใช้ client จริง ๆ โดยไม่มี env
  console.warn(
    '[supabaseClient] NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_ANON_KEY ยังไม่ได้ตั้งค่า'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
