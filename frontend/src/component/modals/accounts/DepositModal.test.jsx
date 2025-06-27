// components/__tests__/DepositModal.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DepositModal from "./DepositModal";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { depositAccount } from "../../../api/accounts.api";

// Mock API
vi.mock("../../../api/accounts.api", () => ({
  depositAccount: vi.fn(),
}));


const renderWithQuery = (ui) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("DepositModal", () => {
  const mockAccount = { id: "acc123", name: "Emergency Fund" };
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {}); 

  });

  it("renders the modal with account name", () => {
    renderWithQuery(<DepositModal account={mockAccount} onClose={mockOnClose} />);
    expect(screen.getByText(/Deposit to Emergency Fund/i)).toBeInTheDocument();
  });

  it("validates empty or invalid amount", async () => {
    renderWithQuery(<DepositModal account={mockAccount} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Confirm Deposit"));

    await waitFor(() => {
      expect(depositAccount).not.toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "-10" } });
    fireEvent.click(screen.getByText("Confirm Deposit"));

    await waitFor(() => {
      expect(depositAccount).not.toHaveBeenCalled();
    });
  });

  it("calls depositAccount with correct payload", async () => {
    depositAccount.mockImplementation(() => Promise.resolve());
    renderWithQuery(<DepositModal account={mockAccount} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "June Salary" } });

    fireEvent.click(screen.getByText("Confirm Deposit"));

    await waitFor(() => {
      expect(depositAccount).toHaveBeenCalledWith({
        accountId: "acc123",
        amount: 500,
        description: "June Salary",
      });
    });
  });

  it("closes modal on success", async () => {
    depositAccount.mockImplementation(() => Promise.resolve());

    renderWithQuery(<DepositModal account={mockAccount} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "100" } });
    fireEvent.click(screen.getByText("Confirm Deposit"));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error on mutation failure", async () => {
    depositAccount.mockImplementation(() => Promise.reject(new Error("Deposit failed")));

    renderWithQuery(<DepositModal account={mockAccount} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "100" } });
    fireEvent.click(screen.getByText("Confirm Deposit"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled(); // You can also spy on console.error if needed
    });
  });
});
