export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      pastes: {
        Row: {
          id: string
          short_id: string
          title: string | null
          content: string
          language: string
          created_at: string
          expires_at: string | null
          view_limit: string
          view_count: number
        }
        Insert: {
          id?: string
          short_id: string
          title?: string | null
          content: string
          language: string
          created_at?: string
          expires_at?: string | null
          view_limit: string
          view_count?: number
        }
        Update: {
          id?: string
          short_id?: string
          title?: string | null
          content?: string
          language?: string
          created_at?: string
          expires_at?: string | null
          view_limit?: string
          view_count?: number
        }
      }
    }
  }
}
