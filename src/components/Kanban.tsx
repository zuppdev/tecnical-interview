import { Task, TaskStatus } from "@/lib/data";
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  DragEndEvent,
} from "@/components/ui/shadcn-io/kanban";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flag } from "lucide-react";

interface KanbanProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

type KanbanColumn = {
  id: TaskStatus;
  name: string;
};

type KanbanTaskItem = Task & {
  column: TaskStatus;
};

const columns: KanbanColumn[] = [
  { id: "todo", name: "To Do" },
  { id: "in-progress", name: "In Progress" },
  { id: "completed", name: "Completed" },
];

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export function Kanban({ tasks, onTaskStatusChange, onTaskClick }: KanbanProps) {
  const kanbanData: KanbanTaskItem[] = tasks.map((task) => ({
    ...task,
    column: task.status,
  }));

  const handleDataChange = (newData: KanbanTaskItem[]) => {
    newData.forEach((item, index) => {
      const originalTask = tasks.find((t) => t.id === item.id);
      if (originalTask && originalTask.status !== item.column) {
        onTaskStatusChange(item.id, item.column);
      }
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTaskCount = (columnId: TaskStatus) => {
    return tasks.filter((task) => task.status === columnId).length;
  };

  return (
    <div className="h-[calc(100vh-20rem)] w-full">
      <KanbanProvider
        columns={columns}
        data={kanbanData}
        onDataChange={handleDataChange}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center justify-between">
                <span>{column.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {getTaskCount(column.id)}
                </Badge>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} id={item.id} name={item.name}>
                  <div
                    className="space-y-2 cursor-pointer"
                    onClick={() => onTaskClick(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      <div
                        className={`h-2 w-2 rounded-full ${priorityColors[item.priority]}`}
                        title={`${item.priority} priority`}
                      />
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        <span className="capitalize">{item.priority}</span>
                      </div>
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
