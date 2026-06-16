import { apiGet } from "./api.js";

export async function requireAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const user = await apiGet("/auth/me", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}
