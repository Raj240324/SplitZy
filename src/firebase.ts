import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize app ONCE
const app = initializeApp(firebaseConfig);

// ✅ EXPORT db (THIS WAS THE ISSUE)
export const db = getFirestore(app);

/**
 * Lazy-loaded Analytics (performance-safe)
 */
export const analyticsPromise = (async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;

  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const supported = await isSupported();

    if (!supported) return null;
    return getAnalytics(app);
  } catch (error) {
    console.warn("Firebase Analytics init failed:", error);
    return null;
  }
})();
