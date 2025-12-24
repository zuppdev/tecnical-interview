"use client";

import { useState, useMemo, useEffect } from "react";
import { Task, TaskStatus } from "@/lib/data";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { FilterBar, SortOption, ViewMode } from "@/components/FilterBar";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Navbar01 } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Search, CheckCircle2, Circle, Clock } from "lucide-react";
import { Kanban } from "@/components/Kanban";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isLoading, setIsLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleCreateTask();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [tasks, statusFilter, sortBy]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === editingTask.id ? updatedTask : task
            )
          );
        }
      } else {
        // Create new task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          const newTask = await response.json();
          setTasks((prevTasks) => [...prevTasks, newTask]);
        }
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (deletingTask) {
      try {
        const response = await fetch(`/api/tasks/${deletingTask.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletingTask.id));
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setDeletingTask(null);
      }
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskOrderChange = async (updatedTasks: Task[]) => {
    try {
      // Update local state immediately for smooth UX
      setTasks(updatedTasks);

      // Persist order changes to the backend
      const response = await fetch("/api/tasks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      if (!response.ok) {
        // If the API call fails, revert to the original tasks
        console.error("Error updating task order");
        fetchTasks(); // Refetch to get the correct state
      }
    } catch (error) {
      console.error("Error updating task order:", error);
      fetchTasks(); // Refetch to get the correct state
    }
  };

  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar01
        logo={<ClipboardList className="h-6 w-6" />}
        navigationLinks={[
          { href: "#", label: "Tasks", active: true },
          { href: "#", label: "Calendar" },
          { href: "#", label: "Analytics" },
        ]}
        signInText="Sign In"
        ctaText="Add Task"
        onCtaClick={handleCreateTask}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="relative flex-1 justify-start text-sm text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Search tasks...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-8 pt-6">
        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-75">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">Total Tasks</p>
              <p className="text-2xl font-bold mt-1 transition-all duration-300">{taskCounts.total}</p>
            </CardContent>
          </Card>
          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-150">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">To Do</p>
              <p className="text-2xl font-bold text-muted-foreground mt-1 transition-all duration-300">{taskCounts.todo}</p>
            </CardContent>
          </Card>
          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-200">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">In Progress</p>
              <p className="text-2xl font-bold text-primary mt-1 transition-all duration-300">{taskCounts.inProgress}</p>
            </CardContent>
          </Card>
          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-300">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1 transition-all duration-300">{taskCounts.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Sort Bar */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateTask={handleCreateTask}
        />

        {/* Task List or Kanban View */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
              <h3 className="mt-4 text-lg font-medium">Loading tasks...</h3>
            </CardContent>
          </Card>
        ) : filteredAndSortedTasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {statusFilter === "all"
                  ? "Get started by creating your first task"
                  : `No tasks with status: ${statusFilter}`}
              </p>
              {statusFilter === "all" && (
                <Button onClick={handleCreateTask} className="mt-6">
                  Create Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "kanban" ? (
          <Kanban
            tasks={filteredAndSortedTasks}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskClick={handleEditTask}
            onTaskOrderChange={handleTaskOrderChange}
          />
        ) : (
          <div className="space-y-4" role="list" aria-label="Task list">
            {filteredAndSortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={!!deletingTask}
        task={deletingTask}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Command Palette for Search */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search tasks..." />
        <CommandList>
          <CommandEmpty>No tasks found.</CommandEmpty>
          <CommandGroup heading="Tasks">
            {tasks.map((task) => {
              const statusIcons = {
                todo: <Circle className="h-4 w-4" />,
                "in-progress": <Clock className="h-4 w-4" />,
                completed: <CheckCircle2 className="h-4 w-4" />,
              };
              return (
                <CommandItem
                  key={task.id}
                  value={`${task.title} ${task.description || ""}`}
                  onSelect={() => {
                    handleEditTask(task);
                    setSearchOpen(false);
                  }}
                >
                  {statusIcons[task.status]}
                  <span className="flex-1">{task.title}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {task.priority}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                handleCreateTask();
                setSearchOpen(false);
              }}
            >
              <ClipboardList className="h-4 w-4" />
              <span>Create New Task</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </main>
  );
}
