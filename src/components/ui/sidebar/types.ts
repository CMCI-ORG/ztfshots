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
    icon?: LucideIcon;
  }[];
};

export type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};