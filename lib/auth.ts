// ✅ Utility to read user from token
import jwt from "jsonwebtoken";

export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("crm_token");
  if (!token) return null;

  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
}
