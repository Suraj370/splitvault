import { render, screen } from "@testing-library/react";
import SubAccountCard from "./SubAccountCard";
import { describe, it, expect } from "vitest";

describe("SubAccountCard", () => {
  const account = {
    name: "Europe Trip",
    description: "Saving for my dream vacation",
    balance: 25000,
    targetAmount: 100000,
  };

  it("renders account name and description", () => {
    render(<SubAccountCard account={account} />);
    expect(screen.getByText("Europe Trip")).toBeInTheDocument();
    expect(
      screen.getByText("Saving for my dream vacation")
    ).toBeInTheDocument();
  });

  it("shows correct progress percentage", () => {
    render(<SubAccountCard account={account} />);
    expect(screen.getByText("25.0%")).toBeInTheDocument(); // 25%
  });



  it("limits progress to max 100%", () => {
    const overFundedAccount = { ...account, balance: 200000 };
    render(<SubAccountCard account={overFundedAccount} />);
    expect(screen.getByText("100.0%")).toBeInTheDocument();
  });
});
