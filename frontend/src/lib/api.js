export const endpoints = {
  users: import.meta.env.VITE_USERS_URL || "http://localhost:8081",
};

export async function http(method, url, { token, json } = {}) {
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
