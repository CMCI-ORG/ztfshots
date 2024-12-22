import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface InteractionButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  children: ReactNode;
  count?: number;
}

export const InteractionButton = ({ 
  onClick, 
  isActive, 
  children,
  count
}: InteractionButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-gray-600 hover:text-[#8B5CF6] ${isActive ? 'text-[#8B5CF6]' : ''}`}
      onClick={onClick}
    >
      {children}
      {count !== undefined && <span className="ml-1 text-xs">{count}</span>}
    </Button>
  );
};