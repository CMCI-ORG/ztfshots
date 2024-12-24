import { LucideIcon } from "lucide-react";

export type MenuItem = {
  title: string;
  icon?: LucideIcon;
  url?: string;
  target?: string;
  rel?: string;
  items?: {
    title: string;
    url: string;
  }[];
};