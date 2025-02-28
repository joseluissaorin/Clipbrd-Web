"use client";

import { useState, useEffect } from "react";

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Safely handle browsers without matchMedia support
    if (typeof window === 'undefined' || !window.matchMedia) {
      console.warn('matchMedia not supported');
      return undefined;
    }
    
    try {
      const media = window.matchMedia(query);
      
      // Initial check
      setMatches(media.matches);

      // Create handler function
      const listener = (e) => {
        setMatches(e.matches);
      };

      // Add listener with compatibility check
      if (media.addEventListener) {
        media.addEventListener("change", listener);
      } else if (media.addListener) {
        // For older browsers
        media.addListener(listener);
      }

      // Cleanup function
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener("change", listener);
        } else if (media.removeListener) {
          // For older browsers
          media.removeListener(listener);
        }
      };
    } catch (err) {
      console.error('Error in useMediaQuery:', err);
      return undefined;
    }
  }, [query]);

  // Don't return any value until mounted to avoid hydration mismatch
  return mounted ? matches : false;
}; 