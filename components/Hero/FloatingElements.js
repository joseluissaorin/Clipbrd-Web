"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Simplified static element for iOS to avoid memory issues
const StaticElement = ({ className }) => (
  <div className={`absolute rounded-full opacity-20 mix-blend-screen ${className}`} />
);

const FloatingElement = ({ delay, className, hover = false }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());
  const controls = useAnimationControls();

  // For iOS, don't bother with animations - just return a static element
  if (isIOSDevice) {
    return <StaticElement className={className} />;
  }

  const animation = isMobile
    ? {
        opacity: [0.15, 0.2, 0.15],
        scale: 1,
      }
    : {
        opacity: [0.15, 0.2, 0.15],
        scale: [1, 1.02, 1],
        rotate: [0, 180, 360],
      };

  const transition = {
    duration: isMobile ? 15 : 20,
    delay,
    repeat: Infinity,
    ease: "linear",
  };

  const baseSize = "100%";
  const scale = 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={animation}
      transition={transition}
      onMouseEnter={
        !isMobile && hover
          ? () => controls.start({ scale: scale * 1.2, opacity: 0.3 })
          : undefined
      }
      onMouseLeave={
        !isMobile && hover
          ? () => controls.start({ scale, opacity: 0.2 })
          : undefined
      }
      style={{
        width: baseSize,
        height: baseSize,
        scale,
      }}
      className={`absolute rounded-full mix-blend-screen transition-transform duration-300 ${className}`}
    />
  );
};

export const FloatingElements = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());

  // For iOS, return a much simpler version with reduced effects
  if (isIOSDevice) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white/80" />
        <StaticElement className="bg-primary/10 w-[100vw] h-[100vh] -top-[10vh] -left-[10vw]" />
        <StaticElement className="bg-secondary/10 w-[100vw] h-[100vh] -top-[5vh] -right-[10vw]" />
        <StaticElement className="bg-accent/10 w-[80vw] h-[80vh] top-[20vh] left-1/4" />
      </div>
    );
  }

  // For non-iOS mobile, don't render at all
  if (isMobile) return null;

  // For desktop, keep the full effect
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      <FloatingElement
        delay={0}
        className="bg-primary/10 w-[150vw] h-[150vh] -top-[50vh] -left-[50vw]"
        hover
      />
      <FloatingElement
        delay={5}
        className="bg-secondary/10 w-[150vw] h-[150vh] -top-[40vh] -right-[60vw]"
        hover
      />
      <FloatingElement
        delay={2}
        className="bg-accent/10 w-[130vw] h-[130vh] -top-[20vh] left-1/4"
        hover
      />
    </div>
  );
}; 