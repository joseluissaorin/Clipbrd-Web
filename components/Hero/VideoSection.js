"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";
import config from "@/config";
import { SmartLearningTag } from "./SmartLearningTag";
import Image from "next/image";

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Lazy load the OptimizedVideo component only for non-iOS
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

// Simplified static component for iOS
const StaticIOSVideo = ({ posterPath }) => (
  <div className="relative w-full h-full rounded-lg overflow-hidden">
    <Image
      src={posterPath}
      alt="Feature showcase"
      width={1920}
      height={1080}
      className="w-full h-full object-cover rounded-lg"
      priority
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-white ml-1"
        >
          <path
            fillRule="evenodd"
            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);

export const VideoSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());

  // For iOS, use a simplified version of the component
  if (isIOSDevice) {
    return (
      <div className="w-full h-full max-w-5xl mx-auto flex items-center">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-white/5">
          <StaticIOSVideo posterPath={config.hero.posterPath} />
          <SmartLearningTag />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
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
          autoPlay
          loop
          muted
          playsInline
        />
        <SmartLearningTag />
      </div>
    </motion.div>
  );
}; 