"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

// Add debounce utility function to prevent rapid repeated actions
const useDebounce = (fn, delay) => {
  const timeoutRef = useRef(null);
  
  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedFn;
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
  const [errorCount, setErrorCount] = useState(0);
  const maxErrorRetries = 2; // Limit retries to prevent cascade failures

  // Improved error handling with debounce to prevent rapid retries
  const debouncedHandleError = useDebounce((errorMessage) => {
    console.error("Video error:", errorMessage);
    setError(errorMessage || "Failed to play video");
    setIsLoading(false);
    setShowThumbnail(true);
    setErrorCount(prev => prev + 1);
    onError?.();
  }, 500);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay && !isIOS && errorCount < maxErrorRetries) {
        handlePlay();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleError = (e) => {
      const videoError = e.target.error;
      debouncedHandleError(videoError?.message || "Failed to play video");
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, isIOS, onError, debouncedHandleError, errorCount, maxErrorRetries]);

  // For iOS, preload with empty src to test video capabilities first
  useEffect(() => {
    if (isIOS && videoRef.current) {
      try {
        // Set to a tiny transparent video first to test capabilities
        const testVideo = document.createElement('video');
        testVideo.muted = true;
        testVideo.playsInline = true;
        testVideo.autoplay = false;
        testVideo.style.width = '1px';
        testVideo.style.height = '1px';
        
        // If test succeeds, we'll keep the normal implementation
        testVideo.addEventListener('canplay', () => {
          testVideo.remove();
        });
        
        testVideo.addEventListener('error', () => {
          // If test fails, keep showing the poster image only
          setShowThumbnail(true);
          setError("Video playback not supported on this device");
          testVideo.remove();
        });
        
        // Append to DOM temporarily
        document.body.appendChild(testVideo);
        
        // Clean up in 2 seconds max if no event fires
        setTimeout(() => {
          if (document.body.contains(testVideo)) {
            testVideo.remove();
          }
        }, 2000);
      } catch (error) {
        console.error("iOS video test error:", error);
        // Fallback to showing poster only
        setShowThumbnail(true);
      }
    }
  }, [isIOS]);

  const handlePlay = () => {
    if (!videoRef.current || errorCount >= maxErrorRetries) return;

    setIsLoading(true);
    setShowThumbnail(false);
    setError(null);

    try {
      if (isIOS) {
        // For iOS, ensure these properties are set directly on the element
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        // iOS requires interaction to play, so don't auto-attempt
        // Just load the video ready for user interaction
        videoRef.current.load();
        setIsLoading(false);
        return;
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
            debouncedHandleError("Failed to play video. Please try again.");
          });
      }
    } catch (error) {
      console.error("Video error:", error);
      debouncedHandleError("Video playback error. Please try again.");
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
    if (errorCount >= maxErrorRetries) {
      setError("Too many failed attempts. Please reload the page.");
      return;
    }
    
    setError(null);
    setShowThumbnail(true);
    setIsLoading(true);

    try {
      // Reset video element completely
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
      
      // Small timeout to ensure clean state
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      debouncedHandleError(error instanceof Error ? error.message : "Failed to load video");
    }
  };

  // For iOS, simplify the video UI significantly
  if (isIOS) {
    return (
      <div className={`${className} relative w-full h-full rounded-lg overflow-hidden`}>
        {(showThumbnail || error) && poster && (
          <div className="relative h-full w-full">
            <Image
              src={poster}
              alt="Video thumbnail"
              width={1920}
              height={1080}
              className="w-full h-full object-cover rounded-lg"
              priority={priority}
              onError={() => setError("Failed to load thumbnail")}
            />
            {!error && (
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
            )}
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
            <p className="text-white mb-4">{error}</p>
            {errorCount < maxErrorRetries && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-white rounded-lg text-black hover:bg-gray-100"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

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
          {errorCount < maxErrorRetries && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-white rounded-lg text-black hover:bg-gray-100"
            >
              Retry
            </button>
          )}
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