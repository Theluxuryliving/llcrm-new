// /pages/api/followups.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    const followups = await prisma.followUp.findMany({
      where: { userId: session.user.id },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    });

    const response = followups.map((fup) => ({
      id: fup.id,
      note: fup.note,
      type: fup.type,
      createdAt: fup.createdAt,
      leadName: fup.lead?.name || "Unknown",
    }));

    return res.json(response);
  }

  if (req.method === "POST") {
    const { note, type, nextFollowup, leadId } = req.body;

    if (!leadId) return res.status(400).json({ message: "Missing lead ID" });

    const followup = await prisma.followUp.create({
      data: {
        note,
        type,
        nextFollowup: new Date(nextFollowup),
        lead: { connect: { id: leadId } },
        user: { connect: { id: session.user.id } },
      },
    });

    return res.status(201).json(followup);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
