import React, { useState } from 'react';
import { AlertTriangle, Heart, ArrowRight, Check, X, Info } from 'lucide-react';

const LifeChallengesPanel = ({ 
  challenges = [
    {
      id: 'stress-anxiety',
      title: 'Chronic Stress and Anxiety',
      description: "I'm feeling tired and anxious most days. My cortisol levels are consistently elevated and my HRV readings are declining.",
      severity: 'high',
      recommendations: [
        "Try the '4-7-8' breathing technique three times daily",
        "Reduce caffeine intake after 2pm",
        "Schedule two 15-minute breaks during your workday"
      ],
      dataPoints: [
        "Cortisol +42% above baseline",
        "HRV -23% below normal range",
        "Sleep quality declining"
      ],
      resolved: false
    },
    {
      id: 'sleep-disruption',
      title: 'Sleep Disruption',
      description: "My sleep analysis shows frequent nighttime awakenings and reduced deep sleep phases over the past 9 days.",
      severity: 'medium',
      recommendations: [
        "Maintain a consistent sleep/wake schedule",
        "Reduce blue light exposure 90 minutes before bed",
        "Keep bedroom temperature between 65-68°F"
      ],
      dataPoints: [
        "Deep sleep reduced by 18%",
        "5.2 awakenings per night (avg)",
        "Heart rate variability decreasing during sleep"
      ],
      resolved: false
    },
    {
      id: 'recovery-deficit',
      title: 'Exercise Recovery Deficit',
      description: "I'm not recovering properly between workouts. My muscle recovery markers show increasing inflammation.",
      severity: 'low',
      recommendations: [
        "Add an extra rest day between high-intensity workouts",
        "Increase protein intake by 15-20g on training days",
        "Try contrast therapy (hot/cold) for faster recovery"
      ],
      dataPoints: [
        "Recovery score -15% below baseline",
        "Inflammatory markers elevated post-workout",
        "Peak performance declining in successive workouts"
      ],
      resolved: false
    }
  ]
}) => {
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [resolvedChallenges, setResolvedChallenges] = useState({});
  
  // Handle marking a challenge as resolved
  const handleResolveChallenge = (challengeId) => {
    setResolvedChallenges(prev => ({
      ...prev,
      [challengeId]: true
    }));
  };
  
  // Handle dismissing a challenge
  const handleDismissChallenge = (challengeId) => {
    setResolvedChallenges(prev => ({
      ...prev,
      [challengeId]: true
    }));
  };
  
  // Get active (non-resolved) challenges
  const activeChallenges = challenges.filter(
    challenge => !resolvedChallenges[challenge.id]
  );
  
  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Get severity background
  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-amber-50';
      case 'low':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      <div className="text-lg font-semibold p-4 bg-red-700 text-white flex justify-between items-center">
        <span>Your Twins Current Life Challenges</span>
        <div className="flex items-center text-sm bg-red-600 py-1 px-2 rounded">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>{activeChallenges.length} Active</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-sm text-gray-500 mb-4">
          Can you help him overcome these challenges?
        </div>
        
        {activeChallenges.length === 0 ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <div className="font-medium">No Active Challenges</div>
            <div className="text-sm text-gray-500 mt-1">
              Your Digital Twin doesn't detect any concerning patterns at the moment.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeChallenges.map(challenge => (
              <div 
                key={challenge.id} 
                className={`border rounded-lg overflow-hidden ${getSeverityBg(challenge.severity)}`}
              >
                {/* Challenge header - always visible */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedChallenge(
                    expandedChallenge === challenge.id ? null : challenge.id
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <AlertTriangle className={`h-5 w-5 mr-2 mt-0.5 ${getSeverityColor(challenge.severity)}`} />
                      <div>
                        <div className={`font-medium ${getSeverityColor(challenge.severity)}`}>
                          {challenge.title}
                        </div>
                        <div className="text-sm mt-1">{challenge.description}</div>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 text-xs font-medium rounded capitalize ${getSeverityColor(challenge.severity)}`}>
                      {challenge.severity} Priority
                    </div>
                  </div>
                </div>
                
                {/* Expanded challenge details */}
                {expandedChallenge === challenge.id && (
                  <div className="p-4 pt-0">
                    <div className="bg-white rounded-lg p-4 space-y-4">
                      {/* Data points section */}
                      <div>
                        <div className="text-sm font-medium mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Data Insights</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {challenge.dataPoints.map((point, idx) => (
                            <div 
                              key={idx} 
                              className="text-xs bg-gray-100 px-3 py-2 rounded"
                            >
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recommendations section */}
                      <div>
                        <div className="text-sm font-medium mb-2">Recommendations</div>
                        <div className="space-y-2">
                          {challenge.recommendations.map((rec, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start text-sm"
                            >
                              <ArrowRight className="h-4 w-4 mt-0.5 mr-2 text-indigo-500 shrink-0" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={() => handleResolveChallenge(challenge.id)}
                          className="flex-1 flex justify-center items-center bg-green-600 text-white py-2 px-4 rounded text-sm"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          <span>Mark as Resolved</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDismissChallenge(challenge.id)}
                          className="flex-1 flex justify-center items-center bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          Your Digital Twin analyzes your biometric and behavioral patterns to identify potential challenges.
        </div>
      </div>
    </div>
  );
};

export default LifeChallengesPanel;