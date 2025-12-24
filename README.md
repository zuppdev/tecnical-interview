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

## 📝 Evaluation Criteria

We will evaluate your submission based on:

| Criteria | Weight |
|----------|--------|
| **Code Quality** - Clean, readable, well-organized code | 25% |
| **TypeScript Usage** - Proper typing, interfaces, type safety | 20% |
| **UI/UX Design** - Visual appeal, user experience, responsiveness | 25% |
| **Functionality** - All features work correctly | 20% |
| **Best Practices** - Component structure, state management, accessibility | 10% |

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

## ❓ Questions?

If you have any questions about the task, please reach out. We're happy to clarify any requirements.

Good luck! We're excited to see what you build. 🎉
