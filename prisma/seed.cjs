const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "Atif Zubair", email: "atif.zubair@gmail.com", password: "9731", role: Role.ADMIN },
    { name: "Atif Aziz", email: "aaziz@example.com", password: "aziz123", role: Role.AGENT },
    { name: "Talha Ali", email: "tali@example.com", password: "talha123", role: Role.AGENT },
    { name: "Talal Younas", email: "tyounas@example.com", password: "talal123", role: Role.AGENT },
    { name: "Admin", email: "admin@example.com", password: "admin123", role: Role.ADMIN },
  ];

  for (const u of users) {
    try {
      const hashed = await bcrypt.hash(u.password, 10);

      const result = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          name: u.name,
          email: u.email,
          password: hashed,
          role: u.role,
        },
      });

      console.log(`✅ User ready: ${result.email}`);
    } catch (err) {
      console.error(`❌ Error seeding user ${u.email}:`, err);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
