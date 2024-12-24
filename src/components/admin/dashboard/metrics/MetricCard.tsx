import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  delay?: string;
  color?: string;
  trend?: "up" | "down";
  icon?: ReactNode;
}

export const MetricCard = ({ 
  title, 
  value, 
  delay = "0ms", 
  color = "#8B5CF6",
  trend,
  icon
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    const Icon = trend === "up" ? ArrowUp : ArrowDown;
    return <Icon className="h-5 w-5" style={{ color }} />;
  };

  return (
    <Card 
      className="p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in relative overflow-hidden" 
      style={{ 
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        borderColor: `${color}30`
      }}
    >
      {/* Background circles for decoration */}
      <div 
        className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10"
        style={{ 
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          transform: 'translate(30%, -30%)'
        }}
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          {icon && <span style={{ color }}>{icon}</span>}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold" style={{ color }}>
            {value.toLocaleString()}
          </p>
          {getTrendIcon()}
        </div>
      </div>
    </Card>
  );
};