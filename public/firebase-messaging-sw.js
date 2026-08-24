import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Firebase config values injected for Service Worker scope
const firebaseConfig = {
  apiKey: self.location ? new URL(self.location.href).searchParams.get("apiKey") || "" : "",
  authDomain: self.location ? new URL(self.location.href).searchParams.get("authDomain") || "" : "",
  projectId: self.location ? new URL(self.location.href).searchParams.get("projectId") || "" : "",
  storageBucket: self.location ? new URL(self.location.href).searchParams.get("storageBucket") || "" : "",
  messagingSenderId: self.location ? new URL(self.location.href).searchParams.get("messagingSenderId") || "" : "",
  appId: self.location ? new URL(self.location.href).searchParams.get("appId") || "" : "",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification?.title || "PharmaAI Medication Reminder";
  const notificationOptions = {
    body: payload.notification?.body || "You have a scheduled dose pending.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
  };

  // @ts-expect-error ServiceWorkerGlobalScope self.registration
  self.registration.showNotification(notificationTitle, notificationOptions);
});
