import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { note, nextFollowup } = req.body;

    try {
      const followup = await prisma.followUp.create({
        data: {
          note,
          nextFollowup: new Date(nextFollowup),
          lead: { connect: { id: id as string } },
        },
      });

      return res.status(201).json(followup);
    } catch (error) {
      console.error("Error creating follow-up:", error);
      return res.status(500).json({ error: "Failed to create follow-up" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
