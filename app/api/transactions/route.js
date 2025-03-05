import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getTransactionInfo } from "@/utils/userAppData";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.emailAddresses[0].emailAddress) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const transactions = await getTransactionInfo(user?.emailAddresses[0].emailAddress);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}


