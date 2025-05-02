import React, { useState } from 'react';
import { Heart, Brain, Moon, Stethoscope, TrendingUp, Zap, Dumbbell, BarChart, Layers } from 'lucide-react';

const CombinedModelPanel = ({ 
  models = {
    cardiovascular: 78,
    respiratory: 65,
    nervous: 82,
    sleep: 91
  },
  recentImprovements = [
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
  ]
}) => {
  const [activeTab, setActiveTab] = useState('accuracy'); // 'accuracy' or 'improvements'
  
  // Calculate total model improvement from recent activities
  const totalImprovement = recentImprovements.reduce(
    (total, improvement) => total + improvement.impactPercentage, 
    0
  );

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      {/* Header with tabs */}
      <div className="text-lg font-semibold p-4 bg-purple-700 text-white flex justify-between items-center">
        <span>Digital Twin Model</span>
        <div className="flex items-center text-sm bg-purple-600 py-1 px-2 rounded">
          <Layers className="h-4 w-4 mr-1" />
          <span>Evolution in Progress</span>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'accuracy' 
              ? 'text-purple-600 border-b-2 border-purple-600' 
              : 'text-gray-500 hover:text-purple-500'
          }`}
          onClick={() => setActiveTab('accuracy')}
        >
          Model Accuracy
        </button>
        
        <button
          className={`flex-1 py-3 px-4 font-medium flex items-center justify-center ${
            activeTab === 'improvements' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('improvements')}
        >
          <span>Improvements</span>
          <div className="ml-2 bg-blue-100 text-blue-700 text-xs py-0.5 px-1.5 rounded-full">
            +{totalImprovement}%
          </div>
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="p-6">
        {activeTab === 'accuracy' ? (
          /* Model Accuracy Content */
          <>
            <div className="text-sm text-gray-500 mb-4">
              How well each system model is trained on your data
            </div>
            
            {/* Model accuracy cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Cardiovascular system */}
              <ModelCard 
                name="Cardiovascular"
                accuracy={models.cardiovascular}
                icon={<Heart className="h-8 w-8 text-red-500" />}
                color="red"
                description="Heart rate, blood pressure, and circulation predictions"
              />
              
              {/* Respiratory system */}
              <ModelCard 
                name="Respiratory"
                accuracy={models.respiratory}
                icon={<Stethoscope className="h-8 w-8 text-blue-500" />}
                color="blue"
                description="Breathing patterns and respiratory health predictions"
              />
              
              {/* Nervous system */}
              <ModelCard 
                name="Nervous System"
                accuracy={models.nervous}
                icon={<Brain className="h-8 w-8 text-purple-500" />}
                color="purple"
                description="Cognitive performance and stress response predictions"
              />
              
              {/* Sleep model */}
              <ModelCard 
                name="Sleep Patterns"
                accuracy={models.sleep}
                icon={<Moon className="h-8 w-8 text-indigo-500" />}
                color="indigo"
                description="Sleep quality, duration, and cycle predictions"
              />
            </div>
            
            {/* Data collection suggestion */}
            <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm">
              {getAccuracySuggestion(models)}
            </div>
          </>
        ) : (
          /* Model Improvements Content */
          <>
            <div className="text-sm text-gray-500 mb-4">
              Recent activities that have improved your digital twin's accuracy
            </div>
            
            <div className="space-y-4">
              {recentImprovements.map(improvement => (
                <ImprovementCard key={improvement.id} improvement={improvement} />
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <BarChart className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                <div>
                  <div className="font-medium text-blue-700">Data Insight</div>
                  <div className="text-sm mt-1">
                    Consistent data collection has the biggest impact on model accuracy. 
                    Your recent activities have improved overall model accuracy by {totalImprovement}%.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Card component for displaying each model's accuracy
const ModelCard = ({ name, accuracy, icon, color, description }) => {
  const getAccuracyClass = (value) => {
    if (value >= 90) return 'bg-green-100 text-green-800';
    if (value >= 70) return 'bg-blue-100 text-blue-800';
    if (value >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const progressColorClass = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }[color] || 'bg-gray-500';
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex items-center mb-2">
        <div className="mr-3">{icon}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getAccuracyClass(accuracy)}`}>
            {accuracy}% Accurate
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${progressColorClass}`}
          style={{ width: `${accuracy}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {description}
      </div>
    </div>
  );
};

// Individual improvement card component
const ImprovementCard = ({ improvement }) => {
  // Get icon based on improvement type
  const getIcon = (type) => {
    switch (type) {
      case 'sleep':
        return <Moon className="h-10 w-10 text-indigo-600" />;
      case 'workout':
        return <Dumbbell className="h-10 w-10 text-green-600" />;
      case 'consistency':
        return <Zap className="h-10 w-10 text-amber-600" />;
      default:
        return <TrendingUp className="h-10 w-10 text-blue-600" />;
    }
  };
  
  // Get color theme based on improvement type
  const getColorTheme = (type) => {
    switch (type) {
      case 'sleep':
        return {
          light: 'bg-indigo-50',
          border: 'border-indigo-200',
          dark: 'bg-indigo-100'
        };
      case 'workout':
        return {
          light: 'bg-green-50',
          border: 'border-green-200',
          dark: 'bg-green-100'
        };
      case 'consistency':
        return {
          light: 'bg-amber-50',
          border: 'border-amber-200',
          dark: 'bg-amber-100'
        };
      default:
        return {
          light: 'bg-blue-50',
          border: 'border-blue-200',
          dark: 'bg-blue-100'
        };
    }
  };
  
  const colorTheme = getColorTheme(improvement.type);
  
  return (
    <div className={`p-4 rounded-lg border ${colorTheme.border} ${colorTheme.light}`}>
      <div className="flex">
        <div className={`p-2 rounded-lg ${colorTheme.dark} mr-4`}>
          {getIcon(improvement.type)}
        </div>
        
        <div className="flex-1">
          <div className="font-medium">{improvement.title}</div>
          <div className="text-sm text-gray-600 mt-1">{improvement.description}</div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {improvement.metrics.map((metric, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-white rounded-full"
              >
                {metric}
              </span>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 mt-2">{improvement.date}</div>
        </div>
        
        <div className="ml-4 flex flex-col items-center justify-center">
          <div className="text-xl font-bold">+{improvement.impactPercentage}%</div>
          <div className="text-xs text-gray-500">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

// Helper to generate suggestions based on model accuracies
function getAccuracySuggestion(models) {
  // Find the model with lowest accuracy
  const modelEntries = Object.entries(models);
  const lowestModel = modelEntries.reduce(
    (lowest, [key, value]) => value < lowest[1] ? [key, value] : lowest, 
    ['unknown', 100]
  );
  
  const modelName = lowestModel[0];
  const accuracy = lowestModel[1];
  
  if (accuracy < 70) {
    const activities = {
      cardiovascular: "more cardio workouts and tracking your heart rate",
      respiratory: "breathing exercises and outdoor activities",
      nervous: "cognitive tasks and stress measurements",
      sleep: "consistent sleep tracking and bedtime routines"
    }[modelName] || "more consistent tracking";
    
    return `📊 Your ${modelName} model has lower accuracy. Try adding ${activities} to improve predictions.`;
  }
  
  // If all models are doing well
  if (modelEntries.every(([_, value]) => value >= 85)) {
    return "🌟 All your models have excellent accuracy! Keep maintaining your tracking consistency.";
  }
  
  return "🔄 Continue providing consistent data for all your health metrics to improve model accuracy.";
}

export default CombinedModelPanel;