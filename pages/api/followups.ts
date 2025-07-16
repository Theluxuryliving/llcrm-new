import { prisma } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const followUps = await prisma.followUp.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return res.status(200).json(followUps);
  }

  res.status(405).end(); // Method not allowed
}
