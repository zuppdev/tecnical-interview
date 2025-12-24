import { NextRequest, NextResponse } from "next/server";
import { dbOperations } from "@/lib/db";
import { Task } from "@/lib/data";

// PUT /api/tasks/reorder - Update task order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks } = body;

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "Invalid tasks data" },
        { status: 400 }
      );
    }

    // Update the order of all tasks
    dbOperations.updateTasksOrder(tasks as Task[]);

    // Return the updated tasks
    const updatedTasks = dbOperations.getAllTasks();
    return NextResponse.json(updatedTasks);
  } catch (error) {
    console.error("Error updating task order:", error);
    return NextResponse.json(
      { error: "Failed to update task order" },
      { status: 500 }
    );
  }
}
