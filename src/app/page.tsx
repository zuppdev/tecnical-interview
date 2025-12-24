import { mockTasks } from "@/lib/data";

/**
 * ============================================================================
 * TASK MANAGEMENT DASHBOARD
 * ============================================================================
 *
 * Welcome! This is your starting point.
 *
 * Your task is to build a Task Management Dashboard. Please read the README.md
 * file for complete instructions and requirements.
 *
 * The mock data is available in @/lib/data.ts - feel free to explore it first.
 *
 * Good luck! 🚀
 * ============================================================================
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Task Management Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome! Start building your task dashboard here.
          </p>
        </header>

        {/* Placeholder - Replace this with your implementation */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Start Building!
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Check out the README.md for task requirements and the mock data in
              @/lib/data.ts
            </p>

            {/* Quick reference: showing the mock data structure */}
            <div className="mt-6 text-left">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Sample Task Data ({mockTasks.length} tasks available):
              </p>
              <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-xs text-gray-700">
                {JSON.stringify(mockTasks[0], null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-blue-900">
            💡 Getting Started Tips
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-blue-800">
            <li>
              • Create your components in the{" "}
              <code className="rounded bg-blue-100 px-1">src/components</code>{" "}
              folder
            </li>
            <li>
              • Use the types defined in{" "}
              <code className="rounded bg-blue-100 px-1">@/lib/data.ts</code> or
              create your own
            </li>
            <li>
              • Consider using React&apos;s useState for local state management
            </li>
            <li>
              • Tailwind CSS is already configured - check the docs at
              tailwindcss.com
            </li>
            <li>• Delete this placeholder section when you start building!</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
