"use client";

import { useEffect, useRef } from 'react';

const ScrollAnimation = ({ children, className = "" }) => {
  const elementRef = useRef(null);

  useEffect(() => {
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

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={elementRef} 
        className={`opacity-0 blur-sm translate-y-4 transition-all duration-1000 ease-out ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default ScrollAnimation; 