import React, { useState } from "react";
import { apiLogin, apiRegister, apiMe } from "../lib/auth";

export default function LoginModal({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = (mode === "login")
        ? await apiLogin({ email, password: pw })
        : await apiRegister({ name, email, password: pw });

      const { token, user } = data || {};
      if (!token) throw new Error("No token returned from service");

      localStorage.setItem("pp_token", token);

      // verify token / fetch profile (works for both FastAPI/Flask examples)
      const me = await apiMe(token).catch(() => ({ user }));
      onLoggedIn?.(me.user || user);
    } catch (e) {
      // This catches "NetworkError…" too and surfaces a readable message
      setErr(e.message || "Network error. Check backend is running.");
    }
  }

  return (
    <form className="list" style={{ gap: 12 }} onSubmit={onSubmit}>
      {mode === "signup" && (
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
      )}
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} required />
      </div>
      {err && <div className="p-muted" style={{ color: "#b91c1c" }}>{err}</div>}
      <div className="row" style={{ gap: 8 }}>
        <button className="btn btn--dark" type="submit">{mode === "login" ? "Log In" : "Create Account"}</button>
        <button className="btn" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account?" : "Already have an account?"}
        </button>
      </div>
    </form>
  );
}
