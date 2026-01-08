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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          confidence: number | null
          created_at: string
          description: string | null
          ecosystem_id: string
          executed_at: string | null
          id: string
          inputs: Json
          projected_impact: Json | null
          status: string | null
          time_to_impact_years: number | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          confidence?: number | null
          created_at?: string
          description?: string | null
          ecosystem_id: string
          executed_at?: string | null
          id?: string
          inputs?: Json
          projected_impact?: Json | null
          status?: string | null
          time_to_impact_years?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          confidence?: number | null
          created_at?: string
          description?: string | null
          ecosystem_id?: string
          executed_at?: string | null
          id?: string
          inputs?: Json
          projected_impact?: Json | null
          status?: string | null
          time_to_impact_years?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_ecosystem_id_fkey"
            columns: ["ecosystem_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_units"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystem_metrics: {
        Row: {
          biodiversity_confidence: number | null
          biodiversity_index: number | null
          biodiversity_range: Json | null
          carbon_confidence: number | null
          carbon_sequestration_range: Json | null
          carbon_sequestration_tons: number | null
          created_at: string
          ecosystem_id: string
          id: string
          recorded_at: string
          soil_confidence: number | null
          soil_health_percent: number | null
          soil_health_range: Json | null
          water_confidence: number | null
          water_retention_m3: number | null
          water_retention_range: Json | null
        }
        Insert: {
          biodiversity_confidence?: number | null
          biodiversity_index?: number | null
          biodiversity_range?: Json | null
          carbon_confidence?: number | null
          carbon_sequestration_range?: Json | null
          carbon_sequestration_tons?: number | null
          created_at?: string
          ecosystem_id: string
          id?: string
          recorded_at?: string
          soil_confidence?: number | null
          soil_health_percent?: number | null
          soil_health_range?: Json | null
          water_confidence?: number | null
          water_retention_m3?: number | null
          water_retention_range?: Json | null
        }
        Update: {
          biodiversity_confidence?: number | null
          biodiversity_index?: number | null
          biodiversity_range?: Json | null
          carbon_confidence?: number | null
          carbon_sequestration_range?: Json | null
          carbon_sequestration_tons?: number | null
          created_at?: string
          ecosystem_id?: string
          id?: string
          recorded_at?: string
          soil_confidence?: number | null
          soil_health_percent?: number | null
          soil_health_range?: Json | null
          water_confidence?: number | null
          water_retention_m3?: number | null
          water_retention_range?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ecosystem_metrics_ecosystem_id_fkey"
            columns: ["ecosystem_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_units"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystem_units: {
        Row: {
          area_hectares: number | null
          coordinates: Json | null
          created_at: string
          id: string
          metadata: Json | null
          name: string
          region_id: string | null
          status: Database["public"]["Enums"]["ecosystem_status"]
          type: Database["public"]["Enums"]["ecosystem_type"]
          unit_id: string
          updated_at: string
        }
        Insert: {
          area_hectares?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          region_id?: string | null
          status?: Database["public"]["Enums"]["ecosystem_status"]
          type?: Database["public"]["Enums"]["ecosystem_type"]
          unit_id: string
          updated_at?: string
        }
        Update: {
          area_hectares?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          region_id?: string | null
          status?: Database["public"]["Enums"]["ecosystem_status"]
          type?: Database["public"]["Enums"]["ecosystem_type"]
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ecosystem_units_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          continent: string
          coordinates: Json | null
          country: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          continent: string
          coordinates?: Json | null
          country: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          continent?: string
          coordinates?: Json | null
          country?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          created_at: string
          credibility_score: number | null
          ecosystem_id: string
          id: string
          raw_data: Json | null
          recorded_at: string
          signal_type: string
          source: Database["public"]["Enums"]["signal_source"]
          source_id: string | null
          spatial_accuracy: number | null
          temporal_relevance: number | null
          unit: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          credibility_score?: number | null
          ecosystem_id: string
          id?: string
          raw_data?: Json | null
          recorded_at?: string
          signal_type: string
          source: Database["public"]["Enums"]["signal_source"]
          source_id?: string | null
          spatial_accuracy?: number | null
          temporal_relevance?: number | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          credibility_score?: number | null
          ecosystem_id?: string
          id?: string
          raw_data?: Json | null
          recorded_at?: string
          signal_type?: string
          source?: Database["public"]["Enums"]["signal_source"]
          source_id?: string | null
          spatial_accuracy?: number | null
          temporal_relevance?: number | null
          unit?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "signals_ecosystem_id_fkey"
            columns: ["ecosystem_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_units"
            referencedColumns: ["id"]
          },
        ]
      }
      value_tokens: {
        Row: {
          action_id: string | null
          created_at: string
          ecosystem_id: string
          expires_at: string | null
          id: string
          issued_at: string
          metadata: Json | null
          token_type: string
          unit: string
          value: number
          verification_method: string | null
          verified: boolean | null
        }
        Insert: {
          action_id?: string | null
          created_at?: string
          ecosystem_id: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          token_type: string
          unit: string
          value: number
          verification_method?: string | null
          verified?: boolean | null
        }
        Update: {
          action_id?: string | null
          created_at?: string
          ecosystem_id?: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          token_type?: string
          unit?: string
          value?: number
          verification_method?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "value_tokens_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "value_tokens_ecosystem_id_fkey"
            columns: ["ecosystem_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_type:
        | "reforestation"
        | "restoration"
        | "education"
        | "healthcare"
        | "financing"
        | "conservation"
      ecosystem_status: "active" | "monitoring" | "degraded" | "restored"
      ecosystem_type:
        | "watershed"
        | "forest"
        | "urban_block"
        | "farm"
        | "grassland"
        | "wetland"
      signal_source:
        | "iot_sensor"
        | "satellite"
        | "human_report"
        | "financial_flow"
        | "audit"
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
      action_type: [
        "reforestation",
        "restoration",
        "education",
        "healthcare",
        "financing",
        "conservation",
      ],
      ecosystem_status: ["active", "monitoring", "degraded", "restored"],
      ecosystem_type: [
        "watershed",
        "forest",
        "urban_block",
        "farm",
        "grassland",
        "wetland",
      ],
      signal_source: [
        "iot_sensor",
        "satellite",
        "human_report",
        "financial_flow",
        "audit",
      ],
    },
  },
} as const
