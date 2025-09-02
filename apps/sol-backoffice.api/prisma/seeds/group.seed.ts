import { Prisma, PrismaClient } from "@prisma/client";

export async function groupsSeed() {
  const prisma = new PrismaClient();

  const hasData = await prisma.group.findFirst();

  if (hasData) {
    console.log("Group already exists in the table, skipping seed.");
    return;
  }

  const company = await prisma.company.findFirst();

  if (!company) {
    console.error("No company found to associate with the group.");
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

  const groups: Prisma.GroupCreateManyInput[] = [
    {
      name: "Digital",
      description: "Para produtos e serviços digitais",
      companyId,
      createdById: userId,
    },
    {
      name: "Industrial",
      description: "Para produtos e serviços industriais",
      companyId,
      createdById: userId,
    },
    {
      name: "Gráfico",
      description: "Para produtos e serviços gráficos",
      companyId,
      createdById: userId,
    },
    {
      name: "Mecanica",
      description: "Para produtos e serviços mecânicos",
      companyId,
      createdById: userId,
    },
    {
      name: "Automação",
      description: "Para produtos e serviços de automação",
      companyId,
      createdById: userId,
    },
    {
      name: "Gestão de Relacionamento",
      description: "Para produtos e serviços de gestão de relacionamento",
      companyId,
      createdById: userId,
    },
    {
      name: "Protótipo",
      description: "Para produtos e serviços de protótipo",
      companyId,
      createdById: userId,
    },
  ];

  await prisma.group.createMany({ data: groups, skipDuplicates: true });

  console.log("Groups created successfully");
}