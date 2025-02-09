"use client";

import { useEffect, useRef, useState } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const ScrollAnimation = ({ children, className = "" }) => {
  const elementRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (isMobile) {
      // On mobile, immediately show content without animations
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.filter = 'none';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [isMobile]);

  // On mobile, use minimal classes to avoid performance impact
  const mobileClasses = isMobile ? 'opacity-100' : 'opacity-0 blur-sm translate-y-4 transition-all duration-500 ease-out';

  return (
    <div 
      ref={elementRef} 
      className={`${mobileClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation; 