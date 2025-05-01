import React from 'react';
import { 
  Heart, 
  Battery, 
  Brain, 
  Activity 
} from 'lucide-react';

const HealthPanel = ({ 
  overallHealth = 75, 
  healthScore = 70, 
  energyScore = 65, 
  cognitiveScore = 80, 
  stressScore = 45 
}) => {
  // Calculate overall avatar state based on scores
  const avatarState = getAvatarState(overallHealth, stressScore);
  
  // Get background image based on avatar state
  const bgImage = getAvatarImage(avatarState);
  
  // Get colors for each metric
  const healthColor = getMetricColor(healthScore);
  const energyColor = getMetricColor(energyScore);
  const cognitiveColor = getMetricColor(cognitiveScore);
  const stressColor = getMetricColor(100 - stressScore); // Invert stress (higher is worse)
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="text-lg font-semibold p-4 bg-indigo-700 text-white flex justify-between items-center">
        <span>Digital Twin Health</span>
        <span className="text-xl">{overallHealth}%</span>
      </div>
      
      <div className="p-6 relative min-h-56">
        {/* Background avatar image that changes with state */}
        <div 
          className="absolute inset-0 opacity-20 bg-center bg-cover transition-opacity duration-500"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        
        {/* Main content */}
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            {/* Health ring */}
            <div className="flex flex-col items-center">
              <RingProgress 
                percentage={healthScore} 
                size={100} 
                color={healthColor}
                icon={<Heart className="h-8 w-8" />}
              />
              <div className="mt-2 text-center">
                <div className="font-medium">Health</div>
                <div className="text-2xl font-bold">{healthScore}%</div>
              </div>
            </div>
            
            {/* Energy ring */}
            <div className="flex flex-col items-center">
              <RingProgress 
                percentage={energyScore} 
                size={100} 
                color={energyColor}
                icon={<Battery className="h-8 w-8" />}
              />
              <div className="mt-2 text-center">
                <div className="font-medium">Energy</div>
                <div className="text-2xl font-bold">{energyScore}%</div>
              </div>
            </div>
            
            {/* Cognitive ring */}
            <div className="flex flex-col items-center">
              <RingProgress 
                percentage={cognitiveScore} 
                size={100} 
                color={cognitiveColor}
                icon={<Brain className="h-8 w-8" />}
              />
              <div className="mt-2 text-center">
                <div className="font-medium">Cognitive</div>
                <div className="text-2xl font-bold">{cognitiveScore}%</div>
              </div>
            </div>
            
            {/* Stress ring */}
            <div className="flex flex-col items-center">
              <RingProgress 
                percentage={100 - stressScore} 
                size={100} 
                color={stressColor}
                icon={<Activity className="h-8 w-8" />}
              />
              <div className="mt-2 text-center">
                <div className="font-medium">Stress</div>
                <div className="text-2xl font-bold">{stressScore}%</div>
              </div>
            </div>
          </div>
          
          {/* Current state description */}
          <div className="mt-6 p-3 rounded-lg bg-gray-100 text-center">
            {getStateDescription(avatarState)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Ring Progress component for health metrics
const RingProgress = ({ percentage, size, color, icon }) => {
  const radius = size / 2;
  const circumference = 2 * Math.PI * (radius - 10);
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={radius - 10}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        
        {/* Progress circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - 10}
          fill="transparent"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Icon in the center */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ color }}
      >
        {icon}
      </div>
    </div>
  );
};

// Helper functions to determine avatar appearance and descriptions

function getAvatarState(overallHealth, stressScore) {
  if (overallHealth < 40) return 'poor';
  if (overallHealth > 80) return 'excellent';
  if (stressScore > 70) return 'stressed';
  return 'average';
}

function getAvatarImage(state) {
  // In a real app, these would be actual image paths
  const images = {
    excellent: '/avatar-excellent.png',
    average: '/avatar-average.png',
    stressed: '/avatar-stressed.png',
    poor: '/avatar-poor.png',
  };
  
  // For demo purposes, using placeholder images
  return images[state] || '/avatar-average.png';
}

function getMetricColor(value) {
  if (value >= 80) return '#10B981'; // Green for excellent
  if (value >= 60) return '#3B82F6'; // Blue for good
  if (value >= 40) return '#F59E0B'; // Amber for average
  return '#EF4444'; // Red for poor
}

function getStateDescription(state) {
  const descriptions = {
    excellent: "Your Digital Twin is thriving! All systems are functioning optimally.",
    average: "Your Digital Twin is doing fine, but there's room for improvement in some areas.",
    stressed: "Your Digital Twin is under significant stress. Consider relaxation strategies.",
    poor: "Your Digital Twin needs immediate attention. Multiple systems require care."
  };
  
  return descriptions[state] || descriptions.average;
}

export default HealthPanel;