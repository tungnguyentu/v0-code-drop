import { createClient } from "@supabase/supabase-js"
import { encryptText } from "../lib/encryption"
import type { Database } from "../lib/supabase/database.types"

// This script should be run once to encrypt all existing snippets
// It's a one-time migration script

async function migrateAndEncryptSnippets() {
  // Create Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    process.exit(1)
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  // First, add the new columns if they don't exist
  // Note: This assumes you have the necessary permissions to alter the table
  // In many hosted environments, you might need to run these ALTER TABLE commands directly
  try {
    console.log("Adding new columns to the pastes table...")

    // These would typically be run as SQL migrations in a production environment
    await supabase.rpc("add_column_if_not_exists", {
      table_name: "pastes",
      column_name: "content_iv",
      column_type: "text",
    })

    await supabase.rpc("add_column_if_not_exists", {
      table_name: "pastes",
      column_name: "content_auth_tag",
      column_type: "text",
    })

    await supabase.rpc("add_column_if_not_exists", {
      table_name: "pastes",
      column_name: "is_encrypted",
      column_type: "boolean",
      column_default: "false",
    })

    console.log("Columns added successfully")
  } catch (error) {
    console.error("Error adding columns:", error)
    console.log("You may need to add these columns manually or through your database management interface")
  }

  // Now fetch and encrypt all existing snippets
  console.log("Fetching existing snippets...")
  const { data: snippets, error } = await supabase
    .from("pastes")
    .select("id, short_id, content, is_encrypted")
    .eq("is_encrypted", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching snippets:", error)
    process.exit(1)
  }

  console.log(`Found ${snippets.length} unencrypted snippets`)

  // Process each snippet
  for (const snippet of snippets) {
    try {
      console.log(`Encrypting snippet ${snippet.short_id}...`)

      // Encrypt the content
      const { encryptedText, iv, authTag } = encryptText(snippet.content)

      // Update the snippet with encrypted content
      const { error: updateError } = await supabase
        .from("pastes")
        .update({
          content: encryptedText,
          content_iv: iv,
          content_auth_tag: authTag,
          is_encrypted: true,
        })
        .eq("id", snippet.id)

      if (updateError) {
        console.error(`Error updating snippet ${snippet.short_id}:`, updateError)
        continue
      }

      console.log(`Snippet ${snippet.short_id} encrypted successfully`)
    } catch (error) {
      console.error(`Error processing snippet ${snippet.short_id}:`, error)
    }
  }

  console.log("Migration completed")
}

// Run the migration
migrateAndEncryptSnippets()
  .then(() => {
    console.log("All done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Migration failed:", error)
    process.exit(1)
  })
