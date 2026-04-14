type FormErrorProps = {
  message: string | null;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      style={{
        margin: 0,
        fontSize: 14,
        color: "#b91c1c",
      }}
    >
      {message}
    </p>
  );
}
