"use client";

import React, { useState, useEffect, useRef } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  priority?: boolean;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  priority = false,
  ...props
}: SafeImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
    setError(false);
  }

  // Check if image is already loaded (handles fast local cache loading before hydration)
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#FAF5EE] dark:bg-[#1c0f0c] ${wrapperClassName}`}>
      {/* Themed Skeleton Shimmer Loader */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 skeleton-loader z-10 w-full h-full" />
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 bg-[#E6DFD3] dark:bg-[#2A1B18] flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-[#7A6A53] dark:text-[#C6BBAA] p-2 text-center">
          Image Unavailable
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
