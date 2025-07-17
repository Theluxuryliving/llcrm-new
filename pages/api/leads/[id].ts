import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/db";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const leadId = req.query.id as string;

  if (req.method === "GET") {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });
      return res.status(200).json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.lead.delete({ where: { id: leadId } });
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting lead:", error);
      return res.status(500).json({ error: "Failed to delete lead" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
