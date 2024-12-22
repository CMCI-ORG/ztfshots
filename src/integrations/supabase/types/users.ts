export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}