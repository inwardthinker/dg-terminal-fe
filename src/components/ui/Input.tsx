import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ id, label, style, ...props }: InputProps) {
  return (
    <label htmlFor={id} style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <input
        id={id}
        {...props}
        style={{
          width: "100%",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          padding: "10px 12px",
          ...style,
        }}
      />
    </label>
  );
}
