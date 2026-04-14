import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        border: "none",
        borderRadius: 8,
        background: "#0f172a",
        color: "#ffffff",
        padding: "10px 16px",
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
