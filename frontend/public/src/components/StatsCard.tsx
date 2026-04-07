import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, description, icon: Icon, trend }: StatsCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`font-medium ${
                trend.isPositive ? "text-accent" : "text-destructive"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
