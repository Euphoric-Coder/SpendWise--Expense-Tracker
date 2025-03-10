import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Image from "next/image";

// Mock Financial Insights Function
const FinancialInsights = (savings, debtToIncomeRatio) => {
  if (savings > 0 && debtToIncomeRatio < 30) {
    return "Great job! You're saving well and keeping debt under control.";
  } else if (savings > 0 && debtToIncomeRatio >= 30) {
    return "You're saving money, but consider reducing your expenses to manage debt better.";
  } else {
    return "You have more expenses than income. Consider budgeting strategies to reduce spending.";
  }
};

export default function MonthlyFinanceReport({
  month = "",
  totalBudgetAmount = 0,
  totalIncomeAmount = 0,
  totalExpenseAmount = 0,
  largestBudget = 0,
  highestExpense = 0,
  savings = 0,
  debtToIncomeRatio = 0,
  incomeSavedPercentage = 0,
  expensesList = [],
  // month = "February 2025",
  // totalBudgetAmount = 5000,
  // totalIncomeAmount = 4500,
  // totalExpenseAmount = 3200,
  // largestBudget = 1500,
  // highestExpense = 800,
  // savings = 1300,
  // debtToIncomeRatio = 20,
  // incomeSavedPercentage = 28.9,
  // expensesList = [
  //   {
  //     amount: 500,
  //     category: "Groceries",
  //     budgetName: "Household Budget",
  //     description: "Monthly grocery shopping",
  //     date: "2025-02-10",
  //   },
  //   {
  //     amount: 300,
  //     category: "Transport",
  //     budgetName: "Travel Budget",
  //     description: "Gas and public transport",
  //     date: "2025-02-15",
  //   },
  //   {
  //     amount: 800,
  //     category: "Rent",
  //     budgetName: "Living Expenses",
  //     description: "Monthly house rent",
  //     date: "2025-02-01",
  //   },
  //   {
  //     amount: 600,
  //     category: "Entertainment",
  //     budgetName: "Leisure Budget",
  //     description: "Streaming services and outings",
  //     date: "2025-02-20",
  //   },
  // ],
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Monthly Financial Report - {month}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-0">
            {/* Header with Gradient Background */}
            <Section className="p-2 text-center">
              <Text
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#a63b00",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px", // Adjust spacing between image and text
                }}
              >
                <Img
                  src="https://res.cloudinary.com/dltoavydo/image/upload/v1741564253/favicon_h2rmbt.png"
                  width="40"
                  height="40"
                  alt="SpendWise Logo"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />
                <span className="text-2xl">SpendWise - Expense Tracking</span>
              </Text>
            </Section>

            <Section className="px-8 text-center">
              <Text className="mx-0 mb-8 mt-4 p-0 text-center text-2xl font-normal">
                <span className="font-bold tracking-tighter">
                  Monthly Finance Report
                </span>
              </Text>
              <Text className="text-sm font-normal uppercase tracking-wider">
                {month} Summary
              </Text>
              <Heading className="my-4 text-4xl font-medium leading-tight">
                Your Financial Overview
              </Heading>
              <Text className="mb-8 text-lg leading-8">
                Here&apos;s your detailed financial report for {month},
                summarizing your budgets, incomes, and expenses.
              </Text>
            </Section>

            {/* Financial Summary Section */}
            <Section className="my-6 rounded-2xl bg-[#4c51bf]/10 bg-[radial-gradient(circle_at_bottom_right,#4c51bf_0%,transparent_60%)] p-8 text-center">
              <Heading className="text-2xl font-bold text-[#4c51bf]">
                💰 Financial Summary
              </Heading>
              <Row className="mt-5">
                <Column className="w-1/3 text-center">
                  <Text className="text-sm font-medium text-[#4c51bf]">
                    Total Budget
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    ${totalBudgetAmount}
                  </Text>
                </Column>
                <Column className="w-1/3 text-center">
                  <Text className="text-sm font-medium text-green-600">
                    Total Income
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    ${totalIncomeAmount}
                  </Text>
                </Column>
                <Column className="w-1/3 text-center">
                  <Text className="text-sm font-medium text-red-600">
                    Total Expenses
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    ${totalExpenseAmount}
                  </Text>
                </Column>
              </Row>
              <Hr className="mt-6" style={{ borderColor: "#4c51bf" }} />
            </Section>
            {/* Largest Budget & Highest Expense Section */}
            <Section className="my-6 rounded-2xl bg-[#f59e0b]/10 bg-[radial-gradient(circle_at_top_left,#f59e0b_0%,transparent_60%)] p-8 text-center">
              <Heading className="text-2xl font-bold text-[#9c7b4a]">
                🚀 Financial Highlights
              </Heading>
              <Row className="mt-5">
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-[#9c7b4a]">
                    Largest Budget
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    ${largestBudget}
                  </Text>
                </Column>
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-red-600">
                    Highest Expense
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    ${highestExpense}
                  </Text>
                </Column>
              </Row>
              <Hr className="mt-6" style={{ borderColor: "#f59e0b" }} />
            </Section>
            {/* Savings & Debt Section */}
            <Section className="my-6 rounded-2xl bg-[#10b981]/10 bg-[radial-gradient(circle_at_bottom_right,#10b981_0%,transparent_60%)] p-8 text-center">
              <Heading className="text-2xl font-bold text-[#065f46]">
                💵 Savings & Debt
              </Heading>
              <Row className="mt-5">
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-green-600">
                    Total Savings
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    ${savings}
                  </Text>
                </Column>
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-gray-700">
                    Income Saved
                  </Text>
                  <Text className="text-4xl font-bold text-gray-900">
                    {incomeSavedPercentage}%
                  </Text>
                </Column>
              </Row>
              <Hr className="mt-6" style={{ borderColor: "#10b981" }} />
            </Section>
            {/* Expense Breakdown */}
            <Section className="my-6 rounded-2xl bg-[#6b7280]/10 bg-[radial-gradient(circle_at_top_left,#6b7280_0%,transparent_60%)] p-8 text-center">
              <Heading className="text-2xl font-bold text-gray-800">
                📉 Expense Breakdown
              </Heading>
              {expensesList?.map((expense, index) => (
                <Row key={index} className="mt-4 border-b border-gray-300 pb-3">
                  <Column>
                    <Text className="text-lg font-bold text-gray-900">
                      {expense.budgetName}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      <strong>Category:</strong> {expense.category} |{" "}
                      <strong>Amount:</strong>
                      <span className="font-bold text-red-600">
                        {" "}
                        ${expense.amount}
                      </span>{" "}
                      | {expense.date}
                    </Text>
                    <Text className="text-sm italic text-gray-500">
                      "{expense.description}"
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
            {/* Financial Insights */}
            <Section className="my-6 rounded-2xl bg-[#eab308]/10 bg-[radial-gradient(circle_at_bottom_right,#eab308_0%,transparent_60%)] p-8 text-center">
              <Heading className="text-2xl font-bold text-[#9c7b4a]">
                📢 Financial Insights
              </Heading>
              <Text className="text-lg text-gray-900">
                {FinancialInsights(savings, debtToIncomeRatio)}
              </Text>
            </Section>
            {/* Footer */}
            <Section className="pb-6 text-center">
              <Text className="text-xl leading-8 text-gray-900">
                Stay financially smart! 💡 <br />
                See you next month! 🎉
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
