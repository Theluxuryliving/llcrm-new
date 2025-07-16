import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = session.user;

  // ✅ CREATE LEAD
  if (req.method === "POST") {
    try {
      const {
        name,
        phone,
        email,
        country,
        city,
        area,
        plan,
        propertyType,
        project,
        budget,
        timeline,
        source,
      } = req.body;

      const lead = await prisma.lead.create({
        data: {
          name,
          phone,
          email,
          country,
          city,
          area,
          plan,
          property: propertyType,
          project,
          budget, // already a number
          purchasePlan: timeline,
          source,
          createdBy: { connect: { email: user.email! } },
        },
      });

      return res.status(200).json(lead);
    } catch (err) {
      console.error("❌ Error creating lead:", err);
      return res.status(500).json({ error: "Error creating lead" });
    }
  }

  // ✅ GET LEADS
  if (req.method === "GET") {
    try {
      let leads;
      if (["ADMIN", "DIRECTOR", "MANAGER"].includes(user.role)) {
        leads = await prisma.lead.findMany({
          include: { createdBy: true },
          orderBy: { createdAt: "desc" },
        });
      } else {
        leads = await prisma.lead.findMany({
          where: { createdBy: { email: user.email! } },
          include: { createdBy: true },
          orderBy: { createdAt: "desc" },
        });
      }

      return res.status(200).json(leads);
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      return res.status(500).json({ error: "Error fetching leads" });
    }
  }

  // ❌ Unsupported method
  return res.status(405).json({ message: "Method not allowed" });
}
