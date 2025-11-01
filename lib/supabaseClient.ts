import { createClient } from "@supabase/supabase-js";

// Access environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Log if missing (for debugging)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables missing");
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
