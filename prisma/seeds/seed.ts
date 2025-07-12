import { companySeed } from "./company.seed";
import { costCenterSeed } from "./cost-center.seed";
import { expenseCategorySeed } from "./expense-category.seed";
import { groupsSeed } from "./group.seed";
import { rolesSeed } from "./role.seed";
import { userSeed } from "./user.seed";

; (async () => {
  await companySeed()
    .catch((error) => console.error("Error seeding company:", error));

  await rolesSeed()
    .catch((error) => console.error("Error seeding roles:", error));

  await userSeed()
    .catch((error) => console.error("Error seeding user:", error));

  await expenseCategorySeed()
    .catch((error) => console.error("Error seeding expense category:", error));

  await costCenterSeed()
    .catch((error) => console.error("Error seeding cost center:", error));

  await groupsSeed()
    .catch((error) => console.error("Error seeding group:", error));

})().catch((error) => {
  console.error("An error occurred during seeding:", error);
  process.exit(1);
});


