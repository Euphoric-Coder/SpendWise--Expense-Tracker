import { NextResponse } from "next/server";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";

/**
 * Handle GET requests to fetch all incomes
 */
export async function GET(req) {
  try {
    const incomes = await db.select().from(Incomes);
    return NextResponse.json({ success: true, data: incomes });
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch incomes",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests to add a new income
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      amount,
      icon,
      incomeType,
      frequency,
      startDate,
      endDate,
      createdBy,
    } = body;

    // Validate required fields
    if (!name || !amount || !createdBy) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new income into the database
    const result = await db.insert(Incomes).values({
      name,
      amount,
      icon: icon || "💰", // Default icon if not provided
      incomeType: incomeType || "non-recurring", // Default to non-recurring
      frequency: incomeType === "recurring" ? frequency : null,
      startDate: startDate || new Date().toISOString().split("T")[0], // Default to today for non-recurring
      endDate: incomeType === "non-recurring" ? endDate : null, // Only set for non-recurring
      lastProcessed:
        incomeType === "recurring"
          ? null
          : new Date().toISOString().split("T")[0], // Only for recurring incomes
      createdBy,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add income", error: error.message },
      { status: 500 }
    );
  }
}
