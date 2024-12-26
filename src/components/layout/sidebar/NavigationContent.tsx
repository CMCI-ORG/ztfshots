import { Home, Quote, Users, BookOpen, Mail, Settings2, MessageSquare, Bell, LayoutDashboard, FileText, GitPullRequest } from 'lucide-react';
import { SidebarGroup } from '@/components/ui/sidebar';
import { NavigationGroup } from './NavigationGroup';
import { MenuItem } from '@/components/ui/sidebar/types';

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: Home, url: "/admin" },
  { title: "Quotes", icon: Quote, url: "/admin/quotes" },
  { title: "Subscribers", icon: Users, url: "/admin/subscribers" },
  { title: "WhatsApp Templates", icon: MessageSquare, url: "/admin/whatsapp" },
  {
    title: "Content Management",
    icon: LayoutDashboard,
    items: [
      { title: "Footer", url: "/admin/content/footer" },
      { title: "Feed", url: "/admin/content/feed" },
      { title: "Pages", url: "/admin/content/pages", icon: FileText },
    ]
  },
  { title: "Settings", icon: Settings2, url: "/admin/settings" },
];

export const NavigationContent = () => {
  return (
    <SidebarGroup>
      <NavigationGroup label="Navigation" items={menuItems} />
    </SidebarGroup>
  );
};