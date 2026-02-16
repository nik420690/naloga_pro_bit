const BASE = "/api";

function getToken() {
  return localStorage.getItem("cars_token");
}

export async function api(method, path, body = null) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = getToken();
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body && method !== "GET") opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

// Auth
export const authApi = {
  login: (email, password) => api("POST", "/auth/login", { email, password }),
  register: (email, password, is_admin = false) =>
    api("POST", "/auth/register", { email, password, is_admin }),
};

// Cars
export async function getCars(params = {}) {
  const q = new URLSearchParams(params).toString();
  return api("GET", `/cars${q ? `?${q}` : ""}`);
}

export async function getCar(id) {
  return api("GET", `/cars/${id}`);
}

export async function getBrands() {
  return api("GET", "/cars/brands");
}

export async function createCar(data) {
  return api("POST", "/cars", data);
}

export async function updateCar(id, data) {
  return api("PUT", `/cars/${id}`, data);
}

export async function deleteCar(id) {
  return api("DELETE", `/cars/${id}`);
}
