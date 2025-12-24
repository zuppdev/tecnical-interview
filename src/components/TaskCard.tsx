import { Task } from "@/lib/data";
import { formatDate, isOverdue, getDaysUntilDue } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusVariants = {
  "todo": "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  "completed": "bg-green-500/10 text-green-700 border-green-500/20",
};

const priorityCardVariants = {
  "low": "border-l-4 border-l-muted",
  "medium": "border-l-4 border-l-yellow-500",
  "high": "border-l-4 border-l-destructive",
};

const priorityBadgeVariants = {
  "low": "bg-muted text-muted-foreground",
  "medium": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  "high": "bg-destructive/10 text-destructive border-destructive/20",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== "completed";
  const daysUntil = getDaysUntilDue(task.dueDate);

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
        priorityCardVariants[task.priority]
      )}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-lg font-semibold truncate">
                {task.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(priorityBadgeVariants[task.priority])}
              >
                {task.priority}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap text-sm">
              <Badge
                variant="outline"
                className={cn("border transition-all duration-200", statusVariants[task.status])}
              >
                {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>

              <span className={cn("text-xs", overdue ? "text-destructive font-semibold" : "text-muted-foreground")}>
                Due: {formatDate(task.dueDate)}
                {overdue && " (Overdue)"}
                {!overdue && task.status !== "completed" && daysUntil >= 0 && (
                  <span className="ml-1">({daysUntil} {daysUntil === 1 ? "day" : "days"})</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              onClick={() => onEdit(task)}
              variant="ghost"
              size="icon"
              aria-label={`Edit task: ${task.title}`}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(task)}
              variant="ghost"
              size="icon"
              aria-label={`Delete task: ${task.title}`}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
