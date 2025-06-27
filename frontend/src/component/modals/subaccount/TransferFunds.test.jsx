import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransferFunds from "./TransferFunds";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock useMutation
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

const mockMutate = vi.fn();
const mockOnClose = vi.fn();

import { useMutation } from "@tanstack/react-query";
useMutation.mockReturnValue({
  mutate: mockMutate,
  isPending: false,
});

const renderWithClient = (ui) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const account = {
  id: "sub123",
  name: "Emergency Fund",
};

const subAccounts = [
  { id: "sub123", name: "Emergency Fund" },
  { id: "sub456", name: "Vacation Fund" },
];

describe("TransferFunds Modal", () => {
  beforeEach(() => {
    mockMutate.mockReset();
    mockOnClose.mockReset();
  });

  it("renders correctly with form fields", () => {
    renderWithClient(
      <TransferFunds
        account={account}
        subAccounts={subAccounts}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Transfer from: Emergency Fund/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To Sub-Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Transfer Funds/i)).toBeInTheDocument();
  });

  it("submits form with correct payload", async () => {
    renderWithClient(
      <TransferFunds
        account={account}
        subAccounts={subAccounts}
        onClose={mockOnClose}
      />
    );

    fireEvent.change(screen.getByLabelText(/To Sub-Account/i), {
      target: { value: "sub456" },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: "2500" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Monthly transfer" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Transfer Funds/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        accountId: "sub123",
        toAccountId: "sub456",
        amount: 2500,
        description: "Monthly transfer",
      });
    });
  });

  it("does not submit if required fields are missing", async () => {
    renderWithClient(
      <TransferFunds
        account={account}
        subAccounts={subAccounts}
        onClose={mockOnClose}
      />
    );

    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Transfer Funds/i }));

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
