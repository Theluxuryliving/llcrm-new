// components/LoginForm.tsx
"use client"; // For client-side logic if needed in App Router
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("crm_token", data.token);

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const role = payload.role;

      // Redirect based on role
      if (role === "ADMIN" || role === "DIRECTOR") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard/overview");
      }
    } catch (err) {
      setError("Unexpected error");
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 space-y-4 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="w-full bg-black text-white py-2 rounded">Log In</button>
    </form>
  );
}
