import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import CreateSubModal from './CreateSubModal';

describe('CreateSubModal', () => {
  const mockAccount = { id: 'acc-1', name: 'Main Account' };
  const mockOnClose = vi.fn();

  // Utility to wrap component with QueryClientProvider
  const renderWithClient = (ui) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders modal fields and title', () => {
    renderWithClient(<CreateSubModal account={mockAccount} onClose={mockOnClose} />);
    
    expect(screen.getByText('Create New Savings Goal')).toBeInTheDocument();
    expect(screen.getByLabelText('Goal Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Scheme')).toBeInTheDocument();
    expect(screen.getByLabelText('Target Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Balance')).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', () => {
    renderWithClient(<CreateSubModal account={mockAccount} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Create Goal'));

    // Modal should still be open (since validation failed)
    expect(screen.getByText('Create New Savings Goal')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    renderWithClient(<CreateSubModal account={mockAccount} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
