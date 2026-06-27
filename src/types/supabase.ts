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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          car_id: string | null
          car_name: string
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          end_date: string
          id: string
          location: string | null
          payment_link: string | null
          payment_method: string | null
          payment_status: string | null
          start_date: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          car_id?: string | null
          car_name: string
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          end_date: string
          id?: string
          location?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          start_date: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          car_id?: string | null
          car_name?: string
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          end_date?: string
          id?: string
          location?: string | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          start_date?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          availability: string | null
          color: string | null
          created_at: string | null
          description: string | null
          fuel_type: string | null
          id: string
          image: string | null
          location: string | null
          mileage: number | null
          name: string
          price: number
          seats: number | null
          transmission: string | null
          type: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          availability?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          fuel_type?: string | null
          id?: string
          image?: string | null
          location?: string | null
          mileage?: number | null
          name: string
          price: number
          seats?: number | null
          transmission?: string | null
          type: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          availability?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          fuel_type?: string | null
          id?: string
          image?: string | null
          location?: string | null
          mileage?: number | null
          name?: string
          price?: number
          seats?: number | null
          transmission?: string | null
          type?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read: boolean | null
          room_id: string | null
          sender_id: string | null
          sender_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read?: boolean | null
          room_id?: string | null
          sender_id?: string | null
          sender_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read?: boolean | null
          room_id?: string | null
          sender_id?: string | null
          sender_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          id: string
          name: string
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_admin: boolean | null
          sender_email: string | null
          sender_id: string | null
          sender_name: string
          sender_phone: string | null
          status: string | null
          text: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          sender_email?: string | null
          sender_id?: string | null
          sender_name: string
          sender_phone?: string | null
          status?: string | null
          text: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          sender_email?: string | null
          sender_id?: string | null
          sender_name?: string
          sender_phone?: string | null
          status?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          fapshi_status: string | null
          fapshi_transaction_id: string | null
          id: string
          payment_method: string | null
          phone: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          fapshi_status?: string | null
          fapshi_transaction_id?: string | null
          id?: string
          payment_method?: string | null
          phone: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          fapshi_status?: string | null
          fapshi_transaction_id?: string | null
          id?: string
          payment_method?: string | null
          phone?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          arrival_date: string | null
          city: string | null
          cni_back: string | null
          cni_front: string | null
          cni_number: string | null
          cni_verified: boolean | null
          country: string | null
          country_of_residence: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_notifications: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          id_number: string | null
          id_type: string | null
          identity_document_url: string | null
          is_verified: boolean | null
          local_cameroon_address: string | null
          mtn_momo_number: string | null
          nationality: string | null
          orange_money_number: string | null
          permis_back: string | null
          permis_expiry: string | null
          permis_front: string | null
          permis_number: string | null
          permis_verified: boolean | null
          phone: string
          phone_country_code: string | null
          
          profile_photo: string | null
          quartier: string | null
          role: string | null
          sms_notifications: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          arrival_date?: string | null
          city?: string | null
          cni_back?: string | null
          cni_front?: string | null
          cni_number?: string | null
          cni_verified?: boolean | null
          country?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_notifications?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id: string
          id_number?: string | null
          id_type?: string | null
          identity_document_url?: string | null
          is_verified?: boolean | null
          local_cameroon_address?: string | null
          mtn_momo_number?: string | null
          nationality?: string | null
          orange_money_number?: string | null
          permis_back?: string | null
          permis_expiry?: string | null
          permis_front?: string | null
          permis_number?: string | null
          permis_verified?: boolean | null
          phone: string
          phone_country_code?: string | null
          
          profile_photo?: string | null
          quartier?: string | null
          role?: string | null
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          arrival_date?: string | null
          city?: string | null
          cni_back?: string | null
          cni_front?: string | null
          cni_number?: string | null
          cni_verified?: boolean | null
          country?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_notifications?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          identity_document_url?: string | null
          is_verified?: boolean | null
          local_cameroon_address?: string | null
          mtn_momo_number?: string | null
          nationality?: string | null
          orange_money_number?: string | null
          permis_back?: string | null
          permis_expiry?: string | null
          permis_front?: string | null
          permis_number?: string | null
          permis_verified?: boolean | null
          phone?: string
          phone_country_code?: string | null
          
          profile_photo?: string | null
          quartier?: string | null
          role?: string | null
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          car_id: string | null
          car_name: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          status: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          car_id?: string | null
          car_name?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          car_id?: string | null
          car_name?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          car_id: string | null
          car_name: string
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          payment_link: string | null
          payment_method: string | null
          payment_status: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          car_id?: string | null
          car_name: string
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          car_id?: string | null
          car_name?: string
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          section: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          section: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          rating: number
          status: string | null
          testimonial: string
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          rating: number
          status?: string | null
          testimonial: string
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          rating?: number
          status?: string | null
          testimonial?: string
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          joined_date: string | null
          last_active: string | null
          name: string
          phone: string | null
          role: string | null
          status: string | null
          total_bookings: number | null
          total_purchases: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          joined_date?: string | null
          last_active?: string | null
          name: string
          phone?: string | null
          role?: string | null
          status?: string | null
          total_bookings?: number | null
          total_purchases?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          joined_date?: string | null
          last_active?: string | null
          name?: string
          phone?: string | null
          role?: string | null
          status?: string | null
          total_bookings?: number | null
          total_purchases?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
