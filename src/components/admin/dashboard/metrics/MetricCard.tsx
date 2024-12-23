import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  delay?: string;
}

export const MetricCard = ({ title, value, delay = "0ms" }: MetricCardProps) => {
  return (
    <Card className="p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: delay }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold">{value}</p>
    </Card>
  );
};