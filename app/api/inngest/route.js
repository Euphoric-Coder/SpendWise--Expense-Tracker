import { budgetPercentage } from "@/utils/cronFunctions";
import { inngest } from "@/utils/inngest/client";
import { checkBudgetPercentage, checkExpiredItems, helloWorld, sendMonthlyReport } from "@/utils/inngest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, sendMonthlyReport, checkExpiredItems, checkBudgetPercentage],
});
