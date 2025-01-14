import { NextResponse } from "next/server";
import { db } from "@/utils/dbConfig";
import { currentUser } from "@clerk/nextjs/server";
import { Notifications } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";

// GET: Fetch all notifications
export async function GET() {
  try {
    const user = await currentUser();

    const notifications = await db
      .select()
      .from(Notifications)
      .where(eq(Notifications.createdFor, user?.emailAddresses[0].emailAddress))
      .orderBy(desc(Notifications.createdAt));

    
    return NextResponse.json(notifications || []);

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH: Update a notification (mark as read)
export async function PATCH(request) {
  try {
    const { id, read } = await request.json();

    // Debug incoming request payload
    console.log("PATCH Request Body:", { id, read });

    if (!id || typeof read !== "boolean") {
      console.error("Invalid request payload");
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Attempt to update the notification
    const result = await db
      .update(Notifications)
      .set({ read })
      .where(eq(Notifications.id, id));

    // Debug query result
    console.log("Query Result:", result);

    return NextResponse.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error.message);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE: Clear all notifications
export async function DELETE() {
  try {
    await db.delete(Notifications).returning();
    return NextResponse.json({
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return NextResponse.json(
      { error: "Failed to clear notifications" },
      { status: 500 }
    );
  }
}
