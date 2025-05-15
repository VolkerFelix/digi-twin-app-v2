import React, { useState, useEffect, useRef, useCallback } from 'react';
import HealthPanel from './components/HealthPanel';
import WorkoutCompleteModal from './components/WorkoutCompleteModal';
import CombinedModelPanel from './components/CombinedModelPanel';
import CombinedInteractionPanel from './components/CombinedInteractionPanel';
import FuturePredictionsPanel from './components/predictions/FuturePredictionsPanel';
import WebSocketConnection from './components/WebSocketConnection';
import LoginForm from './components/LoginForm'; // Add this import
import HealthDataUploader from './components/HealthDataUploader';
import { getAuthToken, getUserFromToken } from './utils/auth';
import { fetchHealthData } from './utils/healthDataService';

import './App.css';

function App() {
  // Reference to the top of the page
  const topRef = useRef(null);
  
  // Authentication state
  const [authToken, setAuthToken] = useState(getAuthToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  
  // Data refresh state
  const [lastDataUpdate, setLastDataUpdate] = useState(Date.now());
  
  // Modal state
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showDataUpdateNotification, setShowDataUpdateNotification] = useState(false);
  
  // Mock state for the entire app
  const [digitalTwinState, setDigitalTwinState] = useState({
    // User info
    user: {
      name: 'David',
      age: 32,
      joinDate: '2023-11-15'
    },
    
    // Health metrics
    health: {
      overallHealth: 72,
      healthScore: 68,
      energyScore: 75,
      cognitiveScore: 83,
      stressScore: 42
    },
    
    // User behavior patterns (for predictions)
    behavior: {
      sleepConsistency: 'improving', // 'improving', 'declining', 'stable'
      exerciseFrequency: 'stable',
      nutritionQuality: 'declining',
      stressManagement: 'improving'
    },
    
    // Model accuracies
    models: {
      cardiovascular: 78,
      respiratory: 65,
      nervous: 82,
      sleep: 91
    },
    
    // Current mission
    activeMission: {
      id: 'sleep-consistency',
      title: 'Sleep Consistency Challenge',
      description: "Let's sleep for 7.5 hours for 5 consecutive nights.",
      benefit: 'This will evolve my brain power model and help regulate your circadian rhythm.',
      duration: '5 days',
      difficulty: 'Medium',
      progress: 2, // Days completed
      totalDays: 5
    },
    
    // Recent workout data
    lastWorkout: {
      completed: false,
      type: 'HIIT',
      duration: 45, // minutes
      caloriesBurned: 320,
      date: new Date().toISOString(),
      improvements: {
        healthScore: 5,
        energyScore: 8,
        cognitiveScore: 3,
        stressScore: -7 // Negative because lower stress is better
      }
    },
    
    // Recent model improvements
    recentImprovements: [
      {
        id: '1',
        type: 'sleep',
        title: 'Consistent Sleep Schedule',
        description: 'Your regular 11PM-6:30AM sleep pattern has improved sleep model accuracy by 12%',
        date: '2 days ago',
        impactPercentage: 12,
        metrics: ['Sleep Model +12%', 'Cognitive Model +8%']
      },
      {
        id: '2',
        type: 'workout',
        title: 'High Intensity Interval Training',
        description: 'Your 3 HIIT sessions provided new cardiovascular recovery data',
        date: '1 week ago',
        impactPercentage: 9,
        metrics: ['Cardiovascular Model +9%', 'Respiratory Model +6%']
      },
      {
        id: '3',
        type: 'consistency',
        title: 'Consistent Data Collection',
        description: '14-day streak of tracking metrics has significantly improved prediction accuracy',
        date: '2 weeks ago',
        impactPercentage: 15,
        metrics: ['Overall Model +15%', 'Predictive Power +23%']
      }
    ],
    
    // Life challenges
    challenges: [
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
  });
  
  // Initialize user on component mount
  useEffect(() => {
    if (authToken) {
      const userData = getUserFromToken();
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, [authToken]);

  // Handle successful login
  const handleLoginSuccess = (token) => {
    setAuthToken(token);
    const userData = getUserFromToken();
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Handle health data upload success
  const handleUploadSuccess = (data) => {
    console.log('Health data uploaded successfully:', data);
    // You could trigger a refresh of health data here
    fetchHealthData();
  };
  
  // Focus the top element on page load
  useEffect(() => {
    // Set focus to the top element when component mounts
    if (topRef.current) {
      topRef.current.focus();
    }
  }, []);
  
  // Fetch health data from backend API
  const fetchHealthData = useCallback(async () => {
    if (!authToken) return;
    
    try {
      // In a real app, you would make an API call like this:
      // const response = await fetch('/api/health-data', {
      //   headers: {
      //     'Authorization': `Bearer ${authToken}`
      //   }
      // });
      // const data = await response.json();
      
      // For demo purposes, we'll just simulate a data update
      console.log('Fetching new health data...');
      
      // Simulate API response with random improvements
      const healthImprovement = Math.floor(Math.random() * 5) + 1;
      const energyImprovement = Math.floor(Math.random() * 6) + 2;
      const cognitiveImprovement = Math.floor(Math.random() * 4) + 1;
      const stressImprovement = -1 * (Math.floor(Math.random() * 5) + 1); // Negative because stress reduction is good
      
      // Update digital twin state with new health metrics
      setDigitalTwinState(prev => ({
        ...prev,
        health: {
          overallHealth: Math.min(100, prev.health.overallHealth + healthImprovement),
          healthScore: Math.min(100, prev.health.healthScore + healthImprovement),
          energyScore: Math.min(100, prev.health.energyScore + energyImprovement),
          cognitiveScore: Math.min(100, prev.health.cognitiveScore + cognitiveImprovement),
          stressScore: Math.max(0, prev.health.stressScore + stressImprovement)
        },
        lastWorkout: {
          ...prev.lastWorkout,
          completed: true,
          date: new Date().toISOString(),
          improvements: {
            healthScore: healthImprovement,
            energyScore: energyImprovement,
            cognitiveScore: cognitiveImprovement,
            stressScore: stressImprovement
          }
        }
      }));
      
      // Update last data update timestamp
      setLastDataUpdate(Date.now());
      
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  }, [authToken]);
  
  // Handle new data notifications from WebSocket
  const handleNewDataNotification = useCallback((data) => {
    console.log('New health data notification received:', data);
    
    // Show notification
    setShowDataUpdateNotification(true);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowDataUpdateNotification(false);
    }, 5000);
    
    // Fetch the new data
    fetchHealthData();
    
  }, [fetchHealthData]);
  
  // Simulate workout completion (for demo purposes)
  const simulateWorkoutComplete = () => {
    // Update the lastWorkout status
    setDigitalTwinState(prev => ({
      ...prev,
      lastWorkout: {
        ...prev.lastWorkout,
        completed: true
      },
      // Apply improvements to health metrics
      health: {
        overallHealth: prev.health.overallHealth + 3,
        healthScore: prev.health.healthScore + prev.lastWorkout.improvements.healthScore,
        energyScore: prev.health.energyScore + prev.lastWorkout.improvements.energyScore,
        cognitiveScore: prev.health.cognitiveScore + prev.lastWorkout.improvements.cognitiveScore,
        stressScore: prev.health.stressScore + prev.lastWorkout.improvements.stressScore
      }
    }));
    
    // Show the workout complete modal
    setShowWorkoutModal(true);
  };
  
  // Handle workout modal close
  const handleWorkoutModalClose = () => {
    setShowWorkoutModal(false);
  };
  
  // Handle mission acceptance
  const handleAcceptMission = (mission) => {
    setDigitalTwinState(prev => ({
      ...prev,
      activeMission: {
        ...mission,
        progress: 0,
        totalDays: parseInt(mission.duration)
      }
    }));
  };
  
  // Handle mission decline
  const handleDeclineMission = () => {
    // In a real app, you might want to record this preference
    console.log('Mission declined');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Invisible, focusable element at the top of the page */}
      <div
        ref={topRef}
        tabIndex={-1}
        style={{ outline: 'none' }}
        aria-hidden="true"
      />
      
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">EvolveMe</h1>
            <p className="text-gray-600">Two journeys. One evolution. Real results.</p>
          </div>
          
          {/* WebSocket connection and notifications */}
          {authToken && (
            <WebSocketConnection 
              token={authToken} 
              onNewData={handleNewDataNotification} 
            />
          )}
        </header>

        {/* Show login form if not authenticated */}
        {!isAuthenticated ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* New data notification */}
            {showDataUpdateNotification && (
              <div className="fixed top-4 right-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg animate-pulse z-50">
                New health data available! Dashboard updated.
              </div>
            )}
        
            {/* Demo button (for testing) - would be part of a workout tracking UI in a real app */}
            <div className="mb-6 text-center">
              <button
                onClick={simulateWorkoutComplete}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Workout Completion
              </button>
            </div>
          
            <main className="space-y-6">
              {/* 1. Health Panel */}
              <HealthPanel 
                overallHealth={digitalTwinState.health.overallHealth}
                healthScore={digitalTwinState.health.healthScore}
                energyScore={digitalTwinState.health.energyScore}
                cognitiveScore={digitalTwinState.health.cognitiveScore}
                stressScore={digitalTwinState.health.stressScore}
              />
              
              {/* 2. Combined Model Panel */}
              <CombinedModelPanel 
                models={digitalTwinState.models}
                recentImprovements={digitalTwinState.recentImprovements}
              />
              
              {/* 3. Combined Interaction Panel (replaces separate AI Chat and Life Challenges panels) */}
              <CombinedInteractionPanel 
                userName={digitalTwinState.user.name}
                activeMission={digitalTwinState.activeMission}
                onAcceptMission={handleAcceptMission}
                onDeclineMission={handleDeclineMission}
                challenges={digitalTwinState.challenges}
              />
              
              {/* 4. Future Predictions Panel */}
              <FuturePredictionsPanel
                currentMetrics={digitalTwinState.health}
                userBehavior={digitalTwinState.behavior}
              />
            </main>
          </>
        )}
          
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Digital Twin v1.0.0 &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Your data remains private and secure</p>
        </footer>
      </div>
      
      {/* Workout Complete Modal */}
      <WorkoutCompleteModal 
        isOpen={showWorkoutModal}
        onClose={handleWorkoutModalClose}
        improvements={digitalTwinState.lastWorkout.improvements}
      />
    </div>
  );
}

export default App;