import { Task } from "@/lib/data";
import { formatDate, isOverdue, getDaysUntilDue } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityConfig = {
  low: {
    badge: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
    accent: "border-l-slate-400",
    icon: Circle,
  },
  medium: {
    badge: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
    accent: "border-l-amber-500",
    icon: AlertCircle,
  },
  high: {
    badge: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
    accent: "border-l-rose-500",
    icon: AlertCircle,
  },
};

const statusConfig = {
  "todo": {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Circle,
    label: "To Do",
  },
  "in-progress": {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    icon: PlayCircle,
    label: "In Progress",
  },
  "completed": {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "Completed",
  },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== "completed";
  const daysUntil = getDaysUntilDue(task.dueDate);

  const PriorityIcon = priorityConfig[task.priority].icon;
  const StatusIcon = statusConfig[task.status].icon;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.01]",
        "border-l-4",
        priorityConfig[task.priority].accent
      )}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <PriorityIcon className={cn(
                "h-4 w-4",
                task.priority === "high" && "text-rose-500",
                task.priority === "medium" && "text-amber-500",
                task.priority === "low" && "text-slate-400"
              )} />
              <CardTitle className="text-base font-semibold tracking-tight">
                {task.title}
              </CardTitle>
            </div>
            {task.description && (
              <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                {task.description}
              </CardDescription>
            )}
          </div>

          <CardAction>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                onClick={() => onEdit(task)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                aria-label={`Edit task: ${task.title}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => onDelete(task)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600"
                aria-label={`Delete task: ${task.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardAction>
        </div>
      </CardHeader>

      <Separator className="mx-6" />

      <CardFooter className="flex-wrap gap-2 pt-4">
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-0.5 font-medium transition-colors",
            statusConfig[task.status].badge
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {statusConfig[task.status].label}
        </Badge>

        <Badge
          variant="outline"
          className={cn(
            "px-2.5 py-0.5 font-medium capitalize transition-colors",
            priorityConfig[task.priority].badge
          )}
        >
          {task.priority} Priority
        </Badge>

        <div className="ml-auto flex items-center gap-1.5 text-xs">
          <Clock className={cn(
            "h-3.5 w-3.5",
            overdue ? "text-rose-500" : "text-muted-foreground"
          )} />
          <span className={cn(
            "font-medium",
            overdue ? "text-rose-600" : "text-muted-foreground"
          )}>
            {formatDate(task.dueDate)}
            {overdue && (
              <span className="ml-1 text-rose-600 font-semibold">
                (Overdue!)
              </span>
            )}
            {!overdue && task.status !== "completed" && daysUntil >= 0 && (
              <span className="ml-1 text-muted-foreground">
                ({daysUntil}d)
              </span>
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
