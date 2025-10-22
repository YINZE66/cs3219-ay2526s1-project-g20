import React, { useState } from "react";

export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const isLogin = mode === "login";
  const [error, setError] = useState("");

  // Validate confirm password matches password
  const validatePasswords = (password, confirmPassword) => {
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    if (!validatePasswords(data.password, data.confirmPassword)) {
      return;
    }

    
    try {
      let response;

      if (isLogin) {
        response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: data.email,
            password: data.password,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            username: data.fullName,
            password: data.password,
          }),
        });
    }

    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || "Something went wrong");

    // Save JWT token on login
    if (isLogin) {
        const { access_token } = result;
        localStorage.setItem("access_token", access_token); // Match key used in userService

        // Fetch user profile to get user data
        const userResponse = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const user = await userResponse.json();
        onLogin?.(user); // Pass user data to parent
      } else {
        // On signup: Trigger login flow or show success
        onLogin?.();
      }

      onClose?.();
    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <form className="list" style={{ gap: 14, minWidth: 300 }} onSubmit={handleSubmit}>
      <div className="segmented" style={{ marginBottom: 8 }}>
        <button type="button" className={isLogin ? "is-active" : ""} onClick={() => setMode("login")}>Login</button>
        <button type="button" className={!isLogin ? "is-active" : ""} onClick={() => setMode("signup")}>Sign Up</button>
      </div>

      {!isLogin && (
        <div>
          <label className="label">Full Name</label>
          <input className="input" name="fullName" placeholder="Alex Chen" required />
        </div>
      )}

      <div>
        <label className="label">Email</label>
        <input className="input" name="email" type="email" placeholder="alex@example.com" required />
      </div>

      {!isLogin && (
        <div>
          <label className="label">Experience Level</label>
          <select className="select" name="experience" defaultValue="Intermediate (2–4 years)">
            <option>Beginner (0–1 year)</option>
            <option>Junior (1–2 years)</option>
            <option>Intermediate (2–4 years)</option>
            <option>Senior (5+ years)</option>
          </select>
        </div>
      )}

      <div>
        <label className="label">Password</label>
        <input className="input" name="password" type="password" required />
      </div>

      {!isLogin && (
        <div>
          <label className="label">Confirm Password</label>
          <input className="input" name="confirmPassword" type="password" required />
        </div>
      )}

      <button className="btn btn--dark" type="submit" style={{ width: "100%", marginTop: 4 }}>
        {isLogin ? "Login" : "Create Account"}
      </button>
    </form>
  );
}
