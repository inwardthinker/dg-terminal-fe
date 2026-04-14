"use client";

import { FormEvent, useState } from "react";
import { useLogin } from "@/features/auth/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormError } from "@/components/shared/FormError";

export default function LoginPage() {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login({ email, password });
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          display: "grid",
          gap: 12,
          padding: 24,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          background: "#ffffff",
        }}
      >
        <h1 style={{ margin: 0 }}>Login</h1>
        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormError message={error} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
