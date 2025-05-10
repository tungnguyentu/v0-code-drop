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
      feedback: {
        Row: {
          id: string
          type: string
          message: string
          email: string | null
          created_at: string
          status: string
          is_read: boolean
        }
        Insert: {
          id?: string
          type: string
          message: string
          email?: string | null
          created_at?: string
          status?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          type?: string
          message?: string
          email?: string | null
          created_at?: string
          status?: string
          is_read?: boolean
        }
      }
    }
  }
}
