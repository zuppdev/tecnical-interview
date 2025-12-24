"use client";

import { useState, useMemo } from "react";
import { mockTasks, Task, TaskStatus, generateId } from "@/lib/data";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { FilterBar, SortOption } from "@/components/FilterBar";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Navbar01 } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");

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

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      // Update existing task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...taskData }
            : task
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDelete = () => {
    if (deletingTask) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletingTask.id));
      setDeletingTask(null);
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
      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-8 pt-6">
        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">Total Tasks</p>
              <p className="text-2xl font-bold mt-1">{taskCounts.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">To Do</p>
              <p className="text-2xl font-bold text-muted-foreground mt-1">{taskCounts.todo}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">In Progress</p>
              <p className="text-2xl font-bold text-primary mt-1">{taskCounts.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{taskCounts.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Sort Bar */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onCreateTask={handleCreateTask}
        />

        {/* Task List */}
        {filteredAndSortedTasks.length === 0 ? (
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
        ) : (
          <div className="space-y-4" role="list" aria-label="Task list">
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
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
    </main>
  );
}
