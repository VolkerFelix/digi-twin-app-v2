import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Heart, 
  Battery, 
  Brain, 
  Activity 
} from 'lucide-react';

// Import components
import PredictionChart from './PredictionChart';
import InsightCard from './InsightCard';

// Import utility functions
import { 
  generatePredictiveData, 
  generateInsights 
} from '../../utils/predictionUtils';

/**
 * Panel that displays future predictions for health metrics
 */
const FuturePredictionsPanel = ({ 
  currentMetrics = {
    healthScore: 68,
    energyScore: 75,
    cognitiveScore: 83,
    stressScore: 42
  },
  userBehavior = {
    sleepConsistency: 'improving', // 'improving', 'declining', 'stable'
    exerciseFrequency: 'stable',
    nutritionQuality: 'declining',
    stressManagement: 'improving'
  }
}) => {
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'insights'
  const [activeMetric, setActiveMetric] = useState('health'); // 'health', 'energy', 'cognitive', 'stress'
  const [timeRange, setTimeRange] = useState('7days'); // '7days' or 'tomorrow'
  const [predictiveData, setPredictiveData] = useState(null);
  const [insights, setInsights] = useState([]);
  
  // Generate predictive data when component mounts or dependencies change
  useEffect(() => {
    // Generate data for both time ranges
    const generatedData = {
      health: {
        '7days': generatePredictiveData(
          currentMetrics.healthScore, 
          2, // volatility
          userBehavior.nutritionQuality === 'improving' ? 0.7 : 
            userBehavior.nutritionQuality === 'declining' ? -0.7 : 0.2,
          '7days'
        ),
        'tomorrow': generatePredictiveData(
          currentMetrics.healthScore, 
          1.5, // less volatility for a single day
          userBehavior.nutritionQuality === 'improving' ? 0.5 : 
            userBehavior.nutritionQuality === 'declining' ? -0.5 : 0.1,
          'tomorrow'
        )
      },
      energy: {
        '7days': generatePredictiveData(
          currentMetrics.energyScore, 
          2.5, // more volatile
          userBehavior.sleepConsistency === 'improving' ? 0.8 : 
            userBehavior.sleepConsistency === 'declining' ? -0.8 : 0.1,
          '7days'
        ),
        'tomorrow': generatePredictiveData(
          currentMetrics.energyScore, 
          2, // volatile throughout the day
          userBehavior.sleepConsistency === 'improving' ? 0.6 : 
            userBehavior.sleepConsistency === 'declining' ? -0.6 : 0.1,
          'tomorrow'
        )
      },
      cognitive: {
        '7days': generatePredictiveData(
          currentMetrics.cognitiveScore, 
          1.8, // less volatile
          userBehavior.exerciseFrequency === 'improving' ? 0.6 : 
            userBehavior.exerciseFrequency === 'declining' ? -0.5 : 0.3,
          '7days'
        ),
        'tomorrow': generatePredictiveData(
          currentMetrics.cognitiveScore, 
          1.6, // fairly stable
          userBehavior.exerciseFrequency === 'improving' ? 0.5 : 
            userBehavior.exerciseFrequency === 'declining' ? -0.4 : 0.2,
          'tomorrow'
        )
      },
      stress: {
        '7days': generatePredictiveData(
          currentMetrics.stressScore, 
          3, // more volatile
          userBehavior.stressManagement === 'improving' ? -0.9 : 
            userBehavior.stressManagement === 'declining' ? 0.9 : -0.1,
          '7days'
        ),
        'tomorrow': generatePredictiveData(
          currentMetrics.stressScore, 
          2.5, // volatile during the day
          userBehavior.stressManagement === 'improving' ? -0.8 : 
            userBehavior.stressManagement === 'declining' ? 0.8 : -0.1,
          'tomorrow'
        )
      }
    };
    
    setPredictiveData(generatedData);
  }, [currentMetrics, userBehavior]);
  
  // Generate insights when predictive data or time range changes
  useEffect(() => {
    if (predictiveData) {
      const newInsights = generateInsights(predictiveData, timeRange);
      setInsights(newInsights);
    }
  }, [predictiveData, timeRange]);
  
  // If predictive data is not yet generated, show loading
  if (!predictiveData) {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6 p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate.spin"></div>
        <p className="mt-4 text-gray-500">Generating predictions...</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      {/* Header with tabs */}
      <div className="text-lg font-semibold p-4 bg-indigo-700 text-white flex justify-between items-center">
        <span>Future Predictions</span>
        <div className="flex items-center space-x-2">
          {/* Time range selector */}
          <div className="flex rounded-lg overflow-hidden bg-indigo-800 text-xs">
            <button 
              className={`py-1 px-3 flex items-center ${timeRange === '7days' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}
              onClick={() => setTimeRange('7days')}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span>7 Days</span>
            </button>
            <button 
              className={`py-1 px-3 flex items-center ${timeRange === 'tomorrow' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}
              onClick={() => setTimeRange('tomorrow')}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span>Tomorrow</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 font-medium ${
            viewMode === 'charts' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-indigo-500'
          }`}
          onClick={() => setViewMode('charts')}
        >
          Prediction Charts
        </button>
        
        <button
          className={`flex-1 py-3 px-4 font-medium ${
            viewMode === 'insights' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-indigo-500'
          }`}
          onClick={() => setViewMode('insights')}
        >
          Key Insights
        </button>
      </div>
      
      {/* Content based on active view mode */}
      <div className="p-6">
        {viewMode === 'charts' ? (
          <>
            <div className="text-sm text-gray-500 mb-4">
              {timeRange === '7days' 
                ? "Predictions based on your current behavior patterns and health trends for the next week" 
                : "Hourly predictions for tomorrow based on your current patterns and trends"
              }
            </div>
            
            {/* Metric selector buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${activeMetric === 'health' 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                onClick={() => setActiveMetric('health')}
              >
                <Heart className={`h-4 w-4 mr-2 ${activeMetric === 'health' ? 'text-white' : 'text-red-500'}`} />
                <span>Health</span>
              </button>
              
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${activeMetric === 'energy' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                onClick={() => setActiveMetric('energy')}
              >
                <Battery className={`h-4 w-4 mr-2 ${activeMetric === 'energy' ? 'text-white' : 'text-blue-500'}`} />
                <span>Energy</span>
              </button>
              
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${activeMetric === 'cognitive' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                onClick={() => setActiveMetric('cognitive')}
              >
                <Brain className={`h-4 w-4 mr-2 ${activeMetric === 'cognitive' ? 'text-white' : 'text-purple-500'}`} />
                <span>Cognitive</span>
              </button>
              
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${activeMetric === 'stress' 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                onClick={() => setActiveMetric('stress')}
              >
                <Activity className={`h-4 w-4 mr-2 ${activeMetric === 'stress' ? 'text-white' : 'text-amber-500'}`} />
                <span>Stress</span>
              </button>
            </div>
            
            {/* Single chart display */}
            <div className="border rounded-lg p-6 shadow-sm bg-white">
              {activeMetric === 'health' && (
                <PredictionChart 
                  title="Health Projection" 
                  data={predictiveData.health[timeRange]}
                  icon={<Heart className="h-8 w-8" />}
                  color="text-red-500"
                  expanded={true}
                  userBehavior={userBehavior}
                  timeRange={timeRange}
                />
              )}
              
              {activeMetric === 'energy' && (
                <PredictionChart 
                  title="Energy Projection" 
                  data={predictiveData.energy[timeRange]}
                  icon={<Battery className="h-8 w-8" />}
                  color="text-blue-500"
                  expanded={true}
                  userBehavior={userBehavior}
                  timeRange={timeRange}
                />
              )}
              
              {activeMetric === 'cognitive' && (
                <PredictionChart 
                  title="Cognitive Projection" 
                  data={predictiveData.cognitive[timeRange]}
                  icon={<Brain className="h-8 w-8" />}
                  color="text-purple-500"
                  expanded={true}
                  userBehavior={userBehavior}
                  timeRange={timeRange}
                />
              )}
              
              {activeMetric === 'stress' && (
                <PredictionChart 
                  title="Stress Projection" 
                  data={predictiveData.stress[timeRange]}
                  icon={<Activity className="h-8 w-8" />}
                  color="text-amber-500"
                  isStress={true}
                  expanded={true}
                  userBehavior={userBehavior}
                  timeRange={timeRange}
                />
              )}
            </div>
            
            <div className="mt-6 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-600">
              These predictions are based on your current behavior patterns and can be improved with consistent healthy habits.
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-4">
              Key insights derived from analyzing your predictive health data
            </div>
            
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  title={insight.title}
                  description={insight.description}
                  severity={insight.severity}
                />
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-600">
              These insights are designed to help you make proactive adjustments to optimize your health outcomes.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FuturePredictionsPanel;