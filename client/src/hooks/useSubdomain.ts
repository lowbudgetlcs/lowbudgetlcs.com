import { useMemo } from "react";

export const useSubdomain = () => {
  const subdomain = useMemo(() => {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length > 2 && parts[0] !== "www") {
      return parts[0];
    }
    return null; // No subdomain found
  }, []);

  return subdomain;
};
