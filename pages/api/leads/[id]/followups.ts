import { prisma } from "../../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { note, nextFollowup } = req.body;

    try {
      const followup = await prisma.followUp.create({
        data: {
          note,
          nextFollowup: new Date(nextFollowup),
          lead: { connect: { id: id as string } },
          user: { connect: { id: userId } },
        },
      });

      return res.status(201).json(followup);
    } catch (error) {
      console.error("Error creating follow-up:", error);
      return res.status(500).json({ error: "Something went wrong." });
    }
  }

  if (req.method === "GET") {
    try {
      const followups = await prisma.followUp.findMany({
        where: { leadId: id as string },
        orderBy: { nextFollowup: "asc" },
      });

      return res.status(200).json(followups);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      return res.status(500).json({ error: "Something went wrong." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
