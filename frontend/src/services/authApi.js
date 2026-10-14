const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const TOKEN_KEY = 'pdf_vault_token';

async function request(path, options = {}) {
  const response = await fetch(BASE + path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Authentication request failed.');
  }
  return response.json();
}

export async function registerUser({ username, email, password }) {
  const result = await request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result.user;
}

export async function loginUser(email, password) {
  const body = new URLSearchParams({ username: email, password });
  const result = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result.user;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
}
