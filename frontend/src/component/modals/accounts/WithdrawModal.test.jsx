import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import WithdrawModal from "./WithdrawModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { withdrawAccount } from "../../../api/accounts.api";

// Mock API function
vi.mock("../../../api/accounts.api", () => ({
  withdrawAccount: vi.fn(),
}));


const account = { id: "sub_123", name: "Test Account" };

function renderComponent(onClose = vi.fn()) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <WithdrawModal account={account} onClose={onClose} />
    </QueryClientProvider>
  );
}

describe("WithdrawFunds Modal", () => {
  let onClose;

  beforeEach(() => {
    onClose = vi.fn();
    withdrawAccount.mockReset();
  });

  it("renders the form correctly", () => {
    renderComponent(onClose);

    expect(screen.getByText(/Widthdraw From Test Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("validates required amount field", async () => {
    renderComponent(onClose);

    const submitButton = screen.getByText("Withdraw");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(withdrawAccount).not.toHaveBeenCalled();
    });
  });

  it("submits valid form and calls API", async () => {
    withdrawAccount.mockImplementation(() => Promise.resolve());

    renderComponent(onClose);

    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test withdrawal" },
    });

    fireEvent.click(screen.getByText("Withdraw"));

    await waitFor(() => {
      expect(withdrawAccount).toHaveBeenCalledWith({
        accountId: account.id,
        amount: 500,
        description: "Test withdrawal",
      });

      expect(onClose).toHaveBeenCalled();
    });
  });

  it("handles API error gracefully", async () => {
    console.error = vi.fn(); // silence expected error log
    withdrawAccount.mockImplementation(() =>
      Promise.reject(new Error("API failed"))
    );

    renderComponent(onClose);

    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByText("Withdraw"));

    await waitFor(() => {
      expect(withdrawAccount).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("calls onClose when Cancel is clicked", () => {
    renderComponent(onClose);

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });
});
