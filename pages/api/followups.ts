import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const followUps = await prisma.followUp.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(followUps);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
