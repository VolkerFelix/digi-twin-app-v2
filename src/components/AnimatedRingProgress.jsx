import React, { useState, useEffect } from 'react';

const AnimatedRingProgress = ({ 
  startPercentage, 
  endPercentage, 
  size = 80, 
  strokeWidth = 8, 
  color = '#3B82F6',
  duration = 1.5, // animation duration in seconds
  icon,
  label
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(startPercentage);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;
  
  // Set up animation when component mounts or when end percentage changes
  useEffect(() => {
    // Start at the initial percentage
    setCurrentPercentage(startPercentage);
    
    // Animate to the end percentage
    const animationStartTime = Date.now();
    const animationDuration = duration * 1000; // convert to milliseconds
    
    const animateProgress = () => {
      const elapsedTime = Date.now() - animationStartTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      // Use easeOutQuad easing function for smoother animation
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      // Calculate the current percentage based on animation progress
      const currentValue = startPercentage + 
        (endPercentage - startPercentage) * easedProgress;
      
      setCurrentPercentage(currentValue);
      
      // Continue the animation until complete
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    // Start the animation
    requestAnimationFrame(animateProgress);
    
    // Cleanup function to handle component unmounting during animation
    return () => {
      // No specific cleanup needed for requestAnimationFrame
    };
  }, [startPercentage, endPercentage, duration]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-ring"
            style={{ '--final-offset': strokeDashoffset }}
          />
        </svg>
        
        {/* Center content (icon or percentage) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {icon ? (
            <div style={{ color }}>{icon}</div>
          ) : (
            <div className="text-lg font-bold" style={{ color }}>
              {Math.round(currentPercentage)}%
            </div>
          )}
        </div>
      </div>
      
      {/* Label below the ring */}
      {label && (
        <div className="mt-2 text-sm font-medium text-center">{label}</div>
      )}
    </div>
  );
};

export default AnimatedRingProgress;