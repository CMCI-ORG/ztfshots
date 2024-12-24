import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { FooterRSSFeed } from "./FooterRSSFeed";

interface FooterColumnProps {
  title?: string;
  children: ReactNode;
  position: string;
}

export const FooterColumn = ({ title, children, position }: FooterColumnProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {children}
      </div>
      <Separator className="my-4" />
      <FooterRSSFeed position={position} />
    </div>
  );
};