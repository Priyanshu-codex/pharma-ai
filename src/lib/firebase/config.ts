import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton Firebase App Initialization
export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

// FCM Messaging Helper for Client Side
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("FCM: Web Push notifications not supported in this browser environment.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("FCM: Notification permission denied by user.");
      return null;
    }

    const app = getFirebaseApp();
    const messaging: Messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!vapidKey) {
      console.warn("FCM: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing.");
      return null;
    }

    // Register the SW with Firebase config as query params so the SW can initialize
    // without ES module imports (which are unsupported in SW context).
    const swParams = new URLSearchParams({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    });

    const swUrl = `/firebase-messaging-sw.js?${swParams.toString()}`;
    const serviceWorkerRegistration = await navigator.serviceWorker.register(swUrl, {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    if (token) {
      localStorage.setItem("pharmaai_fcm_token", token);
      console.log("FCM: Token generated successfully.", token.substring(0, 10) + "...");
      // Save token to backend database asynchronously
      import("@/lib/supabase/data-service").then(({ saveFCMTokenToDB }) => {
        saveFCMTokenToDB(token);
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error("FCM: Error retrieving token:", error);
    return null;
  }
}

// Foreground Message Listener
export function onForegroundMessage(callback: (payload: unknown) => void) {
  if (typeof window === "undefined" || !("Notification" in window)) return () => {};

  try {
    const app = getFirebaseApp();
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      console.log("FCM Foreground message received:", payload);
      callback(payload);
    });
  } catch (err) {
    console.error("FCM: Failed to attach foreground listener:", err);
    return () => {};
  }
}
