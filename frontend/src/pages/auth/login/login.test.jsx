import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./login";

// Mock react-redux
vi.mock("react-redux", () => {
  return {
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

// Mock loginUser thunk
vi.mock("../../../features/auth/authActions", () => ({
  loginUser: vi.fn((data) => ({ type: "loginUser/pending", payload: data })),
}));

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authActions";

describe("Login Component", () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation(() => ({ loading: false, error: null }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create one/i })).toHaveAttribute(
      "href",
      "/auth/register"
    );
  });

  it("updates input values on user input", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("secret123");
  });

  it("dispatches loginUser on valid form submit", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });

      expect(dispatchMock).toHaveBeenCalledWith({
        type: "loginUser/pending",
        payload: {
          email: "test@example.com",
          password: "password123",
        },
      });
    });
  });

  it("displays loading state when loading is true", () => {
    useSelector.mockReturnValue({ loading: true, error: null });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/logging in/i);
  });

  it("shows error message when error exists in state", () => {
    useSelector.mockReturnValue({
      loading: false,
      error: "Invalid credentials",
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid credentials/i)).toHaveClass(
      "text-red-600"
    );
  });

  it("does not dispatch loginUser if form is incomplete", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });
});
