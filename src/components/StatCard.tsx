import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change?: string;
  colorClass: string;
}

const StatCard = ({ icon, label, value, change, colorClass }: StatCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 hover:shadow-elevated transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          {change && (
            <p className="text-xs text-medical-green mt-1">↑ {change}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
