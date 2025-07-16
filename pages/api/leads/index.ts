// pages/api/leads/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.crm_token || req.headers.authorization?.split(" ")[1];

  const user = token ? verifyJwt(token) : null;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const leads = await prisma.lead.findMany({
      where: { createdById: user.id },
      include: { followUps: true },
    });

    return res.status(200).json(leads);
  }

  if (req.method === "POST") {
    const { name, phone, email } = req.body;

    const newLead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        createdById: user.id,
      },
    });

    return res.status(201).json(newLead);
  }

  res.status(405).json({ error: "Method not allowed" });
}
