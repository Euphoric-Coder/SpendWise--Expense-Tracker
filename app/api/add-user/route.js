import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import BudgetEaseWelcomeEmail from "@/emails/welcomeTemplate";
import { db } from "@/utils/dbConfig";
import { Users } from "@/utils/schema";
import { sendEmail } from "@/utils/sendEmail";

// Add user to DB
export async function POST() {
  try {
    const user = await currentUser();

    const email = user.emailAddresses[0]?.emailAddress;
    const fullName = user.firstName + " " + (user.lastName || "");

    // Check if user exists in DB
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));

    if (existingUser.length === 0) {
      // Insert new user in DB
      await db.insert(Users).values({
        email,
        name: fullName,
      });

      // Send Welcome Email
      await sendEmail({
        from: "BudgetEase Team <donot_reply@budgetease.in>",
        to: email,
        replyTo: "BudgetEase Support <support@budgetease.in>",
        subject:
          "Welcome to BudgetEase! 🚀 Ready to Take Control of Your Finances?",
        react: BudgetEaseWelcomeEmail({
          username: user.firstName.split(" ")[0],
        }),
      });

    }

    return NextResponse.json({ message: "User initialized successfully" });
  } catch (error) {
    console.error("Error adding user to DB:", error);
    return NextResponse.json(
      { error: "Failed to add user to DB" },
      { status: 500 }
    );
  }
}
