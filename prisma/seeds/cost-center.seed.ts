import { Prisma, PrismaClient } from "@prisma/client";

export async function costCenterSeed() {
  const prisma = new PrismaClient();

  const hasData = await prisma.costCenter.findFirst();

  if (hasData) {
    console.log("Cost centers already exists in the table, skipping seed.");
    return;
  }

  const user = await prisma.user.findFirst({
    where: { email: "email@email.com" },
  });

  if (!user) {
    console.error("No user found to associate with the categories.");
    return;
  }

  const { id: userId, companyId } = user;

  const costCenters: Prisma.CostCenterCreateManyInput[] = [
    {
      name: "ADM/FIN",
      description: "Centro de custo para ADM e FIN",
      companyId,
      createdById: userId
    },
    {
      name: "COMERCIAL",
      description: "Centro de custo para COMERCIAL",
      companyId,
      createdById: userId
    },
    {
      name: "DESIGN",
      description: "Centro de custo para DESIGN",
      companyId,
      createdById: userId
    },
    {
      name: "ENDOMARKETING",
      description: "Centro de custo para ENDOMARKETING",
      companyId,
      createdById: userId
    },
    {
      name: "ENGENHARIA",
      description: "Centro de custo para ENGENHARIA",
      companyId,
      createdById: userId
    },
    {
      name: "MARKETING",
      description: "Centro de custo para MARKETING",
      companyId,
      createdById: userId
    },
    {
      name: "SÓCIOS",
      description: "Centro de custo para SÓCIOS",
      companyId,
      createdById: userId
    },
    {
      name: "TECH",
      description: "Centro de custo para TECH",
      companyId,
      createdById: userId
    }
  ];


  await prisma.costCenter.createMany({
    data: costCenters,
    skipDuplicates: true,
  });

  console.log("Cost centers created successfully");
}