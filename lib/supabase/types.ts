export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          type: string;
          title: string;
          suburb: string;
          price: string;
          beds: number;
          baths: number;
          parking: number;
          description: string;
          images: string[];
          status: "available" | "sold" | "pending";
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          type?: string;
          title: string;
          suburb: string;
          price: string;
          beds: number;
          baths: number;
          parking: number;
          description: string;
          images: string[];
          status: "available" | "sold" | "pending";
          featured: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          suburb?: string;
          price?: string;
          beds?: number;
          baths?: number;
          parking?: number;
          description?: string;
          images?: string[];
          status?: "available" | "sold" | "pending";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
