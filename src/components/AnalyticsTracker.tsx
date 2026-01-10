import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

export const AnalyticsTracker = () => {
  const location = useLocation();
  const { trackPageView, trackEvent } = useAnalytics();

  // Handle page_view tracking on route change
  useEffect(() => {
    // We use a small delay or requestAnimationFrame to ensure title is updated
    // and initialization doesn't block critical path
    const handleRouteChange = () => {
      trackPageView(location.pathname + location.search);
    };

    // Tracking app_open only once per session/initial load
    if (window.performance && window.performance.navigation.type === 0) {
      trackEvent("app_open");
    }

    // Delay tracking until the next tick to ensure hydration is complete
    // and title is potentially updated by components
    const timeoutId = setTimeout(handleRouteChange, 100);

    return () => clearTimeout(timeoutId);
  }, [location, trackPageView, trackEvent]);

  // Track PWA installation
  useEffect(() => {
    const handlePWAInstall = () => {
      trackEvent("pwa_installed");
    };

    window.addEventListener("appinstalled", handlePWAInstall);
    return () => window.removeEventListener("appinstalled", handlePWAInstall);
  }, [trackEvent]);

  return null; // This component doesn't render anything
};
