import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

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
  // month ,
  // totalBudgetAmount,
  // totalIncomeAmount,
  // totalExpenseAmount,
  // largestBudget,
  // highestExpense,
  // savings,
  // debtToIncomeRatio,
  // incomeSavedPercentage,
  // expensesList,
  month =  "February 2025",
    totalBudgetAmount = 5000,
    totalIncomeAmount = 4500,
    totalExpenseAmount = 3200,
    largestBudget = 1500,
    highestExpense = 800,
    savings = 1300,
    debtToIncomeRatio = 20,
    incomeSavedPercentage = 28.9,
    expensesList = [
      {
        amount : 500,
        category :  "Groceries",
        budgetName :  "Household Budget",
        description :  "Monthly grocery shopping",
        date : "2025-02-10",
      },
      {
        amount :  300,
        category :  "Transport",
        budgetName :  "Travel Budget",
        description :  "Gas and public transport",
        date :  "2025-02-15",
      },
      {
        amount :  800,
        category :  "Rent",
        budgetName :  "Living Expenses",
        description :  "Monthly house rent",
        date :  "2025-02-01",
      },
      {
        amount :  600,
        category :  "Entertainment",
        budgetName :  "Leisure Budget",
        description :  "Streaming services and outings",
        date :  "2025-02-20",
      },
    ],
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Monthly Financial Report - {month}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-0">
            <Section className="p-8 text-center">
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
                Here’s your detailed financial report for {month}, summarizing
                your budgets, incomes, and expenses.
              </Text>
            </Section>

            {/* Budget, Income, and Expenses Summary */}
            <Section className="my-6 rounded-2xl bg-blue-100 p-8 text-center">
              <Heading className="m-0 text-3xl font-medium text-blue-800">
                Financial Summary
              </Heading>
              <Row className="mt-5">
                <Column className="w-1/3 text-center">
                  <Text className="text-sm font-medium text-blue-600">
                    Total Budget
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    ${totalBudgetAmount}
                  </Text>
                </Column>
                <Column className="w-1/3 text-center">
                  <Text className="text-sm font-medium text-green-600">
                    Total Income
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    ${totalIncomeAmount}
                  </Text>
                </Column>
                <Column className="w-1/3 text-center">
                  <Text className="text-sm font-medium text-red-600">
                    Total Expenses
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    ${totalExpenseAmount}
                  </Text>
                </Column>
              </Row>
              <Hr className="mt-6" style={{ borderColor: "#2563EB" }} />
            </Section>

            {/* Largest Budget & Highest Expense */}
            <Section className="my-6 rounded-2xl bg-orange-100 p-8 text-center">
              <Heading className="m-0 text-3xl font-medium text-orange-800">
                Top Financial Highlights
              </Heading>
              <Row className="mt-5">
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-orange-600">
                    Largest Budget
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    ${largestBudget}
                  </Text>
                </Column>
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-red-600">
                    Highest Expense
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    ${highestExpense}
                  </Text>
                </Column>
              </Row>
              <Hr className="mt-6" style={{ borderColor: "#EA580C" }} />
            </Section>

            {/* Savings & Debt Analysis */}
            <Section className="my-6 rounded-2xl bg-green-100 p-8 text-center">
              <Heading className="m-0 text-3xl font-medium text-green-800">
                Savings & Debt
              </Heading>
              <Row className="mt-5">
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-green-600">
                    Savings
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    ${savings}
                  </Text>
                </Column>
                <Column className="w-1/2 text-center">
                  <Text className="text-sm font-medium text-gray-700">
                    Income Saved
                  </Text>
                  <Text className="my-1 text-4xl font-bold text-gray-900">
                    {incomeSavedPercentage}%
                  </Text>
                </Column>
              </Row>
              <Hr className="mt-6" style={{ borderColor: "#10B981" }} />
            </Section>

            {/* Expense Breakdown */}
            <Section className="my-6 rounded-2xl bg-gray-100 p-8 text-center">
              <Heading className="m-0 text-3xl font-medium text-gray-800">
                Expense Breakdown
              </Heading>
              {expensesList.map((expense, index) => (
                <Row key={index} className="mt-4">
                  <Column>
                    <Text className="text-lg font-medium text-gray-900">
                      {expense.budgetName}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Category: {expense.category} | Amount: ${expense.amount} |{" "}
                      {expense.date}
                    </Text>
                    <Text className="text-sm italic text-gray-500">
                      "{expense.description}"
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Financial Suggestions */}
            <Section className="my-6 rounded-2xl bg-yellow-100 p-8 text-center">
              <Heading className="m-0 text-3xl font-medium text-yellow-800">
                Financial Insights
              </Heading>
              <Text className="text-lg text-gray-900">
                {FinancialInsights(savings, debtToIncomeRatio)}
              </Text>
            </Section>

            <Section className="pb-6 text-center">
              <Text className="text-xl leading-8 text-gray-900">
                Stay financially smart! <br />
                See you next month!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
