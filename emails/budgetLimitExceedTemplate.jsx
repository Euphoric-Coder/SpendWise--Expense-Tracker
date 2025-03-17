import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

// Get the website URL from the environment variable
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE;

export default function BudgetLimitExceedEmail({
  username = "John",
  exceededBudgets = [
    {
      budgetId: 1,
      name: "Groceries",
      budgetAmount: 500,
      spentSoFar: 550,
    },
    {
      budgetId: 2,
      name: "Entertainment",
      budgetAmount: 200,
      spentSoFar: 250,
    },
  ],
}) {
  const isSingleBudget = exceededBudgets.length === 1;

  return (
    <Html>
      <Head />
      <Preview>
        {isSingleBudget
          ? `Budget Alert: ${username}, Your ${exceededBudgets[0].name} Budget Is Over Limit!`
          : `Budget Alert: ${username}, You Have Exceeded Multiple Budget Limits!`}
      </Preview>
      <Tailwind>
        <Body className="bg-[#f8f9fa] font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-6 text-center bg-white shadow-lg rounded-xl border border-gray-200">
            {/* Logo */}
            <Section>
              <Img
                src="https://res.cloudinary.com/dltoavydo/image/upload/v1741564253/favicon_h2rmbt.png"
                width="70"
                height="70"
                alt="SpendWise Logo"
                className="mx-auto"
              />
            </Section>

            {/* Header Message */}
            <Section className="mt-4">
              <Text className="text-3xl font-extrabold text-[#FF6B00]">
                Budget Alert, {username}! ⚠️
              </Text>
              <Text className="text-lg text-gray-700 mt-3 leading-relaxed">
                {isSingleBudget
                  ? `Your ${exceededBudgets[0].name} budget has exceeded its limit. Here are the details:`
                  : "Some of your budgets have exceeded their limits. Please review them below."}
              </Text>
            </Section>

            {/* Budget Breakdown */}
            {exceededBudgets.map((budget, index) => {
              const remainingBudget = budget.budgetAmount - budget.spentSoFar;
              const percentageUsed = (
                (budget.spentSoFar / budget.budgetAmount) *
                100
              ).toFixed(1);

              return (
                <Section
                  key={index}
                  className="mt-6 bg-[#fff3cd] p-6 rounded-lg shadow-md"
                >
                  <Text className="text-2xl font-bold text-[#a63b00]">
                    🚨 {budget.name} Budget Exceeded
                  </Text>
                  <Text className="text-lg text-gray-700 mt-3">
                    <strong>Total Budget:</strong> ${budget.budgetAmount}
                  </Text>
                  <Text className="text-lg text-red-600 font-bold">
                    <strong>Spent So Far:</strong> ${budget.spentSoFar}
                  </Text>
                  <Text
                    className={`text-lg font-bold ${remainingBudget < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    <strong>Remaining Budget:</strong> $
                    {remainingBudget > 0 ? remainingBudget : 0}
                  </Text>
                  <Text className="text-lg font-semibold text-orange-600">
                    <strong>{percentageUsed}% of Budget Used</strong>
                  </Text>
                </Section>
              );
            })}

            {/* Call-to-Action Button */}
            <Section className="mt-6">
              <Button
                href={`${WEBSITE_URL}/dashboard/budgets/`}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold px-6 py-3 rounded-lg inline-block shadow-md hover:shadow-lg transition"
              >
                {isSingleBudget
                  ? "Review Your Budget 🚀"
                  : "Review Your Budgets 🚀"}
              </Button>
            </Section>

            {/* Footer */}
            <Hr className="my-6 border-gray-300" />
            <Text className="text-sm text-gray-500">
              © {new Date().getFullYear()} SpendWise, Inc. All Rights Reserved.
              <br />
              Visit us at{" "}
              <a
                href={WEBSITE_URL}
                className="text-[#FF6B00] font-semibold hover:underline"
              >
                {WEBSITE_URL}
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
