import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "total" | "used" | "unused";
}

const StatsCard = ({ title, value, icon: Icon, variant }: StatsCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "total":
        return "purple-glow border-2";
      case "used":
        return "green-glow border-2";
      case "unused":
        return "red-glow border-2";
      default:
        return "ghost-glow border-2";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "total":
        return "text-accent";
      case "used":
        return "text-success";
      case "unused":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`${getVariantClasses()} transition-all duration-300 hover:scale-105`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;