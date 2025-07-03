import { companySeed } from "./company.seed";
import { expenseCategorySeed } from "./expense-category.seed";
import { userSeed } from "./user.seed";

; (async () => {
  await companySeed()
    .catch((error) => console.error("Error seeding company:", error));

  await userSeed()
    .catch((error) => console.error("Error seeding user:", error));

  await expenseCategorySeed()
    .catch((error) => console.error("Error seeding expense category:", error));

})().catch((error) => {
  console.error("An error occurred during seeding:", error);
  process.exit(1);
});


