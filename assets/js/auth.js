import { apiPost } from "./api.js";

// LOGIN
export async function loginUser(email, password) {
  const body = { email, password };

  const data = await apiPost("/auth/login", body);

  // Guardar token e user
  localStorage.setItem("token", data.token);
  localStorage.setItem("currentUser", JSON.stringify(data.user));

  return data.user;
}

// REGISTO
export async function registerUser(name, email, password) {
  const body = { name, email, password };

  const data = await apiPost("/auth/register", body);

  // Guardar token e user
localStorage.setItem("token", String(data.token).replace(/['"]+/g, ""));
  localStorage.setItem("currentUser", JSON.stringify(data.user));

  return data.user;
}

// LOGOUT
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}
