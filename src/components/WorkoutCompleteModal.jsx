import React, { useState, useEffect } from 'react';
import { Trophy, X, ArrowRight, Heart, Battery, Brain, Activity } from 'lucide-react';
import DancingAvatar from './DancingAvatar';
import AnimatedRingProgress from './AnimatedRingProgress';

const WorkoutCompleteModal = ({ 
  isOpen, 
  onClose, 
  improvements = {
    healthScore: 5,
    energyScore: 8,
    cognitiveScore: 3,
    stressScore: -7 // Negative because lower stress is better
  } 
}) => {
  const [animationPhase, setAnimationPhase] = useState('loading');
  
  // Control the animation phases
  useEffect(() => {
    if (isOpen) {
      // Reset to loading when opened
      setAnimationPhase('loading');
      
      // After 2.5 seconds, switch to showing improvements
      const loadingTimeout = setTimeout(() => {
        setAnimationPhase('improvements');
      }, 3000);
      
      return () => clearTimeout(loadingTimeout);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-20"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Loading phase */}
        {animationPhase === 'loading' && (
          <div className="p-6 flex flex-col items-center">
            <div className="text-xl font-bold text-center mb-4">Workout Complete!</div>
            <div className="text-sm text-gray-600 text-center mb-6">
              Updating your digital twin...
            </div>
            
            {/* Dancing avatar animation */}
            <div className="w-32 h-42 mb-6">
              <DancingAvatar />
            </div>
            
            {/* Loading spinner */}
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            
            <div className="text-sm text-indigo-600 animate-pulse">
              Processing health data...
            </div>
          </div>
        )}
        
        {/* Improvements phase */}
        {animationPhase === 'improvements' && (
          <div className="p-6">
            <div className="text-xl font-bold text-center mb-2">
              Digital Twin Updated!
            </div>
            <div className="text-sm text-gray-600 text-center mb-6">
              Your workout has improved your stats:
            </div>
            
            {/* Ring Progress for Improvements */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Health Ring */}
              <AnimatedRingProgress
                startPercentage={improvements.healthScore > 0 ? 100 - improvements.healthScore : 100}
                endPercentage={100}
                color="#10B981" // Green
                icon={<Heart className="h-6 w-6" />}
                label={`Health +${improvements.healthScore}%`}
              />
              
              {/* Energy Ring */}
              <AnimatedRingProgress
                startPercentage={improvements.energyScore > 0 ? 100 - improvements.energyScore : 100}
                endPercentage={100}
                color="#3B82F6" // Blue
                icon={<Battery className="h-6 w-6" />}
                label={`Energy +${improvements.energyScore}%`}
              />
              
              {/* Cognitive Ring */}
              <AnimatedRingProgress
                startPercentage={improvements.cognitiveScore > 0 ? 100 - improvements.cognitiveScore : 100}
                endPercentage={100}
                color="#8B5CF6" // Purple
                icon={<Brain className="h-6 w-6" />}
                label={`Cognitive +${improvements.cognitiveScore}%`}
              />
              
              {/* Stress Ring */}
              <AnimatedRingProgress
                startPercentage={improvements.stressScore < 0 ? 100 + improvements.stressScore : 100}
                endPercentage={100}
                color="#F59E0B" // Amber
                icon={<Activity className="h-6 w-6" />}
                label={`Stress ${improvements.stressScore}%`}
              />
            </div>
            
            {/* Trophy and completion message */}
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-8 w-8 text-amber-500 mr-3" />
              <div className="text-lg font-medium">
                Great job! Keep it up!
              </div>
            </div>
            
            {/* Continue button */}
            <button 
              onClick={onClose}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutCompleteModal;