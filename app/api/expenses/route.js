import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getExpensesInfo } from "@/utils/userAppData";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.emailAddresses[0].emailAddress) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const expenses = await getExpensesInfo(user?.emailAddresses[0].emailAddress);
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}


