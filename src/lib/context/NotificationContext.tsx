"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  /** Optional deep-link URL when tapped */
  url?: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (n: Omit<AppNotification, "id" | "time" | "unread">) => void;
}

// ── Context ────────────────────────────────────────────────
const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside <NotificationProvider>");
  }
  return ctx;
}

// ── Seed data (shown before any live FCM arrives) ──────────
const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "seed-1",
    title: "Medication Reminder",
    body: "Time to take Metformin 500mg (1 tablet with water).",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: "seed-2",
    title: "Weekly Adherence Update",
    body: "You hit a 4-day streak! Adherence is at 78%.",
    time: "2 hours ago",
    unread: true,
  },
];

// ── Provider ───────────────────────────────────────────────
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  // Keep a ref so the FCM callback doesn't form a stale closure over notifications
  const notificationsRef = useRef(notifications);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "time" | "unread">) => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const newNotif: AppNotification = {
        id: `fcm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: n.title,
        body: n.body,
        time,
        unread: true,
        url: n.url,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ── Wire FCM foreground listener ───────────────────────
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function setupFCMListener() {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      // Only attach if permission already granted (don't re-prompt here)
      if (Notification.permission !== "granted") return;

      try {
        const { onForegroundMessage } = await import("@/lib/firebase/config");
        unsubscribe = onForegroundMessage((payload: unknown) => {
          const p = payload as {
            notification?: { title?: string; body?: string };
            data?: { url?: string; title?: string; body?: string };
          };

          const title =
            p?.notification?.title ||
            p?.data?.title ||
            "PharmaAI";
          const body =
            p?.notification?.body ||
            p?.data?.body ||
            "You have a new notification.";
          const url = p?.data?.url;

          addNotification({ title, body, url });

          // Also fire a native browser notification if the tab is not focused
          if (document.visibilityState !== "visible") {
            try {
              new Notification(title, {
                body,
                icon: "/icons/icon-192x192.png",
              });
            } catch {
              // Ignore — permission may have changed
            }
          }
        });
      } catch (err) {
        console.warn("[NotificationProvider] FCM listener setup failed:", err);
      }
    }

    setupFCMListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        removeNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
