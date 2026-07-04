import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Define your mobile breakpoint (matches Tailwind's 'md' breakpoint)
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    // 2. Set the initial value on the client
    setIsMobile(mediaQuery.matches);

    // 3. Create an event listener to update state on resize
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    // 4. Attach listener
    mediaQuery.addEventListener("change", handleResize);

    // 5. Cleanup on unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isMobile;
}

/**
 * True when the viewport is at least Tailwind's `lg` breakpoint (>=1024px).
 * Used to decide between the bottom navigation bar and the vertical rail:
 * the bottom bar covers everything below `lg` (mobile + tablet), the rail
 * takes over from `lg` upward.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = () => {
      setIsDesktop(mediaQuery.matches);
    };
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isDesktop;
}
