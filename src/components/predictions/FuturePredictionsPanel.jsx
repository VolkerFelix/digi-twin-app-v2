import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { Heart, Battery, Brain, Activity, Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { healthData, energyData, cognitiveData, stressData, healthDataTomorrow, energyDataTomorrow, cognitiveDataTomorrow, stressDataTomorrow } from '../../utils/predictionDemoData';

const FuturePredictionsPanel = () => {
  const [viewMode, setViewMode] = useState('charts');
  const [activeMetric, setActiveMetric] = useState('health');
  const [timeRange, setTimeRange] = useState('tomorrow');
  
  // Get active data based on selected metric and time range
  const getActiveData = () => {
    const dataMap = {
      '7days': {
        health: healthData,
        energy: energyData,
        cognitive: cognitiveData,
        stress: stressData
      },
      'tomorrow': {
        health: healthDataTomorrow,
        energy: energyDataTomorrow,
        cognitive: cognitiveDataTomorrow,
        stress: stressDataTomorrow
      }
    };
    
    return dataMap[timeRange][activeMetric] || healthData;
  };
  
  // Get color based on metric
  const getMetricColor = () => {
    switch (activeMetric) {
      case 'health': return '#ef4444';
      case 'energy': return '#3b82f6';
      case 'cognitive': return '#8b5cf6';
      case 'stress': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  // Get icon based on metric
  const getMetricIcon = () => {
    switch (activeMetric) {
      case 'health': return <Heart className="h-5 w-5" />;
      case 'energy': return <Battery className="h-5 w-5" />;
      case 'cognitive': return <Brain className="h-5 w-5" />;
      case 'stress': return <Activity className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };
  
  // Get trend info (comparing first and last data points)
  const getTrendInfo = () => {
    const data = getActiveData();
    const startValue = data[0].value;
    const endValue = data[data.length - 1].value;
    const isTrendUp = endValue > startValue;
    const isStress = activeMetric === 'stress';
    
    // For stress, downward trend is good; for others, upward trend is good
    const isPositive = isStress ? !isTrendUp : isTrendUp;
    
    return {
      startValue,
      endValue,
      isTrendUp,
      isPositive,
      difference: Math.abs(endValue - startValue)
    };
  };
  
  // Sample insights for the "Key Insights" tab
  const insights = [
    {
      title: 'Improving Health Trend',
      description: 'Your health metrics are projected to improve by 13% over the next week. Continue your current routine to maintain this positive trajectory.',
      severity: 'positive'
    },
    {
      title: 'Optimal Focus Time',
      description: 'Your cognitive performance will likely be highest during mornings. Plan deep work or complex tasks during this period.',
      severity: 'positive'
    },
    {
      title: 'Afternoon Energy Dip',
      description: 'Expect a natural energy dip in the afternoon. Plan for a short break or light physical activity to counteract it.',
      severity: 'warning'
    },
    {
      title: 'Decreasing Stress Levels',
      description: 'Your stress levels are projected to gradually decrease over the next week. Your current approach is working well.',
      severity: 'positive'
    }
  ];

  // Function to render custom X-axis label to avoid overlapping
  const renderCustomXAxisTick = ({ x, y, payload }) => {
    // Only show every 3rd tick (one per day rather than every period)
    if (payload.index % 3 !== 0) return null;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  };
  
  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{`${data.day} ${data.period}`}</p>
          <p className="text-sm">
            <span className="font-medium">{activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}: </span>
            <span style={{ color: getMetricColor() }}>{data.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Insight card component
  const InsightCard = ({ title, description, severity }) => {
    // Get icon and colors based on severity
    const getIconAndColor = (severity) => {
      switch (severity) {
        case 'positive':
          return {
            icon: <TrendingUp className="h-5 w-5" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            borderColor: 'border-green-200'
          };
        case 'warning':
          return {
            icon: <AlertTriangle className="h-5 w-5" />,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-200'
          };
        case 'negative':
          return {
            icon: <TrendingDown className="h-5 w-5" />,
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200'
          };
        default:
          return {
            icon: <TrendingUp className="h-5 w-5" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-200'
          };
      }
    };
    
    const { icon, bgColor, textColor, borderColor } = getIconAndColor(severity);
    
    return (
      <div className={`p-4 border rounded-lg ${borderColor} ${bgColor}`}>
        <div className="flex items-start">
          <div className={`${textColor} mt-0.5 mr-3`}>
            {icon}
          </div>
          <div>
            <div className={`font-medium ${textColor}`}>{title}</div>
            <div className="text-sm mt-1">{description}</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Get trend indicator component
  const TrendIndicator = () => {
    const { isTrendUp, isPositive } = getTrendInfo();
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isTrendUp ? (
          <TrendingUp className="h-4 w-4 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 mr-1" />
        )}
        <span className="text-xs">{isPositive ? "Improving" : "Declining"}</span>
      </span>
    );
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Header with tabs */}
      <div className="text-lg font-semibold p-4 bg-indigo-700 text-white flex justify-between items-center">
        <span>Future Predictions</span>
        <div className="flex items-center space-x-2">
          {/* Time range selector */}
          <div className="flex rounded-lg overflow-hidden bg-indigo-800 text-xs">
            <button 
              className={`py-1 px-3 flex items-center ${timeRange === 'tomorrow' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}
              onClick={() => setTimeRange('tomorrow')}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span>Tomorrow</span>
            </button>
            <button 
              className={`py-1 px-3 flex items-center ${timeRange === '7days' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}
              onClick={() => setTimeRange('7days')}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span>7 Days</span>
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
              Predictions based on your current behavior patterns and health trends for the next week
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
            
            {/* Chart display */}
            <div className="border rounded-lg p-6 shadow-sm bg-white">
              {/* Header info */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-3" style={{ color: getMetricColor() }}>
                  {getMetricIcon()}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-medium">
                    {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Projection
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <span className="text-gray-500">Today:</span> 
                    <span className="ml-1 font-medium" style={{ color: getMetricColor() }}>
                      {getTrendInfo().startValue}%
                    </span>
                    <span className="mx-2">→</span>
                    <span className="text-gray-500">Day 7:</span>
                    <span className="ml-1 font-medium" style={{ color: getMetricColor() }}>
                      {getTrendInfo().endValue}%
                    </span>
                    <span className="ml-2">
                      <TrendIndicator />
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getActiveData()}
                    margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      tick={renderCustomXAxisTick} 
                      interval={0}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getMetricColor()} 
                      fillOpacity={1} 
                      fill="url(#colorFill)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getMetricColor()} 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: getMetricColor(), stroke: getMetricColor() }}
                      activeDot={{ r: 6, fill: getMetricColor(), stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Min/Max values */}
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <div className="font-medium">
                  Min: {Math.min(...getActiveData().map(d => d.value))}%
                </div>
                <div className="font-medium">
                  Max: {Math.max(...getActiveData().map(d => d.value))}%
                </div>
              </div>
              
              {/* Factors influencing */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Factors Influencing this Prediction:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">1</span>
                    </div>
                    <span>
                      {activeMetric === 'health' && "Nutrition quality is declining slightly"}
                      {activeMetric === 'energy' && "Sleep habits are improving, boosting energy levels"}
                      {activeMetric === 'cognitive' && "Exercise frequency is consistent, maintaining cognitive levels"}
                      {activeMetric === 'stress' && "Your stress management techniques are showing positive results"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">2</span>
                    </div>
                    <span>
                      {activeMetric === 'health' && "Exercise consistency is an important factor in health trends"}
                      {activeMetric === 'energy' && "Stress levels affect overall energy throughout the day"}
                      {activeMetric === 'cognitive' && "Sleep quality directly impacts cognitive performance and memory"}
                      {activeMetric === 'stress' && "Sleep quality has a significant impact on stress levels"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">3</span>
                    </div>
                    <span>
                      {activeMetric === 'health' && "Daily patterns show improvement strongest on weekends"}
                      {activeMetric === 'energy' && "Energy typically peaks in the morning and dips mid-afternoon"}
                      {activeMetric === 'cognitive' && "Cognitive function is typically highest in the morning hours"}
                      {activeMetric === 'stress' && "Your weekend activities help reduce stress levels significantly"}
                    </span>
                  </li>
                </ul>
              </div>
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