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
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export default function BudgetEaseWelcomeEmail({ username = "John" }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to BudgetEase - Your Smart Expense Tracker!</Preview>
      <Tailwind>
        <Body className="bg-[#f8f9fa] font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-6 text-center bg-white shadow-md rounded-lg">
            {/* Logo */}
            <Section>
              <Img
                src="https://res.cloudinary.com/dltoavydo/image/upload/v1741564253/favicon_h2rmbt.png"
                width="60"
                height="60"
                alt="BudgetEase Logo"
                className="mx-auto"
              />
            </Section>

            {/* Welcome Message */}
            <Section className="mt-4">
              <Text className="text-3xl font-extrabold text-[#a63b00]">
                Welcome, {username}! 🎉
              </Text>
              <Text className="text-lg text-gray-700 mt-2 leading-relaxed">
                We're thrilled to have you join <strong>BudgetEase</strong>,
                your go-to platform for managing expenses and tracking finances
                effortlessly.
              </Text>
              <Text className="text-lg text-gray-700 mt-2 leading-relaxed">
                Stay in control of your spending, set budgets, and gain insights
                into your financial health.
              </Text>
            </Section>

            {/* Call-to-Action Button */}
            <Section className="mt-6">
              <Button
                href={`${WEBSITE_URL}/dashboard`}
                className="bg-[#FF6B00] text-white text-lg font-bold px-6 py-3 rounded-lg inline-block shadow-md"
              >
                Start Tracking Expenses
              </Button>
            </Section>

            {/* Support & Closing Text */}
            <Section className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mt-4">
                Happy budgeting! <br />
                The BudgetEase Team
              </Text>
            </Section>

            {/* Support & Contact */}
            <Section className="mt-8 bg-[#fffaeb] p-6 rounded-lg">
              <Text className="text-xl font-bold text-[#a63b00]">
                Need Help? Contact Us!
              </Text>
              <Text className="text-lg text-gray-700 mt-2">
                Our team is here to assist you. Reach out anytime at:
              </Text>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-2xl font-bold text-[#FF6B00] bg-gray-100 px-4 py-2 rounded-lg inline-block mt-3 shadow-md hover:bg-gray-200 transition"
              >
                {SUPPORT_EMAIL}
              </a>
            </Section>

            {/* Footer */}
            <Hr className="my-6 border-gray-300" />
            <Text className="text-sm text-gray-500">
              © {new Date().getFullYear()} BudgetEase Expense Inc. All Rights
              Reserved.
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
