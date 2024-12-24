export type FooterLink = {
  title: string;
  url: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type FooterSettings = {
  id?: string;
  column_1_description?: string | null;
  column_1_playstore_link?: string | null;
  column_2_title: string;
  column_2_links: FooterLink[];
  column_3_title: string;
  column_3_links: FooterLink[];
  column_4_title: string;
  column_4_contact_email?: string | null;
  column_4_contact_phone?: string | null;
  column_4_social_links: SocialLink[];
  created_at?: string;
  updated_at?: string;
};