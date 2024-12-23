import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/components/ui/sidebar/types";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavigationGroupProps {
  items: MenuItem[];
  label: string;
}

export const NavigationGroup = ({ items, label }: NavigationGroupProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start transition-colors duration-200"
                  onClick={() => navigate(item.url)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
};