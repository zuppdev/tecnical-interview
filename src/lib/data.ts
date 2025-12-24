// =============================================================================
// TYPES - You may move these to a separate types file if you prefer
// =============================================================================

export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  order: number; // Order within the column
}

// =============================================================================
// MOCK DATA - Use this as your initial data source
// =============================================================================

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description:
      "Create wireframes and high-fidelity mockups for the new marketing landing page. Include mobile and desktop versions.",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-01-15",
    createdAt: "2024-12-20",
    order: 0,
  },
  {
    id: "2",
    title: "Set up CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment to staging environment.",
    status: "todo",
    priority: "high",
    dueDate: "2025-01-10",
    createdAt: "2024-12-18",
    order: 0,
  },
  {
    id: "3",
    title: "Write API documentation",
    description:
      "Document all REST API endpoints using OpenAPI/Swagger specification.",
    status: "todo",
    priority: "medium",
    dueDate: "2025-01-20",
    createdAt: "2024-12-19",
    order: 1,
  },
  {
    id: "4",
    title: "Fix navigation bug on mobile",
    description:
      "The hamburger menu doesn't close after selecting a menu item on iOS devices.",
    status: "completed",
    priority: "medium",
    dueDate: "2024-12-22",
    createdAt: "2024-12-15",
    order: 0,
  },
  {
    id: "5",
    title: "Implement user authentication",
    description:
      "Add login, registration, and password reset functionality using NextAuth.js.",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-01-05",
    createdAt: "2024-12-10",
    order: 1,
  },
  {
    id: "6",
    title: "Optimize database queries",
    description:
      "Review and optimize slow database queries identified in the performance audit.",
    status: "todo",
    priority: "low",
    dueDate: "2025-02-01",
    createdAt: "2024-12-21",
    order: 2,
  },
  {
    id: "7",
    title: "Update dependencies",
    description:
      "Update all npm packages to their latest stable versions and fix any breaking changes.",
    status: "completed",
    priority: "low",
    dueDate: "2024-12-20",
    createdAt: "2024-12-12",
    order: 1,
  },
  {
    id: "8",
    title: "Create onboarding flow",
    description:
      "Design and implement a step-by-step onboarding experience for new users.",
    status: "todo",
    priority: "medium",
    dueDate: "2025-01-25",
    createdAt: "2024-12-22",
    order: 3,
  },
];

// =============================================================================
// HELPER FUNCTIONS - Feel free to use or modify these
// =============================================================================

/**
 * Generate a unique ID for new tasks
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  return dueDate < today;
}

/**
 * Get the number of days until a due date
 */
export function getDaysUntilDue(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

