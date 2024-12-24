import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, BookOpen, Tags, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  const actions = [
    {
      title: "Add New Quote",
      icon: PlusCircle,
      href: "/admin/quotes",
      delay: "0ms",
    },
    {
      title: "Manage Authors",
      icon: Users,
      href: "/admin/authors",
      delay: "150ms",
    },
    {
      title: "Manage Categories",
      icon: Tags,
      href: "/admin/categories",
      delay: "300ms",
    },
    {
      title: "View All Quotes",
      icon: BookOpen,
      href: "/admin/quotes",
      delay: "450ms",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.href}
          className="block animate-fade-in"
          style={{ animationDelay: action.delay }}
        >
          <Card className="p-6 h-full hover:bg-accent transition-colors duration-300 group">
            <div className="space-y-4">
              <action.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <h3 className="font-semibold">{action.title}</h3>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};