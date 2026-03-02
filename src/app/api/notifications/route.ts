import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user info
    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId)),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get notifications based on user role
    let userNotifications;
    
    if (user.role === "admin" || user.role === "trainer") {
      // Admin/trainer sees all notifications they sent
      userNotifications = await db.query.notifications.findMany({
        where: eq(notifications.senderId, user.id),
        orderBy: [desc(notifications.createdAt)],
        limit: 50,
      });
    } else {
      // Trainees see notifications targeted to all or trainees
      userNotifications = await db.query.notifications.findMany({
        where: or(
          eq(notifications.targetRole, "all"),
          eq(notifications.targetRole, "trainee")
        ),
        orderBy: [desc(notifications.createdAt)],
        limit: 50,
      });
    }

    return NextResponse.json({
      success: true,
      notifications: userNotifications
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, read } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Mark notification as read
    await db.update(notifications)
      .set({ read: read ? 1 : 0 })
      .where(eq(notifications.id, notificationId));

    return NextResponse.json({
      success: true,
      message: "Notification updated"
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
