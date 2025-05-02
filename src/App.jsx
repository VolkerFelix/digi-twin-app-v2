import React, { useState, useEffect, useRef } from 'react';
import HealthPanel from './components/HealthPanel';
import ModelAccuracyPanel from './components/ModelAccuracyPanel';
import AIChatPanel from './components/AIChatPanel';
import ModelImprovementPanel from './components/ModelImprovementPanel';
import LifeChallengesPanel from './components/LifeChallengesPanel';
import './App.css';

function App() {
  // Reference to the top of the page
  const topRef = useRef(null);
  
  // Focus the top element on page load
  useEffect(() => {
    // Set focus to the top element when component mounts
    if (topRef.current) {
      topRef.current.focus();
    }
  }, []);

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
  });
  
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
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-800">EvolveMe</h1>
          <p className="text-gray-600">Two journeys. One evolution. Real results.</p>
        </header>
        
        <main className="space-y-6">
          {/* 1. Health Panel */}
          <HealthPanel 
            overallHealth={digitalTwinState.health.overallHealth}
            healthScore={digitalTwinState.health.healthScore}
            energyScore={digitalTwinState.health.energyScore}
            cognitiveScore={digitalTwinState.health.cognitiveScore}
            stressScore={digitalTwinState.health.stressScore}
          />
          
          {/* 2. Model Accuracy Panel */}
          <ModelAccuracyPanel 
            models={digitalTwinState.models}
          />
          
          {/* 3. AI Chat Panel */}
          <AIChatPanel 
            userName={digitalTwinState.user.name}
            activeMission={digitalTwinState.activeMission}
            onAcceptMission={handleAcceptMission}
            onDeclineMission={handleDeclineMission}
          />
          
          {/* 4. Model Improvement Panel */}
          <ModelImprovementPanel />
          
          {/* 5. Life Challenges Panel */}
          <LifeChallengesPanel />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Digital Twin v1.0.0 &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Your data remains private and secure</p>
        </footer>
      </div>
    </div>
  );
}

export default App;