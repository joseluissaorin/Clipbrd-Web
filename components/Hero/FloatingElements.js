"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const FloatingElement = ({ delay, className, hover = false }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());
  const controls = useAnimationControls();

  const animation = isIOSDevice
    ? {
        opacity: [0.15, 0.2, 0.15],
      }
    : isMobile
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
    duration: isIOSDevice ? 10 : isMobile ? 15 : 20,
    delay,
    repeat: Infinity,
    ease: "linear",
  };

  const baseSize = isIOSDevice ? "5px" : "100%";
  const scale = isIOSDevice ? 20 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: isIOSDevice ? scale : 0 }}
      animate={animation}
      transition={transition}
      onMouseEnter={
        !isMobile && !isIOSDevice && hover
          ? () => controls.start({ scale: scale * 1.2, opacity: 0.3 })
          : undefined
      }
      onMouseLeave={
        !isMobile && !isIOSDevice && hover
          ? () => controls.start({ scale, opacity: 0.2 })
          : undefined
      }
      style={{
        width: baseSize,
        height: baseSize,
        scale,
        filter: isIOSDevice ? "blur(30px)" : undefined,
      }}
      className={`absolute rounded-full mix-blend-screen transition-transform duration-300 ${className}`}
    />
  );
};

export const FloatingElements = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());

  if (isMobile && !isIOSDevice) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0" 
        style={{
          backdropFilter: isIOSDevice ? undefined : "blur(100px)",
          backgroundColor: isIOSDevice ? "rgba(255, 255, 255, 0.8)" : undefined,
        }}
      />
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