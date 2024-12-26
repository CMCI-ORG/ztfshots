import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
  delay?: string;
  ariaLabel?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  color = "#8B5CF6", 
  icon, 
  delay = "0ms",
  ariaLabel
}: MetricCardProps) => {
  return (
    <Card 
      className="p-4 animate-fade-in"
      style={{ animationDelay: delay }}
      role="article"
      aria-label={ariaLabel || title}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && (
          <div 
            className="p-2 rounded-full" 
            style={{ backgroundColor: `${color}20` }}
            aria-hidden="true"
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
      <p 
        className="text-2xl font-bold"
        style={{ color }}
        aria-live="polite"
      >
        {value.toLocaleString()}
      </p>
    </Card>
  );
};