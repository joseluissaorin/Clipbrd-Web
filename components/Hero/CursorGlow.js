"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const CursorGlow = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());
  
  // Exit early for mobile or iOS devices
  if (isMobile || isIOSDevice) return null;

  return <DesktopCursorGlow />;
};

// Separate component for desktop to avoid any setup code running on mobile/iOS
const DesktopCursorGlow = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 150);
      cursorY.set(e.clientY - 150);
    };
    
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="absolute pointer-events-none w-[5px] h-[5px] rounded-full bg-primary/5"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        scale: 60,
        filter: "blur(60px)",
      }}
    />
  );
}; 