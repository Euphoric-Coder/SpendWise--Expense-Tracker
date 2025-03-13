import MonthlyFinanceReport from "@/emails/monthlyReportTemplate";
import { FinancialInsights } from "../aiSuggest";
import { sendEmail } from "../sendEmail";
import { getUsers } from "../userAppData";
import { inngest } from "./client";
import { currentUser } from "@clerk/nextjs/server";
import BudgetEaseWelcomeEmail from "@/emails/welcomeTemplate";
import { budgetPercentage, incomeExpiration } from "../cronFunctions";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const sendMonthlyReport = inngest.createFunction(
  { id: "monthly-report" },
  { event: "send/monthly.report" },
  // { cron: "*/2 * * * *" }, // First day of each month
  async ({ step }) => {
    await step.sleep("wait-a-moment", "1s");
    // return await sendEmail({
    //   to: "deydsagnik@gmail.com",
    //   subject: `Welcome to BudgetEase Expense Tracker`,
    //   react: MonthlyFinanceReport({
    //     month: "February 2025",
    //     totalBudgetAmount: 5000,
    //     totalIncomeAmount: 4500,
    //     totalExpenseAmount: 3200,
    //     largestBudget: 1500,
    //     highestExpense: 800,
    //     savings: 1300,
    //     debtToIncomeRatio: 20,
    //     incomeSavedPercentage: 8.9,
    //     expensesList: [
    //       {
    //         amount: 500,
    //         category: "Groceries",
    //         budgetName: "Household Budget",
    //         description: "Monthly grocery shopping",
    //         date: "2025-02-10",
    //       },
    //       {
    //         amount: 300,
    //         category: "Transport",
    //         budgetName: "Travel Budget",
    //         description: "Gas and public transport",
    //         date: "2025-02-15",
    //       },
    //       {
    //         amount: 800,
    //         category: "Rent",
    //         budgetName: "Living Expenses",
    //         description: "Monthly house rent",
    //         date: "2025-02-01",
    //       },
    //       {
    //         amount: 600,
    //         category: "Entertainment",
    //         budgetName: "Leisure Budget",
    //         description: "Streaming services and outings",
    //         date: "2025-02-20",
    //       },
    //     ],
    //   }),
    // });
    return await sendEmail({
      react: BudgetEaseWelcomeEmail({
        username: "Sagnik",
      }),
    });
  }
);

export const checkExpiredItems = inngest.createFunction(
  { id: "check-expired-incomes" },
  { cron: "0 0 * * *" }, // Every day at 12:01 AM
  async ({ step }) => {
    await step.run("fetch-expired-incomes", async () => {
      return await incomeExpiration();
    });
  }
);

export const checkBudgetPercentage = inngest.createFunction(
  { id: "check-budget-percentage" },
  { cron: "0 0 * * *" }, // Every day at 12:01 AM
  async ({ step }) => {
    await step.run("fetch-budget-percentage", async () => {
      return await budgetPercentage();
    });

    await step.run("send-budget-percentage-email", async () => {
    });
  }
);

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await getUsers();
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        // Generate AI insights
        const insights = await FinancialInsights(stats, monthName);

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });
      });
    }

    return { processed: users.length };
  }
);
