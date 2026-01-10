import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

export const AnalyticsTracker = () => {
  const location = useLocation();
  const { trackPageView, trackEvent } = useAnalytics();

  // Page view + app open tracking
  useEffect(() => {
    // Track app_open only once per session
    if (!sessionStorage.getItem("app_open_tracked")) {
      trackEvent("app_open");
      sessionStorage.setItem("app_open_tracked", "true");
    }

    // Track page view after paint (no magic delay)
    const rafId = requestAnimationFrame(() => {
      trackPageView(location.pathname + location.search);
    });

    return () => cancelAnimationFrame(rafId);
  }, [location, trackPageView, trackEvent]);

  // Track PWA installation
  useEffect(() => {
    const handlePWAInstall = () => {
      trackEvent("pwa_installed");
    };

    window.addEventListener("appinstalled", handlePWAInstall);
    return () => {
      window.removeEventListener("appinstalled", handlePWAInstall);
    };
  }, [trackEvent]);

  return null;
};
