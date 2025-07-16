import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    const data = await res.json();
    localStorage.setItem("crm_token", data.token);
    document.cookie = `crm_token=${data.token}; path=/;`;
    router.push("/dashboard");

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-poppins bg-light">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2 mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 mb-4"
      />
      <button onClick={handleLogin} className="bg-black text-gold px-6 py-2 rounded">
        Login
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
