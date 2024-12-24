export type FeedSettings = {
  id: string;
  rss_url: string;
  section_title: string;
  feed_count: number;
  footer_position: "none" | "column_1" | "column_2" | "column_3" | "column_4";
  footer_order: number;
  status?: "active" | "inactive";
};

export type FeedSettingsFormData = Omit<FeedSettings, "id" | "status">;