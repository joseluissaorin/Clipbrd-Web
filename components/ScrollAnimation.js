"use client";

import { useEffect, useRef } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';

const ScrollAnimation = ({ children, className = "" }) => {
  const elementRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    // On mobile, immediately show content without animations
    if (isMobile) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.filter = 'none';
      return;
    }

    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px',
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMobile]);

  // Early return during SSR
  if (typeof window === 'undefined') {
    return (
      <div className={`opacity-100 ${className}`}>
        {children}
      </div>
    );
  }

  // On mobile, use minimal classes and reduce spacing
  const mobileClasses = isMobile 
    ? 'opacity-100' 
    : 'opacity-0 blur-sm translate-y-2 transition-all duration-500 ease-out';

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