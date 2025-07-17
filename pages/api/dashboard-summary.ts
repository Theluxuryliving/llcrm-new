import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.headers.authorization;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Dummy summary data (replace with real queries)
    const summary = {
      totalLeads: 123,
      totalDeals: 45,
      userName: user.name,
      userRole: user.role,
    };

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
