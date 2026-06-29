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
