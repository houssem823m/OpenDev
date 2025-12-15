"use client";

import { useEffect } from "react";

/**
 * KeepAlive component that periodically pings the health endpoint
 * to prevent Render from putting the service to sleep.
 * 
 * Render free tier services sleep after 15 minutes of inactivity.
 * This component pings every 10 minutes to keep the service active.
 */
export default function KeepAlive() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Ping interval: 10 minutes (600,000 ms)
    // Render sleeps after 15 minutes, so 10 minutes is safe
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Function to ping the health endpoint
    const pingServer = async () => {
      try {
        // Only ping if the page is visible (not in background tab)
        if (document.visibilityState === "visible") {
          const response = await fetch("/api/health", {
            method: "GET",
            cache: "no-store",
          });
          
          if (response.ok) {
            console.log("[KeepAlive] Server ping successful");
          } else {
            console.warn("[KeepAlive] Server ping returned non-OK status:", response.status);
          }
        }
      } catch (error) {
        // Silently fail - don't spam console with errors
        // This is expected if the server is sleeping and will wake up on next ping
        console.debug("[KeepAlive] Ping failed (this is normal if server is sleeping):", error);
      }
    };

    // Ping immediately on mount (if page is visible)
    if (document.visibilityState === "visible") {
      pingServer();
    }

    // Set up interval to ping every 10 minutes
    const intervalId = setInterval(pingServer, PING_INTERVAL);

    // Also ping when page becomes visible again (user switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        pingServer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

