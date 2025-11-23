import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceCard from "@/components/ServiceCard";
import { Service } from "@/types";

describe("ServiceCard", () => {
  const mockService: Service = {
    _id: "1",
    title: "Test Service",
    description: "This is a test service description",
    slug: "test-service",
    isArchived: false,
    createdAt: new Date(),
  };

  it("renders service title", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText("Test Service")).toBeInTheDocument();
  });

  it("renders service description", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText(/This is a test service description/)).toBeInTheDocument();
  });

  it("renders link to service detail page", () => {
    render(<ServiceCard service={mockService} />);
    const link = screen.getByRole("link", { name: /Voir le service/i });
    expect(link).toHaveAttribute("href", "/services/test-service");
  });
});

