export interface WhatsappTemplate {
  id: string;
  name: string;
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  created_at?: string;
  updated_at?: string;
}