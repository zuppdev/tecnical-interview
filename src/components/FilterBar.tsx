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
import { Plus } from "lucide-react";

export type SortOption = "dueDate" | "priority" | "createdAt";

interface FilterBarProps {
  statusFilter: TaskStatus | "all";
  onStatusFilterChange: (status: TaskStatus | "all") => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onCreateTask: () => void;
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onCreateTask,
}: FilterBarProps) {
  return (
    <Card className="p-4 mb-6">
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
        </div>

        <Button
          onClick={onCreateTask}
          className="w-full md:w-auto md:mt-8"
          aria-label="Create new task"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>
    </Card>
  );
}
