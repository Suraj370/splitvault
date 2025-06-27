import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AllocateFunds from './AllocateFunds';

// Mock API
vi.mock('../../../api/subaccounts.api', () => ({
  allocateSubAccount: vi.fn(),
}));

// Mock React Query Mutation
import { allocateSubAccount } from '../../../api/subaccounts.api';

describe('AllocateFunds Component', () => {
  const mockOnClose = vi.fn();
  const account = { id: 'test-account-id' };

  const renderComponent = () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AllocateFunds account={account} onClose={mockOnClose} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with form inputs and buttons', () => {
    renderComponent();

    expect(screen.getByText('Allocate Funds')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Allocate')).toBeInTheDocument();
  });

  it('does not submit the form with invalid amount', async () => {
    renderComponent();

    const allocateButton = screen.getByText('Allocate');
    await userEvent.click(allocateButton);

    expect(allocateSubAccount).not.toHaveBeenCalled();
  });

  it('submits the form with valid data and calls API', async () => {
    const mutateFn = vi.fn();
    allocateSubAccount.mockImplementation(mutateFn);

    renderComponent();

    const amountInput = screen.getByLabelText('Amount');
    const descInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Allocate');

    await userEvent.type(amountInput, '150');
    await userEvent.type(descInput, 'Test allocation');

    await userEvent.click(submitButton);

    expect(allocateSubAccount).toHaveBeenCalledWith({
      accountId: 'test-account-id',
      amount: 150,
      description: 'Test allocation',
    });
  });

  it('calls onClose when Cancel button is clicked', async () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
