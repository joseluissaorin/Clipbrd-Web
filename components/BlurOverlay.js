"use client";

import { useEffect, useState } from 'react';

const BlurOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  let scrollTimeout;

  useEffect(() => {
    const handleScroll = () => {
      // Show the overlay when scrolling
      setIsVisible(true);
      
      // Clear the existing timeout
      clearTimeout(scrollTimeout);
      
      // Set a new timeout to hide the overlay after 1 second of no scrolling
      scrollTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={`blur-overlay ${isVisible ? 'visible' : ''}`} />
  );
};

export default BlurOverlay; 