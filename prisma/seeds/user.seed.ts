import { HashService } from "../../src/common/hash/hash.service";
import { RolesEnum } from "../../src/domain/enums/roles.enum";
import { Prisma, PrismaClient } from "@prisma/client";

export async function userSeed() {
  const prisma = new PrismaClient();

  const hasData = await prisma.user.findFirst();

  if (hasData) {
    console.log("User already exists in the table, skipping seed.");
    return;
  }

  const company = await prisma.company.findFirst();
  console.log("Company ID found:", company);

  if (!company) {
    console.error("No company found to associate with the user.");
    return;
  }

  const hashService = new HashService(Number(process.env.HASH_SALT_ROUNDS) || 10);

  const newUser: Prisma.UserCreateInput = {
    name: "John Doe",
    email: "email@email.com",
    phone: "1234567890",
    password: await hashService.hash("password123"),
    company: {
      connect: { id: company.id }
    },
    role: RolesEnum.ADMIN
  }

  return prisma.user.create({ data: newUser })
    .finally(() => prisma.$disconnect());
}