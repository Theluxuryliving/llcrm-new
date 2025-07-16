import { prisma } from "../../lib/db";

export default async function handler(req, res) {
  const userId = req.headers.authorization;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  let totalLeads, totalFollowUps;

  if (["ADMIN", "DIRECTOR", "MANAGER"].includes(user.role)) {
    totalLeads = await prisma.lead.count();
    totalFollowUps = await prisma.followUp.count();
  } else {
    totalLeads = await prisma.lead.count({ where: { createdById: user.id } });
    totalFollowUps = await prisma.followUp.count({
      where: { lead: { createdById: user.id } },
    });
  }

  res.json({ totalLeads, totalFollowUps });
}
