
import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

async function main() {
  const passwordHash = await bcrypt.hash("Test@12345", 12);

  const user = await prisma.user.upsert({
    where: {
      email: "test@example.com",
    },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      passwordHash,
    },
  });

  console.log("Test user created:", user.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
