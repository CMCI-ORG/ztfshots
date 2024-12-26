export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          primary_language: string | null
          translations: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          primary_language?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          primary_language?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          quote_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          quote_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          quote_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      data_backups: {
        Row: {
          admin_id: string
          backup_type: string
          created_at: string
          data: Json
          description: string | null
          id: string
        }
        Insert: {
          admin_id: string
          backup_type: string
          created_at?: string
          data: Json
          description?: string | null
          id?: string
        }
        Update: {
          admin_id?: string
          backup_type?: string
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          created_at: string
          id: string
          nation: string | null
          reason: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nation?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nation?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          digest_id: string | null
          id: string
          quote_id: string | null
          sent_at: string
          status: string
          subscriber_id: string
          type: string
          whatsapp_message_id: string | null
          whatsapp_status: string | null
        }
        Insert: {
          digest_id?: string | null
          id?: string
          quote_id?: string | null
          sent_at?: string
          status?: string
          subscriber_id: string
          type: string
          whatsapp_message_id?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          digest_id?: string | null
          id?: string
          quote_id?: string | null
          sent_at?: string
          status?: string
          subscriber_id?: string
          type?: string
          whatsapp_message_id?: string | null
          whatsapp_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_digest_id_fkey"
            columns: ["digest_id"]
            isOneToOne: false
            referencedRelation: "weekly_digests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_user_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          browser_info: Json | null
          created_at: string
          error_message: string
          error_stack: string | null
          id: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          id?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feed_settings: {
        Row: {
          created_at: string
          feed_count: number
          footer_order: number | null
          footer_position: string | null
          id: string
          rss_url: string
          section_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feed_count?: number
          footer_order?: number | null
          footer_position?: string | null
          id?: string
          rss_url: string
          section_title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feed_count?: number
          footer_order?: number | null
          footer_position?: string | null
          id?: string
          rss_url?: string
          section_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_columns: {
        Row: {
          created_at: string
          id: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      footer_content_types: {
        Row: {
          created_at: string
          fields: Json
          id: string
          name: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          fields?: Json
          id?: string
          name: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          fields?: Json
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
        }
        Relationships: []
      }
      footer_contents: {
        Row: {
          column_id: string | null
          content: Json
          content_type_id: string | null
          created_at: string
          id: string
          order_position: number
          title: string | null
          updated_at: string
        }
        Insert: {
          column_id?: string | null
          content?: Json
          content_type_id?: string | null
          created_at?: string
          id?: string
          order_position?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          column_id?: string | null
          content?: Json
          content_type_id?: string | null
          created_at?: string
          id?: string
          order_position?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "footer_contents_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "footer_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "footer_contents_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "footer_content_types"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_settings: {
        Row: {
          column_1_description: string | null
          column_1_playstore_link: string | null
          column_2_links: Json | null
          column_2_title: string | null
          column_3_links: Json | null
          column_3_title: string | null
          column_4_contact_email: string | null
          column_4_contact_phone: string | null
          column_4_social_links: Json | null
          column_4_title: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          column_1_description?: string | null
          column_1_playstore_link?: string | null
          column_2_links?: Json | null
          column_2_title?: string | null
          column_3_links?: Json | null
          column_3_title?: string | null
          column_4_contact_email?: string | null
          column_4_contact_phone?: string | null
          column_4_social_links?: Json | null
          column_4_title?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          column_1_description?: string | null
          column_1_playstore_link?: string | null
          column_2_links?: Json | null
          column_2_title?: string | null
          column_3_links?: Json | null
          column_3_title?: string | null
          column_4_contact_email?: string | null
          column_4_contact_phone?: string | null
          column_4_social_links?: Json | null
          column_4_title?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string
          is_active: boolean | null
          name: string
          native_name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean | null
          name: string
          native_name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean | null
          name?: string
          native_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages_content: {
        Row: {
          content: string
          created_at: string
          id: string
          meta_description: string | null
          page_key: string
          rich_text_content: Json | null
          sidebar_content: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          meta_description?: string | null
          page_key: string
          rich_text_content?: Json | null
          sidebar_content?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          page_key?: string
          rich_text_content?: Json | null
          sidebar_content?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_resets: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email_verified: boolean | null
          id: string
          last_login: string | null
          preferred_language: string | null
          role: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_verified?: boolean | null
          id: string
          last_login?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_verified?: boolean | null
          id?: string
          last_login?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      quote_downloads: {
        Row: {
          created_at: string
          id: string
          quote_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_downloads_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_likes: {
        Row: {
          created_at: string
          id: string
          quote_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_likes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_shares: {
        Row: {
          created_at: string
          id: string
          quote_id: string
          share_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id: string
          share_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string
          share_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_shares_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_stars: {
        Row: {
          created_at: string
          id: string
          quote_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_stars_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author_id: string
          category_id: string
          created_at: string
          id: string
          post_date: string
          primary_language: string | null
          source_id: string | null
          source_title: string | null
          source_url: string | null
          status: string
          text: string
          title: string | null
          translations: Json | null
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id: string
          created_at?: string
          id?: string
          post_date: string
          primary_language?: string | null
          source_id?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          text: string
          title?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string
          created_at?: string
          id?: string
          post_date?: string
          primary_language?: string | null
          source_id?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          text?: string
          title?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_quote_counts"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "quotes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          release_date: string
          status: string | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          release_date: string
          status?: string | null
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          release_date?: string
          status?: string | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          priority: number | null
          quarter: string
          status: string | null
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          priority?: number | null
          quarter: string
          status?: string | null
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          priority?: number | null
          quarter?: string
          status?: string | null
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          header_display_type: string
          icon_url: string | null
          id: string
          logo_url: string | null
          site_name: string
          tag_line: string | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          header_display_type?: string
          icon_url?: string | null
          id?: string
          logo_url?: string | null
          site_name?: string
          tag_line?: string | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          header_display_type?: string
          icon_url?: string | null
          id?: string
          logo_url?: string | null
          site_name?: string
          tag_line?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          nation: string | null
          notify_new_quotes: boolean | null
          notify_weekly_digest: boolean | null
          notify_whatsapp: boolean | null
          role: string
          status: string
          updated_at: string
          whatsapp_phone: string | null
          whatsapp_verified: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          nation?: string | null
          notify_new_quotes?: boolean | null
          notify_weekly_digest?: boolean | null
          notify_whatsapp?: boolean | null
          role?: string
          status?: string
          updated_at?: string
          whatsapp_phone?: string | null
          whatsapp_verified?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          nation?: string | null
          notify_new_quotes?: boolean | null
          notify_weekly_digest?: boolean | null
          notify_whatsapp?: boolean | null
          role?: string
          status?: string
          updated_at?: string
          whatsapp_phone?: string | null
          whatsapp_verified?: boolean | null
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          language: string | null
          latitude: number | null
          longitude: number | null
          os: string | null
          referrer: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          os?: string | null
          referrer?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          os?: string | null
          referrer?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      weekly_digests: {
        Row: {
          end_date: string
          id: string
          recipient_count: number
          sent_at: string
          start_date: string
        }
        Insert: {
          end_date: string
          id?: string
          recipient_count: number
          sent_at?: string
          start_date: string
        }
        Update: {
          end_date?: string
          id?: string
          recipient_count?: number
          sent_at?: string
          start_date?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          language: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          language?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          language?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      author_quote_counts: {
        Row: {
          author_id: string | null
          quote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      category_quote_counts: {
        Row: {
          category_id: string | null
          quote_count: number | null
        }
        Relationships: []
      }
      demographic_analytics: {
        Row: {
          browser: string | null
          country: string | null
          device_type: string | null
          language: string | null
          os: string | null
          unique_visitors: number | null
          visit_count: number | null
        }
        Relationships: []
      }
      source_quote_counts: {
        Row: {
          quote_count: number | null
          source_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriber_locations: {
        Row: {
          country: string | null
          subscriber_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: "text" | "link" | "feed" | "image" | "address" | "social"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
