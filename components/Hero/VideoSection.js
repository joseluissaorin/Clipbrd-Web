"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";
import config from "@/config";
import { SmartLearningTag } from "./SmartLearningTag";

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Lazy load the OptimizedVideo component for all devices
const OptimizedVideo = dynamic(() => import("./OptimizedVideo").then(mod => mod.OptimizedVideo), {
  loading: () => (
    <div className="w-full aspect-video bg-gray-100 animate-pulse rounded-lg">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  ),
  ssr: false,
});

export const VideoSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());

  // We'll use a simplified animation for iOS but still show the actual video player
  const animationProps = isIOSDevice 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 0.9 } };

  return (
    <motion.div
      {...animationProps}
      className="w-full h-full max-w-5xl mx-auto flex items-center"
    >
      <div 
        className="relative w-full h-full rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(83, 236, 159, 0.05), transparent)",
        }}
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        <OptimizedVideo
          src={`${config.hero.videoPath}.webm`}
          fallbackSrc={`${config.hero.videoPath}.mp4`}
          poster={config.hero.posterPath}
          className="w-full h-full object-cover"
          // On iOS, we don't autoplay as it requires user interaction
          autoPlay={!isIOSDevice}
          loop={true}
          muted={true}
          playsInline={true}
        />
        <SmartLearningTag />
      </div>
    </motion.div>
  );
};