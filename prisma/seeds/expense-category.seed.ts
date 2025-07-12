import { Prisma, PrismaClient } from "@prisma/client";

export async function expenseCategorySeed() {
  const prisma = new PrismaClient();

  const hasData = await prisma.expenseCategory.findFirst();

  if (hasData) {
    console.log("Category expenses already exists in the table, skipping seed.");
    return;
  }

  const user = await prisma.user.findFirst({
    where: { email: "admin@email.com" },
  });

  if (!user) {
    console.error("No user found to associate with the categories.");
    return;
  }

  const { id: userId, companyId } = user;

  const categories: Prisma.ExpenseCategoryCreateManyInput[] = [
    {
      name: "Alimentação",
      companyId,
      description: "Despesas relacionadas a alimentação",
      createdById: userId,
      icon: "fa-solid fa-utensils",
      color: "#FF6347",
    },
    {
      name: "Transporte",
      companyId,
      description: "Despesas relacionadas a transporte",
      createdById: userId,
      icon: "fa-solid fa-bus",
      color: "#4682B4",
    },
    {
      name: "Hospedagem",
      companyId,
      description: "Despesas relacionadas a hospedagem",
      createdById: userId,
      icon: "fa-solid fa-bed",
      color: "#8B4513",
    },
    {
      name: "Serviços",
      companyId,
      description: "Despesas relacionadas a serviços prestados",
      createdById: userId,
      icon: "fa-solid fa-tools",
      color: "#32CD32",
    },
    {
      name: "Outros",
      companyId,
      description: "Outras despesas diversas",
      createdById: userId,
      icon: "fa-solid fa-ellipsis-h",
      color: "#808080",
    },
  ];

  await prisma.expenseCategory.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log("Category expenses created successfully");
}