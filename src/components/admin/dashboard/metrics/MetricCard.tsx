import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  delay?: string;
  color?: string;
  icon?: ReactNode;
}

export const MetricCard = ({ 
  title, 
  value, 
  delay = "0ms", 
  color = "#8B5CF6",
  icon
}: MetricCardProps) => {
  return (
    <Card 
      className="p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in" 
      style={{ 
        animationDelay: delay,
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        borderColor: `${color}30`
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span style={{ color }}>{icon}</span>}
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
      </div>
      <p className="text-3xl font-bold" style={{ color }}>
        {value.toLocaleString()}
      </p>
    </Card>
  );
};