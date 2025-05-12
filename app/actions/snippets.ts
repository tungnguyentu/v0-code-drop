"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getSnippetsList() {
  const supabase = createServerClient()

  const { data: snippets, error } = await supabase
    .from("pastes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching snippets:", error)
    return []
  }

  return snippets || []
}
