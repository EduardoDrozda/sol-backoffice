import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

export async function companySeed() {
  const prisma = new PrismaClient();

  const isProduction = process.env.NODE_ENV === "production";

  const hasData = await prisma.company.findFirst();

  if (isProduction || hasData) {
    console.log("Company already exists in the table, skipping seed.");
    return;
  }

  const newCompany: Prisma.CompanyCreateInput = {
    name: "Example Company",
    email: "company@email.com",
    phone: "123-456-7890",
    address: "123 Example St, Example City, EX 12345"
  }

  return prisma.company.create({ data: newCompany })
    .finally(() => prisma.$disconnect());
}
