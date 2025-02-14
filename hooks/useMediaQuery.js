"use client";

import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  // During SSR, default to false
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Set initial value
      setMatches(media.matches);

      // Create event listener function
      const listener = (e) => setMatches(e.matches);

      // Use modern API if available, fallback for older browsers
      if (media.addEventListener) {
        media.addEventListener('change', listener);
      } else {
        media.addListener(listener);
      }

      // Cleanup
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', listener);
        } else {
          media.removeListener(listener);
        }
      };
    }
  }, [query]); // Only re-run if query changes

  return matches;
};

export default useMediaQuery; 