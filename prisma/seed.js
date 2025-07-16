const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "Atif Zubair", email: "atif.zubair@gmail.com", password: "9731", role: "ADMIN" },
    { name: "Atif Aziz", email: "aaziz@example.com", password: "aziz123", role: "AGENT" },
    { name: "Talha Ali", email: "tali@example.com", password: "talha123", role: "AGENT" },
    { name: "Talal Younas", email: "tyounas@example.com", password: "talal123", role: "AGENT" },
    { name: "Admin", email: "admin@example.com", password: "admin123", role: "ADMIN" },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      },
    });
  }

  console.log("✅ Users created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
