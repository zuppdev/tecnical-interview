import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

describe('ThemeToggle', () => {
  const renderWithThemeProvider = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  it('renders theme toggle button', () => {
    renderWithThemeProvider();

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    renderWithThemeProvider();

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('allows selecting light theme', async () => {
    const user = userEvent.setup();
    renderWithThemeProvider();

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    const lightOption = screen.getByText('Light');
    await user.click(lightOption);

    // The menu should close after selection
    expect(screen.queryByText('Light')).not.toBeInTheDocument();
  });

  it('allows selecting dark theme', async () => {
    const user = userEvent.setup();
    renderWithThemeProvider();

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    const darkOption = screen.getByText('Dark');
    await user.click(darkOption);

    // The menu should close after selection
    expect(screen.queryByText('Dark')).not.toBeInTheDocument();
  });

  it('allows selecting system theme', async () => {
    const user = userEvent.setup();
    renderWithThemeProvider();

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    const systemOption = screen.getByText('System');
    await user.click(systemOption);

    // The menu should close after selection
    expect(screen.queryByText('System')).not.toBeInTheDocument();
  });
});
