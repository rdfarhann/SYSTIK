export interface Ticket {
  id: number; // Berubah dari string ke number sesuai gambar
  ticket_no: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  user_id: string;
  assigned_to?: string | null; // Ada di skema gambar
  created_at: string;
  closed_at?: string | null; // Ada di skema gambar
  attachment_url?: string | null; 
  phone_number?: string
  
  profiles?: {
    full_name: string | null;
  } | null;
}