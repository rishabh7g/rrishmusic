import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  it("displays the main heading", () => {
    render(<App />);
    expect(screen.getByText(/Hi, I'm Rrish./i)).toBeInTheDocument();
  });

  it("displays the description text", () => {
    render(<App />);
    expect(
      screen.getByText(/I'm a musician who improvises on blues/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/help people learn music at every level/i)
    ).toBeInTheDocument();
  });

  it("displays Instagram link", () => {
    render(<App />);
    const instagramLink = screen.getByRole("link", { name: /@rrishmusic/i });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute("href", "https://instagram.com/rrishmusic");
    expect(instagramLink).toHaveAttribute("target", "_blank");
    expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has proper semantic structure", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("applies correct CSS classes for styling", () => {
    render(<App />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("min-h-screen", "bg-white");
    
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-4xl", "md:text-6xl", "font-heading", "font-bold");
  });
});
