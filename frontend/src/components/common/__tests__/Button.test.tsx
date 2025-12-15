/**
 * Example test for common Button component
 * Place this in src/components/common/__tests__/Button.test.tsx
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Example Button component structure (you'll need to create the actual component)
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
}

// This is a placeholder - replace with your actual Button component
const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "medium",
  type = "button",
}: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    type={type}
    className={`btn btn-${variant} btn-${size}`}
  >
    {children}
  </button>
);

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("should render with primary variant by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-primary");
  });

  it("should render with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-secondary");
  });

  it("should render with outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-outline");
  });

  it("should render with small size", () => {
    render(<Button size="small">Small Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-small");
  });

  it("should render with medium size by default", () => {
    render(<Button>Medium Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-medium");
  });

  it("should render with large size", () => {
    render(<Button size="large">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-large");
  });

  it("should render as submit button", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should render with custom children (icons, etc.)", () => {
    render(
      <Button>
        <span data-testid="icon">→</span>
        Next
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
