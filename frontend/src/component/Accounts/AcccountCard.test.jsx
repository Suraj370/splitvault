import { render, screen, fireEvent } from "@testing-library/react";
import AccountCard from "./AccountCard";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import DepositModal from "../modals/accounts/DepositModal";

// Mock the DepositModal
vi.mock("../modals/accounts/DepositModal", () => ({
  default: ({ account, onClose }) => (
    <div data-testid="mock-deposit-modal">
      Modal for {account.name}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("AccountCard Component", () => {
  const mockData = {
    id: "acc_1234567890",
    name: "Main Account",
    balance: 15000,
    createdAt: new Date().toISOString(),
  };

  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  it("renders account name, id, and balance", () => {
    renderWithRouter(<AccountCard data={mockData} />);

    expect(screen.getByText("Main Account")).toBeInTheDocument();
    expect(screen.getByText(/#\d{6}/)).toBeInTheDocument(); // last 6 of ID
    expect(screen.getByText(/₹15,000/)).toBeInTheDocument();
  });

  it("displays formatted created date", () => {
    const expectedDate = new Date(mockData.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    renderWithRouter(<AccountCard data={mockData} />);
    expect(screen.getByText(new RegExp(expectedDate))).toBeInTheDocument();
  });

  it("opens DepositModal on Deposit button click", () => {
    renderWithRouter(<AccountCard data={mockData} />);
    const depositBtn = screen.getByRole("button", { name: /deposit/i });
    fireEvent.click(depositBtn);

    expect(screen.getByTestId("mock-deposit-modal")).toBeInTheDocument();
    expect(screen.getByText(/Modal for Main Account/)).toBeInTheDocument();
  });

  it("closes DepositModal when Close button is clicked", () => {
    renderWithRouter(<AccountCard data={mockData} />);
    fireEvent.click(screen.getByRole("button", { name: /deposit/i }));

    const closeBtn = screen.getByText(/close/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("mock-deposit-modal")).not.toBeInTheDocument();
  });
});
