// Use the Vite proxy in dev: UI will call /api/users/*
// Vite forwards to your Python backend (see vite.config.js)
const BASE = "/api/users";

// If your backend paths differ, change them here.
const PATHS = {
  login:    `${BASE}/auth/login`,
  register: `${BASE}/auth/register`,
  me:       `${BASE}/auth/me`,
};

// Small fetch helper with better error messages
async function req(method, url, { token, json } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: json ? JSON.stringify(json) : undefined,
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`${res.status} ${text || res.statusText}`);
  try { return JSON.parse(text); } catch { return {}; }
}

export async function apiRegister({ name, email, password }) {
  return req("POST", PATHS.register, { json: { name, email, password } });
}
export async function apiLogin({ email, password }) {
  return req("POST", PATHS.login, { json: { email, password } });
}
export async function apiMe(token) {
  return req("GET", PATHS.me, { token });
}
