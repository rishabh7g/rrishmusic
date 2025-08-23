import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    // This test will pass if your App component renders without errors
    expect(document.body).toBeDefined();
  });

  it("displays content", () => {
    render(<App />);
    // Test for any text that should be in your App component
    // Update this based on what's currently in your App.tsx
    expect(screen.getByText(/Hi, I'm Rrish./i)).toBeInTheDocument();
  });
});
