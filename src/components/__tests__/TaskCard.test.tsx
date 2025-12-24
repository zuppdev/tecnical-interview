import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../TaskCard';
import { Task } from '@/lib/data';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
  dueDate: new Date('2025-12-31').toISOString(),
  createdAt: new Date('2025-01-01').toISOString(),
  order: 0,
};

describe('TaskCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText(/high priority/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByLabelText(`Edit task: ${mockTask.title}`);
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText(`Delete task: ${mockTask.title}`);
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('shows overdue indicator for overdue tasks', () => {
    const overdueTask: Task = {
      ...mockTask,
      dueDate: new Date('2020-01-01').toISOString(),
    };

    render(
      <TaskCard
        task={overdueTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Overdue!/i)).toBeInTheDocument();
  });

  it('renders without description', () => {
    const taskWithoutDescription: Task = {
      ...mockTask,
      description: '',
    };

    render(
      <TaskCard
        task={taskWithoutDescription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('displays correct priority styling', () => {
    const { rerender } = render(
      <TaskCard
        task={{ ...mockTask, priority: 'low' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText(/low priority/i)).toBeInTheDocument();

    rerender(
      <TaskCard
        task={{ ...mockTask, priority: 'medium' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText(/medium priority/i)).toBeInTheDocument();

    rerender(
      <TaskCard
        task={{ ...mockTask, priority: 'high' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText(/high priority/i)).toBeInTheDocument();
  });

  it('displays correct status badges', () => {
    const { rerender } = render(
      <TaskCard
        task={{ ...mockTask, status: 'todo' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();

    rerender(
      <TaskCard
        task={{ ...mockTask, status: 'in-progress' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    rerender(
      <TaskCard
        task={{ ...mockTask, status: 'completed' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
