import React from 'react';
import { Heart, Brain, Moon, Stethoscope } from 'lucide-react';

const ModelAccuracyPanel = ({ 
  models = {
    cardiovascular: 78,
    respiratory: 65,
    nervous: 82,
    sleep: 91
  } 
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      <div className="text-lg font-semibold p-4 bg-purple-700 text-white">
        Model Accuracy
      </div>
      
      <div className="p-6">
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

export default ModelAccuracyPanel;