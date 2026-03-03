import { NextRequest } from "next/server";

// Store connected clients for SSE
const clients = new Set<ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Add this client to the set
      clients.add(controller);

      // Send initial connection message
      controller.enqueue(encoder.encode(`data: {"type":"connected"}\n\n`));

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        clients.delete(controller);
      });
    },
    cancel() {
      // Client disconnected
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Function to broadcast to all connected clients
export function broadcastNotification(notification: any) {
  const encoder = new TextEncoder();
  const data = JSON.stringify({
    type: "NEW_NOTIFICATION",
    notification,
  });

  for (const controller of clients) {
    try {
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
    } catch {
      clients.delete(controller);
    }
  }
}
