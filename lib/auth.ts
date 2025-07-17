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

// ✅ Used on backend — verifies JWT signature using secret
export function verifyJwt(token: string): CRMUser | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  try {
    return jwt.verify(token, secret) as CRMUser;
  } catch {
    return null;
  }
}
