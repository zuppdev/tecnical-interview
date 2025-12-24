import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmation } from '../DeleteConfirmation';
import { Task } from '@/lib/data';

const mockTask: Task = {
  id: '1',
  title: 'Test Task to Delete',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
  dueDate: new Date('2025-12-31').toISOString(),
  createdAt: new Date('2025-01-01').toISOString(),
  order: 0,
};

describe('DeleteConfirmation', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when task is null', () => {
    const { container } = render(
      <DeleteConfirmation
        isOpen={true}
        task={null}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders confirmation dialog when open', () => {
    render(
      <DeleteConfirmation
        isOpen={true}
        task={mockTask}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmation
        isOpen={true}
        task={mockTask}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmation
        isOpen={true}
        task={mockTask}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(
      <DeleteConfirmation
        isOpen={false}
        task={mockTask}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });

  it('displays the correct task title in confirmation message', () => {
    const customTask: Task = {
      ...mockTask,
      title: 'Custom Task Name',
    };

    render(
      <DeleteConfirmation
        isOpen={true}
        task={customTask}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Custom Task Name')).toBeInTheDocument();
  });
});
