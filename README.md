# Full Stack Developer Take-Home Task

## 📋 Overview

Welcome to our technical assessment! This task is designed to evaluate your skills in:

- **React/Next.js** development
- **TypeScript** proficiency
- **UI/UX design** sensibility with Tailwind CSS
- **Code organization** and architecture
- **Problem-solving** approach

**Estimated time:** 2-3 hours

---

## 🎯 The Task: Build a Task Management Dashboard

You will build a simple **Task Management Dashboard** where users can view, create, edit, and delete tasks. The application should demonstrate your ability to create clean, maintainable code with a polished user interface.

---

## ✅ Requirements

### Core Features (Required)

1. **Task List View**
   - Display a list of tasks from the provided mock data
   - Each task should show: title, description, status, priority, and due date
   - Implement visual distinction between different statuses (todo, in-progress, completed)
   - Implement visual distinction between priorities (low, medium, high)

2. **Create Task**
   - A form/modal to create a new task
   - Include validation (title is required, due date must be in the future)
   - The new task should appear in the list immediately

3. **Edit Task**
   - Ability to edit an existing task
   - Pre-populate the form with existing data

4. **Delete Task**
   - Ability to delete a task
   - Include a confirmation step before deletion

5. **Filter & Sort**
   - Filter tasks by status
   - Sort tasks by due date or priority

### UI/UX Requirements

- Clean, modern, and responsive design
- Intuitive user experience
- Proper loading and error states
- Smooth transitions/animations where appropriate
- Accessible (keyboard navigation, proper ARIA labels)

---

## 📁 Project Structure

We've provided a starter template with:

```
src/
├── app/
│   ├── page.tsx          # Main page (start here)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # Create your components here
├── lib/
│   └── data.ts           # Mock data and types
├── hooks/                # Custom hooks (if needed)
└── types/                # TypeScript types (if needed)
```

---

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 💡 Bonus Points (Optional)

If you have extra time and want to showcase more skills:

- [ ] Persist data to localStorage
- [ ] Add drag-and-drop to reorder tasks or change status
- [ ] Add a Kanban board view (alternative to list view)
- [ ] Add search functionality
- [ ] Add dark mode toggle
- [ ] Write unit tests for key components
- [ ] Add keyboard shortcuts

---

## 📤 Submission

When you're done:

1. Make sure all features work correctly
2. Clean up any console errors or warnings
3. Ensure the app runs with `npm run dev`
4. Share your solution (zip file or git repository)

Include a brief note about:
- Any assumptions you made
- Trade-offs or decisions you'd like to explain
- What you would improve with more time

---

## 🎨 What I Built (Submission Notes)

Hey! Here's a breakdown of what I managed to accomplish:

### ✅ What I Achieved

**Core Features (All Implemented)**
- ✅ **Task List View** - Full CRUD operations (create, read, update, delete)
- ✅ **Visual Status & Priority** - Color-coded badges and indicators
- ✅ **Task Form with Validation** - Title required, future date validation
- ✅ **Delete Confirmation** - Dialog to prevent accidental deletions
- ✅ **Filtering & Sorting** - Filter by status, sort by due date/priority/created date

**Bonus Features (Went a bit extra)**
- ✅ **SQLite Database** - Real persistence using better-sqlite3 instead of localStorage
- ✅ **Kanban Board View** - Full drag-and-drop between columns with @dnd-kit
- ✅ **Dashboard Page** - Analytics with multiple chart types (pie, bar, area, radar, radial)
- ✅ **Search Functionality** - Command palette (⌘K) to quickly find tasks
- ✅ **Dark Mode** - Full theme support with system preference detection
- ✅ **Unit Tests** - Test coverage for key components (FilterBar, TaskCard, ThemeToggle, DeleteConfirmation)
- ✅ **Keyboard Shortcuts** - ⌘K for search, ⌘N for new task
- ✅ **Modern UI Components** - Built with shadcn/ui and Radix primitives
- ✅ **Responsive Design** - Works smoothly on mobile/tablet/desktop
- ✅ **Animations** - Smooth transitions and staggered fade-ins
- ✅ **REST API Routes** - Proper Next.js API routes with error handling

