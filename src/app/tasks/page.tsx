"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Task, TaskStatus } from "@/lib/data";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { FilterBar, SortOption, ViewMode } from "@/components/FilterBar";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
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
import { Navbar01 } from "@/components/ui/navbar";

export default function Tasks() {
  const router = useRouter();
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isLoading, setIsLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

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

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

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
      setTasks(updatedTasks);

      const response = await fetch("/api/tasks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      if (!response.ok) {
        console.error("Error updating task order");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task order:", error);
      fetchTasks();
    }
  };

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard", onClick: () => router.push("/dashboard") },
    { href: "/tasks", label: "Tasks", active: pathname === "/tasks", onClick: () => router.push("/tasks") },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar01
        logo={<ClipboardList className="h-6 w-6" />}
        navigationLinks={navigationLinks}
        signInText="Sign In"
        ctaText="Add Task"
        onCtaClick={handleCreateTask}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your tasks
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex gap-2 mb-6">
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
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-8">
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateTask={handleCreateTask}
        />

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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <DeleteConfirmation
        isOpen={!!deletingTask}
        task={deletingTask}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

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
