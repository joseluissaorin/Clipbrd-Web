"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const useIsHighDPIDevice = () => {
  const [isHighDPI, setIsHighDPI] = useState(false);

  useEffect(() => {
    const checkDPI = () => {
      const dpr = window.devicePixelRatio || 1;
      setIsHighDPI(dpr > 1);
    };

    checkDPI();
    window.addEventListener("resize", checkDPI);
    return () => window.removeEventListener("resize", checkDPI);
  }, []);

  return isHighDPI;
};

export const OptimizedVideo = ({
  src,
  fallbackSrc,
  poster,
  className = "",
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = false,
  controls = false,
  priority = false,
  onLoad,
  onError,
}) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isHighDPI = useIsHighDPIDevice();
  const [isIOS] = useState(() => 
    typeof window !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window).MSStream
  );

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay && !isIOS) {
        handlePlay();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleError = (e) => {
      const videoError = e.target.error;
      console.error("Video error:", videoError);
      setError(videoError?.message || "Failed to play video");
      setIsLoading(false);
      onError?.();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, isIOS, onError]);

  const handlePlay = () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    setShowThumbnail(false);
    setError(null);

    try {
      if (isIOS) {
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.load();
      }

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            onLoad?.();
          })
          .catch((error) => {
            console.error("Video playback error:", error);
            setError("Failed to play video. Please try again.");
            setIsLoading(false);
            setShowThumbnail(true);
            onError?.();
          });
      }
    } catch (error) {
      console.error("Video error:", error);
      setError("Video playback error. Please try again.");
      setIsLoading(false);
      setShowThumbnail(true);
      onError?.();
    }
  };

  const handlePause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleVideoClick = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleRetry = async () => {
    setError(null);
    setShowThumbnail(true);
    setIsLoading(true);

    try {
      if (poster) {
        const posterResponse = await fetch(poster, { method: 'HEAD' });
        if (!posterResponse.ok) {
          throw new Error("Failed to load thumbnail");
        }
      }

      const videoResponse = await fetch(src, { method: 'HEAD' });
      if (!videoResponse.ok) {
        throw new Error("Video file not found");
      }

      if (videoRef.current) {
        videoRef.current.load();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load video");
    } finally {
      setIsLoading(false);
    }
  };

  const videoClassName = `
    ${className}
    relative
    w-full
    h-full
    rounded-lg
    overflow-hidden
    ${isLoading ? "animate-pulse" : ""}
  `.trim();

  return (
    <div className={videoClassName}>
      {showThumbnail && poster && (
        <div 
          className="relative h-full cursor-pointer" 
          onClick={handlePlay}
        >
          <Image
            src={poster}
            alt="Video thumbnail"
            width={1920}
            height={1080}
            className="w-full h-full object-cover rounded-lg"
            priority={priority}
            onError={() => setError("Failed to load thumbnail")}
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
      )}

      <video
        ref={videoRef}
        className={`w-full h-full object-cover rounded-lg ${!showThumbnail ? 'block' : 'hidden'}`}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        onClick={handleVideoClick}
      >
        <source src={src} type="video/webm" />
        {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-white rounded-lg text-black hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}; 