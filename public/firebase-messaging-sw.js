// Firebase Cloud Messaging Service Worker
// Uses importScripts (compat SDK) — ES module `import` is NOT supported in SW scope.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Read Firebase config values from the SW registration URL query parameters.
// These are injected by firebase/config.ts when calling navigator.serviceWorker.register().
// e.g. /firebase-messaging-sw.js?apiKey=xxx&projectId=yyy&...
function getParam(name) {
  try {
    return new URL(self.location.href).searchParams.get(name) || "";
  } catch {
    return "";
  }
}

const firebaseConfig = {
  apiKey: getParam("apiKey"),
  authDomain: getParam("authDomain"),
  projectId: getParam("projectId"),
  storageBucket: getParam("storageBucket"),
  messagingSenderId: getParam("messagingSenderId"),
  appId: getParam("appId"),
};

// Only initialize if we have a valid projectId
if (firebaseConfig.projectId && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

let messaging;
try {
  messaging = firebase.messaging();
} catch (e) {
  console.warn("[firebase-messaging-sw.js] Could not initialize messaging:", e);
}

// Handle background push messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Background message:", payload);

    const title = payload.notification?.title || "PharmaAI Reminder";
    const options = {
      body: payload.notification?.body || "You have a scheduled medication dose pending.",
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: "pharmaai-reminder",
      renotify: true,
      data: payload.data || {},
    };

    self.registration.showNotification(title, options);
  });
}

// Handle notification click — bring the app to foreground
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        return clients.openWindow("/reminders");
      })
  );
});
