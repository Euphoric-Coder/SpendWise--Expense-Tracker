import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getIncomeInfo } from "@/utils/userAppData";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.emailAddresses[0].emailAddress) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const incomes = await getIncomeInfo(user?.emailAddresses[0].emailAddress);
    return NextResponse.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return NextResponse.json(
      { error: "Failed to fetch incomes" },
      { status: 500 }
    );
  }
}