### 🤔 Assumptions I Made

1. **Real Database Over localStorage**: Went with SQLite because it felt more production-like and demonstrates backend integration. The assignment mentioned localStorage but I figured showing API/DB skills wouldn't hurt.

2. **Dashboard Was In Scope**: I interpreted "task management dashboard" broadly and added an analytics page. If this was overstepping, happy to remove it - but it showcases data visualization skills.

3. **Drag-and-Drop = Better UX**: The Kanban board makes status changes feel more natural than dropdown menus, especially for power users.

4. **Keyboard Shortcuts Matter**: Added shortcuts because they significantly improve workflow for frequent users.

### ⚖️ Trade-offs & Decisions

**Why SQLite instead of localStorage?**
- **Pro**: More realistic, shows backend skills, easier to query/filter
- **Con**: Requires file system access, slightly more complex setup
- **Decision**: Went with SQLite but kept it simple - no complex migrations or relationships

**Why Both List and Kanban Views?**
- **Pro**: Different users prefer different views; demonstrates component reusability
- **Con**: More code to maintain, slightly slower initial load
- **Decision**: Made it toggleable so users choose what works for them

**Shadcn/UI Component Library**
- **Pro**: Accessible, customizable, modern design system
- **Con**: Larger bundle size than vanilla Tailwind
- **Decision**: Worth it for accessibility and polish - these components handle focus management, ARIA labels, keyboard nav automatically

**Chart Library Choice (Recharts)**
- **Pro**: React-native, composable, good TypeScript support
- **Con**: Adds ~100kb to bundle
- **Decision**: Dashboard is optional/lazy-loaded, so impact is minimal

### 🚀 What I'd Improve With More Time

**Performance Optimizations**
- Add React Query for caching and optimistic updates
- Implement virtual scrolling for large task lists
- Code-split the dashboard and Kanban to reduce initial bundle

**Testing Coverage**
- Integration tests for the full task lifecycle
- E2E tests with Playwright
- API route testing
- Accessibility testing with jest-axe

**Features I'd Add**
- Task tags/labels for better organization
- Recurring tasks (daily/weekly/monthly)
- Task attachments/comments
- Collaboration features (assign to team members)
- Email/push notifications for due dates
- Export to CSV/JSON
- Undo/redo functionality
- Bulk operations (mark multiple as complete, delete, etc.)

**UX Improvements**
- Loading skeletons instead of spinners
- Better mobile Kanban experience (horizontal scroll?)
- Customizable columns in list view
- Saved filter presets
- Keyboard-only navigation mode

**Technical Debt**
- Better error boundaries and error handling
- Proper logging/monitoring setup
- Database migrations system
- Rate limiting on API routes
- Input sanitization/XSS prevention
- CSRF protection

**Code Quality**
- More granular component breakdown
- Better TypeScript strict mode compliance
- Consistent error messaging
- More comprehensive JSDoc comments

### 📊 Tech Stack Summary

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Database**: SQLite (better-sqlite3)
- **Drag-and-Drop**: @dnd-kit
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library
- **Date Handling**: date-fns

### ⏱️ Time Spent

Roughly 3-4 hours total:
- Initial setup & core CRUD: ~1.5 hours
- Kanban board implementation: ~1 hour
- Dashboard with charts: ~1 hour
- Testing & polish: ~30 mins

### 💭 Final Thoughts

I had a blast building this! Tried to balance between showcasing technical skills and keeping things practical. The core requirements are 100% there - the bonus features just show what I'd do if this were a real product.

If anything seems over-engineered or if you wanted me to focus on different aspects, I'm happy to discuss the approach. Thanks for the opportunity!

---

## ❓ Questions?

If you have any questions about the task, please reach out. We're happy to clarify any requirements.

Good luck! We're excited to see what you build. 🎉
