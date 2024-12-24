import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Rss } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FooterColumnProps {
  title: string;
  children: ReactNode;
  rssLink: string;
}

export const FooterColumn = ({ title, children, rssLink }: FooterColumnProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {children}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <h4 className="font-semibold">Updates</h4>
        <Link to={rssLink} className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-[#8B5CF6]">
          <Rss className="h-4 w-4" />
          <span>RSS Feed</span>
        </Link>
      </div>
    </div>
  );
};