import { NextRequest, NextResponse } from "next/server";
import { dbOperations } from "@/lib/db";
import { Task, generateId, TaskStatus, TaskPriority } from "@/lib/data";

// GET /api/tasks - Get all tasks
export async function GET() {
  try {
    const tasks = dbOperations.getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    // Validation
    if (!title || !description || !status || !priority || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the max order for the status to add the new task at the end
    const allTasks = dbOperations.getAllTasks();
    const tasksInStatus = allTasks.filter(t => t.status === status);
    const maxOrder = tasksInStatus.length > 0
      ? Math.max(...tasksInStatus.map(t => t.order))
      : -1;

    const newTask: Task = {
      id: generateId(),
      title,
      description,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      dueDate,
      createdAt: new Date().toISOString().split("T")[0],
      order: maxOrder + 1,
    };

    const createdTask = dbOperations.createTask(newTask);
    return NextResponse.json(createdTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
