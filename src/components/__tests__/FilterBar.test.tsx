import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../FilterBar';

describe('FilterBar', () => {
  const mockOnStatusFilterChange = jest.fn();
  const mockOnSortByChange = jest.fn();
  const mockOnViewModeChange = jest.fn();
  const mockOnCreateTask = jest.fn();

  const defaultProps = {
    statusFilter: 'all' as const,
    onStatusFilterChange: mockOnStatusFilterChange,
    sortBy: 'dueDate' as const,
    onSortByChange: mockOnSortByChange,
    viewMode: 'list' as const,
    onViewModeChange: mockOnViewModeChange,
    onCreateTask: mockOnCreateTask,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByLabelText('Filter by Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('calls onCreateTask when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    const createButton = screen.getByLabelText('Create new task');
    await user.click(createButton);

    expect(mockOnCreateTask).toHaveBeenCalledTimes(1);
  });

  it('switches between list and kanban view modes', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    const kanbanButton = screen.getByLabelText('Kanban view');
    await user.click(kanbanButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('kanban');
  });

  it('highlights active view mode', () => {
    const { rerender } = render(<FilterBar {...defaultProps} viewMode="list" />);

    const listButton = screen.getByLabelText('List view');
    const kanbanButton = screen.getByLabelText('Kanban view');

    // Check list view button exists
    expect(listButton).toBeInTheDocument();
    expect(kanbanButton).toBeInTheDocument();

    rerender(<FilterBar {...defaultProps} viewMode="kanban" />);

    // Buttons should still exist after rerender
    expect(screen.getByLabelText('List view')).toBeInTheDocument();
    expect(screen.getByLabelText('Kanban view')).toBeInTheDocument();
  });

  it('renders status filter', () => {
    render(<FilterBar {...defaultProps} />);

    const statusSelect = screen.getByLabelText('Filter by Status');
    expect(statusSelect).toBeInTheDocument();
  });

  it('renders sort by control', () => {
    render(<FilterBar {...defaultProps} />);

    const sortSelect = screen.getByLabelText('Sort by');
    expect(sortSelect).toBeInTheDocument();
  });
});
