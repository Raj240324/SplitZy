import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

// Initialize Firebase configuration from environment variables
// Added VITE_FIREBASE_MEASUREMENT_ID for GA4 support
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

/**
 * Lazy-loaded Analytics Promise
 * 
 * Why this approach?
 * 1. Lighthouse: Loading Firebase Analytics and gtag.js synchronously can block the main thread and hurt TBT.
 * 2. PWA/Safari: isSupported() ensures we don't crash on older browsers or if IndexedDB is blocked.
 * 3. Performance: We load the heavy analytics SDK only when needed (after hydration/first paint).
 */
export const analyticsPromise = (async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;

  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const supported = await isSupported();
    
    if (supported) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.warn("Firebase Analytics failed to initialize:", error);
    return null;
  }
})();