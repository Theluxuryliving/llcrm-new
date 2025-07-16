await prisma.user.create({
  data: {
    email: "admin@example.com",
    password: await bcrypt.hash("password123", 10),
    role: "ADMIN",
    name: "Admin User",
  }
})
