"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const user = authenticate(email, password);
    if (!user) {
      alert("Invalid credentials");
      return;
    }
    localStorage.setItem("authUser", email);
    router.push("/dashboard");
  };

  return (
    <div className="login-page login-scope">
      <div className="login-card">
        <h2>Employee Login</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={login}>
          Sign In
        </button>
      </div>
    </div>
  );
}
