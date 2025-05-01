import React from 'react';
import { TrendingUp, Moon, Dumbbell, Zap, BarChart } from 'lucide-react';

const ModelImprovementPanel = ({ 
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
  // Calculate total model improvement from recent activities
  const totalImprovement = recentImprovements.reduce(
    (total, improvement) => total + improvement.impactPercentage, 
    0
  );
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      <div className="text-lg font-semibold p-4 bg-blue-700 text-white flex justify-between items-center">
        <span>Model Improvements</span>
        <div className="flex items-center text-sm bg-blue-600 py-1 px-2 rounded">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+{totalImprovement}% Accuracy</span>
        </div>
      </div>
      
      <div className="p-6">
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

export default ModelImprovementPanel;