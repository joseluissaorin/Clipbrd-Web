"use client";

import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      const updateMatch = (e) => {
        setMatches(e.matches);
      };

      // Set initial value
      setMatches(media.matches);

      // Add listener
      if (media.addListener) {
        media.addListener(updateMatch);
      } else {
        media.addEventListener('change', updateMatch);
      }

      // Cleanup
      return () => {
        if (media.removeListener) {
          media.removeListener(updateMatch);
        } else {
          media.removeEventListener('change', updateMatch);
        }
      };
    }
  }, [query]);

  return matches;
};

export default useMediaQuery; 