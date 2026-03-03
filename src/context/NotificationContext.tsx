"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

interface Notification {
  id: number;
  title: string;
  message: string;
  imageUrl: string | null;
  targetRole: string;
  senderId: number;
  createdAt: Date;
  read: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  sendNotification: (title: string, message: string, imageUrl?: string, targetRole?: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        })));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, read: true }),
      });
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: 1 } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const sendNotification = async (
    title: string, 
    message: string, 
    imageUrl?: string, 
    targetRole?: string
  ): Promise<boolean> => {
    if (!user || (user.role !== "admin" && user.role !== "trainer")) {
      return false;
    }

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          imageUrl: imageUrl || null,
          targetRole: targetRole || "all",
          senderId: user.id,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Broadcast to all open tabs immediately
        broadcastChannel?.postMessage({
          type: "NEW_NOTIFICATION",
          notification: {
            id: data.notificationId,
            title,
            message,
            imageUrl,
            targetRole: targetRole || "all",
            senderId: user.id,
            createdAt: new Date().toISOString(),
            read: 0,
          },
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  };

  // BroadcastChannel for real-time notifications across tabs
  const broadcastChannel = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new BroadcastChannel('notifications');
  }, []);

  // SSE connection for real-time notifications
  useEffect(() => {
    if (typeof window === "undefined" || !user) return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      eventSource = new EventSource('/api/notifications/stream');
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_NOTIFICATION') {
            const newNotification = {
              ...data.notification,
              createdAt: new Date(data.notification.createdAt),
              read: 0,
            };
            setNotifications(prev => {
              if (prev.some(n => n.id === newNotification.id)) return prev;
              return [newNotification, ...prev];
            });
            
            // Show browser notification if permitted
            if (Notification.permission === "granted") {
              new Notification(data.notification.title, {
                body: data.notification.message,
                icon: "/icons/icon-192.png",
              });
            }
          }
        } catch (e) {
          // Ignore parse errors (e.g., heartbeat)
        }
      };
      
      eventSource.onerror = () => {
        eventSource?.close();
        // Reconnect after 5 seconds
        reconnectTimeout = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      eventSource?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [user]);

  // Listen for messages from service worker
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "NEW_NOTIFICATION") {
        const newNotification = {
          ...event.data.notification,
          createdAt: new Date(event.data.notification.createdAt),
          read: 0,
          senderId: user?.id || 0,
          targetRole: "all",
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification(event.data.notification.title, {
            body: event.data.notification.message,
            icon: "/icons/icon-192.png",
          });
        }
      }
    };

    // Listen for BroadcastChannel messages (real-time from other tabs)
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "NEW_NOTIFICATION") {
        const newNotification = {
          ...event.data.notification,
          createdAt: new Date(event.data.notification.createdAt),
          read: 0,
        };
        setNotifications(prev => {
          // Avoid duplicates
          if (prev.some(n => n.id === newNotification.id)) return prev;
          return [newNotification, ...prev];
        });
        
        // Show browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification(event.data.notification.title, {
            body: event.data.notification.message,
            icon: "/icons/icon-192.png",
          });
        }
      }
    };

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Register for service worker messages
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage);
    }

    // Listen for BroadcastChannel messages
    broadcastChannel?.addEventListener("message", handleBroadcast);

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      }
      broadcastChannel?.removeEventListener("message", handleBroadcast);
    };
  }, [user, broadcastChannel]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
