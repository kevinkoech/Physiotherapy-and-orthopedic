import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, imageUrl, targetRole, senderId } = body;

    if (!title || !message || !senderId) {
      return NextResponse.json(
        { error: "Title, message, and sender ID are required" },
        { status: 400 }
      );
    }

    // Verify sender is admin or trainer
    const sender = await db.query.users.findFirst({
      where: eq(users.id, senderId),
    });

    if (!sender || (sender.role !== "admin" && sender.role !== "trainer")) {
      return NextResponse.json(
        { error: "Only admins and trainers can send notifications" },
        { status: 403 }
      );
    }

    // Create notification in database
    const result = await db.insert(notifications).values({
      title,
      message,
      imageUrl: imageUrl || null,
      targetRole: targetRole || "all",
      senderId,
      read: 0,
    }).returning({ id: notifications.id });

    // Note: In a production environment, you would use a push service like
    // Firebase Cloud Messaging or Web Push with VAPID keys to send notifications.
    // For this demo, notifications are stored in the database and fetched by clients.
    
    return NextResponse.json({
      success: true,
      notificationId: result[0].id,
      message: "Notification sent successfully"
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
