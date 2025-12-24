import Database from "better-sqlite3";
import path from "path";
import { Task, mockTasks } from "./data";

const dbPath = path.join(process.cwd(), "tasks.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create tables
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'completed')),
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
      dueDate TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0
    )
  `;

  db.exec(createTableSQL);

  // Check if we need to seed the database
  const count = db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number };

  if (count.count === 0) {
    // Seed with mock data
    const insert = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, dueDate, createdAt, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((tasks: Task[]) => {
      for (const task of tasks) {
        insert.run(
          task.id,
          task.title,
          task.description,
          task.status,
          task.priority,
          task.dueDate,
          task.createdAt,
          task.order
        );
      }
    });

    insertMany(mockTasks);
  }
}

// Initialize the database
initializeDatabase();

// Database operations
export const dbOperations = {
  // Get all tasks
  getAllTasks(): Task[] {
    const stmt = db.prepare("SELECT * FROM tasks ORDER BY status, \"order\", createdAt DESC");
    return stmt.all() as Task[];
  },

  // Get task by ID
  getTaskById(id: string): Task | undefined {
    const stmt = db.prepare("SELECT * FROM tasks WHERE id = ?");
    return stmt.get(id) as Task | undefined;
  },

  // Create task
  createTask(task: Task): Task {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, dueDate, createdAt, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate,
      task.createdAt,
      task.order || 0
    );

    return task;
  },

  // Update task
  updateTask(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): Task | undefined {
    const current = this.getTaskById(id);
    if (!current) return undefined;

    const updated = { ...current, ...updates };

    const stmt = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, "order" = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.title,
      updated.description,
      updated.status,
      updated.priority,
      updated.dueDate,
      updated.order,
      id
    );

    return updated;
  },

  // Delete task
  deleteTask(id: string): boolean {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Update multiple tasks (for reordering)
  updateTasksOrder(tasks: Task[]): void {
    const stmt = db.prepare(`
      UPDATE tasks
      SET "order" = ?, status = ?
      WHERE id = ?
    `);

    const updateMany = db.transaction((tasksToUpdate: Task[]) => {
      for (const task of tasksToUpdate) {
        stmt.run(task.order, task.status, task.id);
      }
    });

    updateMany(tasks);
  },
};

export default db;
