import { analyticsPromise } from "@/firebase";
import { logEvent } from "firebase/analytics";
import { useCallback } from "react";

export const useAnalytics = () => {
  /**
   * Safe logEvent wrapper
   * Ensures analytics is supported and initialized before tracking
   */
  const trackEvent = useCallback(async (eventName: string, eventParams?: Record<string, any>) => {
    try {
      const analytics = await analyticsPromise;
      if (analytics) {
        logEvent(analytics, eventName, eventParams);
      }
    } catch (error) {
      // Fail silently in production to prevent app crashes due to tracking issues
      if (import.meta.env.DEV) {
        console.error("Analytics logEvent error:", error);
      }
    }
  }, []);

  /**
   * Helper for page_view tracking
   * Manual tracking is required for SPAs (React Router)
   */
  const trackPageView = useCallback(async (pagePath: string) => {
    trackEvent("page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
  };
};
