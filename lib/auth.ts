// lib/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CRMUser extends JwtPayload {
  id: string;
  email: string;
  name?: string;
  role: string;
}

// ✅ Use only on frontend — does NOT verify the JWT
export function getCurrentUser(): CRMUser | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("crm_token");
  if (!token) return null;

  try {
    const decoded = jwt.decode(token) as CRMUser;

    // Basic structure check
    if (!decoded?.id || !decoded?.email || !decoded?.role) return null;

    return decoded;
  } catch {
    return null;
  }
}
