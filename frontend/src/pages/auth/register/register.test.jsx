import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./register";

// Mock react-redux
vi.mock("react-redux", () => {
  return {
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

// Mock registerUser thunk
vi.mock("../../../features/auth/authActions", () => ({
  registerUser: vi.fn((data) => ({
    type: "registerUser/pending",
    payload: data,
  })),
}));

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../features/auth/authActions";

describe("Register Component", () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockReturnValue({ loading: false, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form inputs and button", () => {
    render(<Register />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("updates form values on user input", () => {
    render(<Register />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "securePass123" } });

    expect(nameInput.value).toBe("Alice");
    expect(emailInput.value).toBe("alice@example.com");
    expect(passwordInput.value).toBe("securePass123");
  });

  it("dispatches registerUser on valid form submit", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "securePass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: "Alice",
        email: "alice@example.com",
        password: "securePass123",
      });

      expect(dispatchMock).toHaveBeenCalledWith({
        type: "registerUser/pending",
        payload: {
          name: "Alice",
          email: "alice@example.com",
          password: "securePass123",
        },
      });
    });
  });

  it("disables the button and shows loading text when loading", () => {
    useSelector.mockReturnValue({ loading: true, error: null });

    render(<Register />);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/creating account/i);
  });

  it("displays error message if error exists", () => {
    useSelector.mockReturnValue({
      loading: false,
      error: "Registration failed",
    });

    render(<Register />);
    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    expect(screen.getByText(/registration failed/i)).toHaveClass(
      "text-red-600"
    );
  });

  it("does not dispatch registerUser if form is incomplete", async () => {
    render(<Register />);
    // Only fill name
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Partial User" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });
});
