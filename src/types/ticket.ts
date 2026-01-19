
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';



export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  department:string;
  extension:string;
  role: 'ADMIN' | 'USER';
  avatar_url?: string | null;
  updated_at?: string;
}

export interface Ticket {
  id: string; 
  created_at: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  user_id: string;
  image_url?: string | null;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  category: string;
  user_id?: string; 
}

export interface TicketLog {
  id: number;
  ticket_id: string;
  status_update: string;
  notes: string;
  created_at: string;
  admin_id?: string;
}