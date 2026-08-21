import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  isSupabaseConfigured,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local",
    );
  }

  return createClient<Database>(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
