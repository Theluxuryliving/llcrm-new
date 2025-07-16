import { prisma } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.json(leads);
  }

  if (req.method === "POST") {
    const { name, phone, createdBy } = req.body;
    const lead = await prisma.lead.create({
      data: { name, phone, createdBy }
    });
    return res.status(201).json(lead);
  }

  res.status(405).end();
}
