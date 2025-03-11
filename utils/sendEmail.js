"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY || "");

  try {
    const data = await resend.emails.send({
      from: "BudgetEase Expense Tracker <welcome@budgetease.in>",
      to: "sagnikdey.rouge@gmail.com",
      subject: "Welcome to BudgetEase Expense Tracker",
      react,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
