"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-white/25 text-sm mt-1 font-mono">henrynicholson.com</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-white/20"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>

          {error && (
            <p className="text-red-400/80 text-xs font-mono text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-colors duration-300 disabled:opacity-50"
            style={{ background: "white", color: "#050508" }}
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-white/15 text-xs font-mono hover:text-white/30 transition-colors">
            &larr; Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
