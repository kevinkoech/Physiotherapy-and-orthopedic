import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Import the broadcast function - we'll inline it to avoid circular imports
function broadcastToSSE(data: any) {
  // This is a simplified version - in production you'd use Redis pub/sub or similar
  // For now, clients will poll and use BroadcastChannel
  console.log("[SSE Broadcast]", data);
}

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
    }).returning({ id: notifications.id, createdAt: notifications.createdAt });

    const notification = result[0];

    // Broadcast to all clients using the API response
    // In production, you'd use WebSockets or Server-Sent Events
    // For now, clients will poll or use BroadcastChannel
    
    return NextResponse.json({
      success: true,
      notificationId: notification.id,
      createdAt: notification.createdAt,
      message: "Notification sent successfully to all users"
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
