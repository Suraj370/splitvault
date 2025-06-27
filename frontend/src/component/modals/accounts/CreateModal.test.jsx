import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { vi } from "vitest";

// Mock portal
vi.mock("react-dom", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    createPortal: (node) => node,
  };
});

// Mock react-query
const mutateMock = vi.fn();
const invalidateQueriesMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mutateMock,
    isPending: false,
    isError: false,
    error: null,
  }),
  useQueryClient: () => ({
    invalidateQueries: invalidateQueriesMock,
  }),
}));

describe("CreateModal", () => {
  const closeMock = vi.fn();

  beforeEach(() => {
    mutateMock.mockClear();
    invalidateQueriesMock.mockClear();
    closeMock.mockClear();
  });

  it("renders input fields and buttons", () => {
    render(<CreateModal onClose={closeMock} />);

    expect(screen.getByLabelText(/Account Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Initial Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();

  });

  it("calls onClose when Cancel is clicked", () => {
    render(<CreateModal onClose={closeMock} />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(closeMock).toHaveBeenCalled();
  });

  it("does not submit if fields are empty", () => {
    render(<CreateModal onClose={closeMock} />);
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("calls mutate with correct payload on valid input", async () => {
    render(<CreateModal onClose={closeMock} />);
    fireEvent.change(screen.getByLabelText(/Account Name/i), {
      target: { value: "Emergency Fund" },
    });
    fireEvent.change(screen.getByLabelText(/Initial Balance/i), {
      target: { value: "5000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));


    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith({
        name: "Emergency Fund",
        initialBalance: 5000,
      });
    });
  });
});
