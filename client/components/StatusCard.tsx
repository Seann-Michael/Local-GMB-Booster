import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: any;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label: string;
  };
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  actionLabel?: string;
  onAction?: () => void;
  helpText?: string;
  className?: string;
}

export function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = "neutral",
  actionLabel,
  onAction,
  helpText,
  className,
}: StatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50/50";
      case "warning":
        return "border-yellow-200 bg-yellow-50/50";
      case "danger":
        return "border-red-200 bg-red-50/50";
      case "info":
        return "border-blue-200 bg-blue-50/50";
      default:
        return "";
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case "up":
        return "text-green-600 bg-green-100";
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`${getStatusColor()} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {getStatusIcon()}
        </div>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>

          {(subtitle || trend) && (
            <div className="flex items-center justify-between">
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}

              {trend && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTrendColor()}`}
                >
                  {getTrendIcon()}
                  <span>
                    {trend.direction === "up"
                      ? "+"
                      : trend.direction === "down"
                        ? "-"
                        : ""}
                    {Math.abs(trend.value)}
                    {trend.value.toString().includes("%") ? "" : "%"}
                  </span>
                  <span className="text-muted-foreground">{trend.label}</span>
                </div>
              )}
            </div>
          )}

          {actionLabel && onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className="w-full mt-3 h-8 text-xs"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Preset status cards for common use cases
export function ProjectStatusCard({
  totalProjects,
  activeProjects,
  completedThisMonth,
  onViewProjects,
}: {
  totalProjects: number;
  activeProjects: number;
  completedThisMonth: number;
  onViewProjects?: () => void;
}) {
  return (
    <StatusCard
      title="Active Projects"
      value={activeProjects}
      subtitle={`${totalProjects} total projects`}
      icon={Activity}
      trend={{
        value: completedThisMonth,
        direction: "up",
        label: "completed this month",
      }}
      status="info"
      actionLabel="View All Projects"
      onAction={onViewProjects}
      helpText="Projects currently in progress and requiring attention"
    />
  );
}

export function RevenueStatusCard({
  totalRevenue,
  monthlyGrowth,
  target,
  onViewRevenue,
}: {
  totalRevenue: number;
  monthlyGrowth: number;
  target?: number;
  onViewRevenue?: () => void;
}) {
  const status =
    monthlyGrowth > 0 ? "success" : monthlyGrowth < 0 ? "warning" : "neutral";

  return (
    <StatusCard
      title="Total Revenue"
      value={`$${totalRevenue.toLocaleString()}`}
      subtitle={target ? `Target: $${target.toLocaleString()}` : undefined}
      icon={DollarSign}
      trend={{
        value: Math.abs(monthlyGrowth),
        direction:
          monthlyGrowth > 0 ? "up" : monthlyGrowth < 0 ? "down" : "neutral",
        label: "vs last month",
      }}
      status={status}
      actionLabel="View Revenue Details"
      onAction={onViewRevenue}
      helpText="Total revenue from completed projects"
    />
  );
}

export function LeadStatusCard({
  totalLeads,
  qualifiedLeads,
  conversionRate,
  onViewLeads,
}: {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  onViewLeads?: () => void;
}) {
  const status =
    conversionRate > 20 ? "success" : conversionRate > 10 ? "info" : "warning";

  return (
    <StatusCard
      title="Active Leads"
      value={totalLeads}
      subtitle={`${qualifiedLeads} qualified leads`}
      icon={Users}
      trend={{
        value: conversionRate,
        direction: conversionRate > 15 ? "up" : "neutral",
        label: "conversion rate",
      }}
      status={status}
      actionLabel="Manage Leads"
      onAction={onViewLeads}
      helpText="Leads in your sales pipeline requiring follow-up"
    />
  );
}

export function TaskStatusCard({
  overdueTasks,
  todayTasks,
  totalTasks,
  onViewTasks,
}: {
  overdueTasks: number;
  todayTasks: number;
  totalTasks: number;
  onViewTasks?: () => void;
}) {
  const status =
    overdueTasks > 0 ? "danger" : todayTasks > 0 ? "warning" : "success";

  return (
    <StatusCard
      title="Tasks & Deadlines"
      value={
        overdueTasks > 0 ? `${overdueTasks} overdue` : `${todayTasks} due today`
      }
      subtitle={`${totalTasks} total active tasks`}
      icon={Clock}
      status={status}
      actionLabel="View Tasks"
      onAction={onViewTasks}
      helpText="Tasks and deadlines requiring your attention"
    />
  );
}
