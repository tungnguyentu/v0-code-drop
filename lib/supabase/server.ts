import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export function createServerClient() {
  return createServerComponentClient<Database>({ cookies })
}
