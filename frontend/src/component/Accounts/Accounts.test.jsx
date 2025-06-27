// src/components/Accounts/Accounts.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Accounts from './Accounts';
import * as api from '../../api/accounts.api';

// Mock AccountCard
vi.mock('./AccountCard', () => ({
  default: ({ data }) => <div>{data.name}</div>,
}));

describe('Accounts Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const renderWithClient = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it('renders loading skeleton when loading', async () => {
    vi.spyOn(api, 'fetchAccounts').mockImplementation(() => {
      return new Promise(() => {}); // Keeps it pending
    });

    renderWithClient(<Accounts />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders account cards when data is returned', async () => {
    const mockData = [{ id: '1', name: 'Travel Fund' }, { id: '2', name: 'Emergency' }];
    vi.spyOn(api, 'fetchAccounts').mockResolvedValue(mockData);

    renderWithClient(<Accounts />);

    await waitFor(() => {
      expect(screen.getByText('Travel Fund')).toBeInTheDocument();
      expect(screen.getByText('Emergency')).toBeInTheDocument();
    });
  });

  it('renders "No accounts found" when empty data is returned', async () => {
    vi.spyOn(api, 'fetchAccounts').mockResolvedValue([]);

    renderWithClient(<Accounts />);

    await waitFor(() => {
      expect(screen.getByText('No accounts found')).toBeInTheDocument();
    });
  });
});
