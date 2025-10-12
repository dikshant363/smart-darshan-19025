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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      booking_analytics: {
        Row: {
          avg_visitors_per_booking: number | null
          cancelled_bookings: number | null
          completed_bookings: number | null
          created_at: string | null
          date: string
          id: string
          peak_hour: string | null
          temple_id: string
          total_bookings: number | null
        }
        Insert: {
          avg_visitors_per_booking?: number | null
          cancelled_bookings?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          date: string
          id?: string
          peak_hour?: string | null
          temple_id: string
          total_bookings?: number | null
        }
        Update: {
          avg_visitors_per_booking?: number | null
          cancelled_bookings?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          date?: string
          id?: string
          peak_hour?: string | null
          temple_id?: string
          total_bookings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_analytics_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          id: string
          payment_amount: number | null
          payment_status: string | null
          qr_code: string | null
          special_requirements: string | null
          status: string | null
          temple_id: string
          time_slot: string
          updated_at: string | null
          user_id: string
          visitor_count: number
        }
        Insert: {
          booking_date: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          qr_code?: string | null
          special_requirements?: string | null
          status?: string | null
          temple_id: string
          time_slot: string
          updated_at?: string | null
          user_id: string
          visitor_count?: number
        }
        Update: {
          booking_date?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          qr_code?: string | null
          special_requirements?: string | null
          status?: string | null
          temple_id?: string
          time_slot?: string
          updated_at?: string | null
          user_id?: string
          visitor_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crowd_data: {
        Row: {
          capacity_percentage: number | null
          crowd_count: number
          crowd_level: string
          id: string
          recorded_at: string | null
          temple_id: string
        }
        Insert: {
          capacity_percentage?: number | null
          crowd_count: number
          crowd_level: string
          id?: string
          recorded_at?: string | null
          temple_id: string
        }
        Update: {
          capacity_percentage?: number | null
          crowd_count?: number
          crowd_level?: string
          id?: string
          recorded_at?: string | null
          temple_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crowd_data_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_incidents: {
        Row: {
          description: string | null
          id: string
          incident_type: string
          location_lat: number | null
          location_lng: number | null
          priority: string | null
          reported_at: string | null
          resolved_at: string | null
          status: string | null
          temple_id: string | null
          user_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          incident_type: string
          location_lat?: number | null
          location_lng?: number | null
          priority?: string | null
          reported_at?: string | null
          resolved_at?: string | null
          status?: string | null
          temple_id?: string | null
          user_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          incident_type?: string
          location_lat?: number | null
          location_lng?: number | null
          priority?: string | null
          reported_at?: string | null
          resolved_at?: string | null
          status?: string | null
          temple_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_incidents_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_incidents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          priority: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          priority?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          priority?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_data: {
        Row: {
          available_spots: number
          id: string
          last_updated: string | null
          parking_area_name: string
          temple_id: string
          total_spots: number
        }
        Insert: {
          available_spots: number
          id?: string
          last_updated?: string | null
          parking_area_name: string
          temple_id: string
          total_spots: number
        }
        Update: {
          available_spots?: number
          id?: string
          last_updated?: string | null
          parking_area_name?: string
          temple_id?: string
          total_spots?: number
        }
        Relationships: [
          {
            foreignKeyName: "parking_data_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessibility_needs: string[] | null
          created_at: string | null
          display_name: string | null
          id: string
          language_preference: string | null
          notification_preferences: Json | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          accessibility_needs?: string[] | null
          created_at?: string | null
          display_name?: string | null
          id: string
          language_preference?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          accessibility_needs?: string[] | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      queue_status: {
        Row: {
          booking_id: string
          current_position: number
          estimated_wait_minutes: number
          id: string
          last_updated: string | null
          status: string | null
          temple_id: string
          total_in_queue: number
        }
        Insert: {
          booking_id: string
          current_position: number
          estimated_wait_minutes: number
          id?: string
          last_updated?: string | null
          status?: string | null
          temple_id: string
          total_in_queue: number
        }
        Update: {
          booking_id?: string
          current_position?: number
          estimated_wait_minutes?: number
          id?: string
          last_updated?: string | null
          status?: string | null
          temple_id?: string
          total_in_queue?: number
        }
        Relationships: [
          {
            foreignKeyName: "queue_status_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_status_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          address: string
          capacity: number
          city: string
          closing_time: string
          created_at: string | null
          current_crowd_level: string | null
          description: string | null
          facilities: string[] | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          name: string
          opening_time: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address: string
          capacity?: number
          city: string
          closing_time?: string
          created_at?: string | null
          current_crowd_level?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          name: string
          opening_time?: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          capacity?: number
          city?: string
          closing_time?: string
          created_at?: string | null
          current_crowd_level?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          name?: string
          opening_time?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      traffic_data: {
        Row: {
          congestion_level: string | null
          created_at: string | null
          estimated_travel_time_minutes: number | null
          id: string
          last_updated: string | null
          route_name: string
          temple_id: string
        }
        Insert: {
          congestion_level?: string | null
          created_at?: string | null
          estimated_travel_time_minutes?: number | null
          id?: string
          last_updated?: string | null
          route_name: string
          temple_id: string
        }
        Update: {
          congestion_level?: string | null
          created_at?: string | null
          estimated_travel_time_minutes?: number | null
          id?: string
          last_updated?: string | null
          route_name?: string
          temple_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "traffic_data_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          temple_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          temple_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          temple_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_crowd_predictions: {
        Args: { p_days_ahead?: number; p_temple_id: string }
        Returns: {
          confidence: number
          date: string
          predicted_level: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_activity_type: string
          p_description: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "user" | "admin" | "temple_staff"
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
      app_role: ["user", "admin", "temple_staff"],
    },
  },
} as const
