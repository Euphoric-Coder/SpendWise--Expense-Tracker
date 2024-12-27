// api/budgets/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getBudgetInfo } from "@/utils/budget";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.emailAddresses[0].emailAddress) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const budgets = await getBudgetInfo(user?.emailAddresses[0].emailAddress);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}
