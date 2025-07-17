import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateLogin } from "@/lib/validators";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const validation = validateLogin(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { email, password } = validation.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables.");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    },
    secret,
    { expiresIn: "7d" }
  );

  res.status(200).json({ token });
}
