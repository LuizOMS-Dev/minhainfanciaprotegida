export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      article_sources: {
        Row: {
          article_id: string
          id: string
          label: string
          position: number
          url: string
        }
        Insert: {
          article_id: string
          id?: string
          label: string
          position?: number
          url: string
        }
        Update: {
          article_id?: string
          id?: string
          label?: string
          position?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_sources_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          body: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          id: string
          last_verified_at: string | null
          primary_source_label: string | null
          primary_source_url: string | null
          publish_at: string | null
          reviewer_id: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          subtitle: string | null
          title: string
          type: Database["public"]["Enums"]["article_type"]
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          last_verified_at?: string | null
          primary_source_label?: string | null
          primary_source_url?: string | null
          publish_at?: string | null
          reviewer_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          subtitle?: string | null
          title: string
          type: Database["public"]["Enums"]["article_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          last_verified_at?: string | null
          primary_source_label?: string | null
          primary_source_url?: string | null
          publish_at?: string | null
          reviewer_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          subtitle?: string | null
          title?: string
          type?: Database["public"]["Enums"]["article_type"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          target_id: string | null
          target_title: string | null
          target_type: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_title?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_title?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      help_locations: {
        Row: {
          address: string | null
          city: string
          created_at: string
          hours: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          official_url: string | null
          phone: string | null
          state: string
          type: Database["public"]["Enums"]["help_type"]
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          hours?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          official_url?: string | null
          phone?: string | null
          state: string
          type: Database["public"]["Enums"]["help_type"]
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          hours?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          official_url?: string | null
          phone?: string | null
          state?: string
          type?: Database["public"]["Enums"]["help_type"]
        }
        Relationships: []
      }
      library_items: {
        Row: {
          audience: string
          category: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          source_org: string
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          audience: string
          category: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          source_org: string
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          audience?: string
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          source_org?: string
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "revisor"
      article_status:
        | "draft"
        | "review"
        | "scheduled"
        | "published"
        | "archived"
      article_type: "news" | "case" | "risk" | "guide"
      audit_action:
        | "login"
        | "logout"
        | "login_failed"
        | "unauthorized_access"
        | "content_create"
        | "content_update"
        | "content_delete"
        | "content_publish"
        | "content_unpublish"
        | "user_create"
        | "user_update"
        | "user_delete"
        | "role_change"
        | "password_reset"
        | "csv_import"
        | "library_change"
        | "location_change"
      help_type:
        | "conselho_tutelar"
        | "delegacia"
        | "creas"
        | "cras"
        | "mp"
        | "disque"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "revisor"],
      article_status: ["draft", "review", "scheduled", "published", "archived"],
      article_type: ["news", "case", "risk", "guide"],
      audit_action: [
        "login",
        "logout",
        "login_failed",
        "unauthorized_access",
        "content_create",
        "content_update",
        "content_delete",
        "content_publish",
        "content_unpublish",
        "user_create",
        "user_update",
        "user_delete",
        "role_change",
        "password_reset",
        "csv_import",
        "library_change",
        "location_change",
      ],
      help_type: [
        "conselho_tutelar",
        "delegacia",
        "creas",
        "cras",
        "mp",
        "disque",
      ],
    },
  },
} as const
