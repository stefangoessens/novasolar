import React, { useState, useEffect, useRef } from 'react';

// Lazy-loaded video component with optimization
const LazyVideo = ({ src, ariaLabel, className }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoRef.current) {
            // Load the video when it comes into view
            videoRef.current.src = src;
            videoRef.current.load();
            // Disconnect after loading
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const node = containerRef.current; // Store ref value
    if (node) {
      observer.observe(node);
    }
    
    return () => {
      if (node) { // Use stored value in cleanup
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [src]);
  
  return (
    <div ref={containerRef} className={className || "absolute inset-0"}>
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={ariaLabel}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default React.memo(LazyVideo);