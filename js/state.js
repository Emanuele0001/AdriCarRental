const API_BASE = "/api";

let cars = [];
let favorites = [];
let bookings = [];

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let token = localStorage.getItem("token") || null;

let editId = null;
let activeTab = "all";

function authHeaders() {
  return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}
