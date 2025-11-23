import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderForm from "@/components/OrderForm";

describe("OrderForm", () => {
  const mockOnSubmit = vi.fn();

  it("renders form fields", () => {
    render(<OrderForm serviceId="123" onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it("has submit button", () => {
    render(<OrderForm serviceId="123" onSubmit={mockOnSubmit} />);
    expect(screen.getByRole("button", { name: /Commander/i })).toBeInTheDocument();
  });
});

