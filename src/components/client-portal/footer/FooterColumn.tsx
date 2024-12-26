import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface FooterColumnProps {
  title?: string;
  children: ReactNode;
  position: string;
}

export const FooterColumn = ({ title, children, position }: FooterColumnProps) => {
  return (
    <div className="flex-1 min-w-[250px] space-y-6 p-4">
      <div className="space-y-4">
        {title && (
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
};