import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  const { id } = req.query;

  if (req.method === "GET") {
    const lead = await prisma.lead.findUnique({ where: { id: String(id) } });
    const followUps = await prisma.followUp.findMany({
      where: { leadId: String(id) },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ lead, followUps });
  }

  if (req.method === "PUT") {
    const { stage } = req.body;
    const updated = await prisma.lead.update({
      where: { id: String(id) },
      data: { stage }
    });
    return res.json(updated);
  }

  // 🛡️ Only Admins can delete leads
  if (req.method === "DELETE") {
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await prisma.lead.delete({ where: { id: String(id) } });
      return res.status(200).json({ message: "Lead deleted" });
    } catch (err) {
      console.error("Error deleting lead", err);
      return res.status(500).json({ error: "Failed to delete lead" });
    }
  }

  res.status(405).end();
}
