import { prisma } from "../../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { note, type } = req.body;
    const followUp = await prisma.followUp.create({
      data: {
        note,
        type,
        lead: { connect: { id: String(id) } }
      }
    });
    return res.status(201).json(followUp);
  }

  res.status(405).end();
}
