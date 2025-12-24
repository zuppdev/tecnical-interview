import { TaskStatus } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, LayoutList, LayoutGrid } from "lucide-react";

export type SortOption = "dueDate" | "priority" | "createdAt";
export type ViewMode = "list" | "kanban";

interface FilterBarProps {
  statusFilter: TaskStatus | "all";
  onStatusFilterChange: (status: TaskStatus | "all") => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateTask: () => void;
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onCreateTask,
}: FilterBarProps) {
  return (
    <Card className="p-4 mb-6 animate-in fade-in-50 slide-in-from-top-2 duration-300 delay-150">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full md:w-auto">
          <div className="flex-1 sm:flex-initial space-y-2">
            <Label htmlFor="status-filter">Filter by Status</Label>
            <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as TaskStatus | "all")}>
              <SelectTrigger id="status-filter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 sm:flex-initial space-y-2">
            <Label htmlFor="sort-by">Sort by</Label>
            <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortOption)}>
              <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 sm:flex-initial space-y-2">
            <Label htmlFor="view-mode">View</Label>
            <div className="flex gap-2">
              <Button
                id="view-mode"
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("list")}
                aria-label="List view"
                className="transition-all hover:scale-105 active:scale-95"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("kanban")}
                aria-label="Kanban view"
                className="transition-all hover:scale-105 active:scale-95"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={onCreateTask}
          className="w-full md:w-auto md:mt-8 transition-all hover:scale-105 active:scale-95"
          aria-label="Create new task"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Create Task
        </Button>
      </div>
    </Card>
  );
}
