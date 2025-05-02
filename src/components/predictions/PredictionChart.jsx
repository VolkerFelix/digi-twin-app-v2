import React from 'react';
import { 
  ArrowRight, 
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { getMetricColor } from '../../utils/predictionUtils';

/**
 * Component to display prediction chart for a specific metric
 */
const PredictionChart = ({ 
  title, 
  data, 
  icon, 
  color, 
  isStress = false, 
  expanded = false, 
  userBehavior = {}, 
  timeRange = '7days' 
}) => {
  // Calculate min, max, and end values
  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  
  // Determine if trend is improving or declining
  // For stress, lower is better. For others, higher is better
  const isImproving = isStress 
    ? endValue < startValue 
    : endValue > startValue;
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    if (timeRange === 'tomorrow') {
      // For tomorrow's hourly forecast, show hour
      return date.getHours() + ':00';
    } else {
      // For 7-day forecast
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      // Extract the period (Morning/Afternoon/Evening) from data
      const dataPoint = data.find(d => new Date(d.date).getTime() === date.getTime());
      const period = dataPoint ? dataPoint.period : '';
      
      // Format differently based on which day it is
      if (date.toDateString() === today.toDateString()) {
        return `Today ${period}`;
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tmrw ${period}`;
      } else {
        // Short day name + period
        const dayName = date.toLocaleString('en-US', { weekday: 'short' });
        return `${dayName} ${period}`;
      }
    }
  };
  
  // Format hour ranges for tooltip display in 7-day view
  const formatHourRange = (hour) => {
    if (hour === 8) return '6am-10am';
    if (hour === 14) return '12pm-4pm';
    if (hour === 20) return '6pm-10pm';
    return `${hour}:00`;
  };
  
  // For tomorrow view, group data by 3-hour intervals for readability
  const getDisplayData = () => {
    if (timeRange === 'tomorrow') {
      // If we have 24 hourly data points, show every 3 hours
      if (data.length === 24) {
        return data.filter((_, index) => index % 3 === 0);
      }
    }
    return data;
  };
  
  const displayData = getDisplayData();
  
  return (
    <div className={`${expanded ? '' : 'p-0'}`}>
      <div className="flex items-center mb-4">
        <div className={`mr-3 ${color}`}>{icon}</div>
        <div className="flex-1">
          <div className={`${expanded ? 'text-xl' : 'text-base'} font-medium`}>{title}</div>
          <div className="flex items-center text-sm mt-1">
            <span className="text-gray-500">{timeRange === 'tomorrow' ? 'Start:' : 'Today:'}</span> 
            <span className={`ml-1 font-medium ${getMetricColor(isStress ? 'stress' : 'other', startValue)}`}>
              {startValue}%
            </span>
            <ArrowRight className="h-3 w-3 mx-2 text-gray-500" />
            <span className="text-gray-500">{timeRange === 'tomorrow' ? 'End:' : 'Day 7:'}</span>
            <span className={`ml-1 font-medium ${getMetricColor(isStress ? 'stress' : 'other', endValue)}`}>
              {endValue}%
            </span>
            <span className="ml-2">
              {isImproving ? (
                <span className="flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs">{isStress ? "Improving" : "Increasing"}</span>
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span className="text-xs">{isStress ? "Worsening" : "Decreasing"}</span>
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
      
      {/* Chart component */}
      <div className={`${expanded ? 'h-72' : 'h-32'} relative mt-2`}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-6 right-0 top-0 bottom-0">
          {/* Horizontal grid lines */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
          
          {/* Data line */}
          <svg className="w-full h-full" viewBox={`0 0 ${data.length - 1} 100`} preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}-${timeRange}-${expanded ? 'expanded' : 'normal'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isStress ? "#EF4444" : "#10B981"} stopOpacity="0.2" />
                <stop offset="100%" stopColor={isStress ? "#EF4444" : "#10B981"} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Background for chart (semi-transparent) */}
            <rect 
              x="0" 
              y="0" 
              width={data.length - 1} 
              height="100" 
              fill="white" 
              opacity="0.7" 
            />
            
            {/* Line chart */}
            <polyline
              points={data.map((point, index) => `${index}, ${100 - point.value}`).join(' ')}
              fill="none"
              stroke={isStress ? "#EF4444" : "#10B981"}
              strokeWidth={expanded ? "3" : "2"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Area under the line */}
            <path
              d={`M0,${100 - data[0].value} ${data.map((point, index) => `L${index},${100 - point.value}`).join(' ')} L${data.length - 1},100 L0,100 Z`}
              fill={`url(#gradient-${title.replace(/\s+/g, '')}-${timeRange}-${expanded ? 'expanded' : 'normal'})`}
            />
            
            {/* Data points */}
            {displayData.map((point, index) => {
              const dataIndex = timeRange === 'tomorrow' && data.length === 24 
                ? index * 3  // For tomorrow view with filtered points
                : data.findIndex(d => d.date === point.date);
                
              return (
                <circle
                  key={dataIndex}
                  cx={dataIndex}
                  cy={100 - point.value}
                  r={expanded ? "4" : "2"}
                  fill={isStress ? "#EF4444" : "#10B981"}
                  stroke="#FFFFFF"
                  strokeWidth={expanded ? "2" : "1"}
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute left-0 right-0 bottom-0 translate-y-6 flex justify-between text-xs text-gray-500">
            {displayData.map((point, index) => {
              const dataIndex = timeRange === 'tomorrow' && data.length === 24 
                ? index * 3  // For tomorrow view with filtered points
                : data.findIndex(d => d.date === point.date);
                
              // Calculate position as percentage of total width
              const position = `${(dataIndex / (data.length - 1)) * 100}%`;
              
              return (
                <div 
                  key={dataIndex} 
                  className="absolute text-center" 
                  style={{ 
                    left: position,
                    transform: 'translateX(-50%)',
                    maxWidth: '60px'
                  }}
                >
                  {formatDate(point.date)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Min/Max values */}
      <div className="flex justify-between text-xs text-gray-500 mt-10">
        <div>
          <span className="font-medium">Min:</span> {minValue}%
        </div>
        <div>
          <span className="font-medium">Max:</span> {maxValue}%
        </div>
      </div>
      
      {/* Additional information for expanded view */}
      {expanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Factors Influencing this Prediction:</h3>
          <ul className="text-sm space-y-2">
            {isStress ? (
              <>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">1</span>
                  </div>
                  <span>Your stress management techniques are {userBehavior.stressManagement === 'improving' ? 'showing positive results' : userBehavior.stressManagement === 'declining' ? 'not as effective as they could be' : 'maintaining your current levels'}</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">2</span>
                  </div>
                  <span>Sleep quality has a significant impact on stress levels</span>
                </li>
                {timeRange === 'tomorrow' && (
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">3</span>
                    </div>
                    <span>Stress typically peaks in the morning and evening during commute hours</span>
                  </li>
                )}
              </>
            ) : title.includes("Health") ? (
              <>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">1</span>
                  </div>
                  <span>Nutrition quality is {userBehavior.nutritionQuality === 'improving' ? 'showing improvement' : userBehavior.nutritionQuality === 'declining' ? 'declining slightly' : 'relatively stable'}</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">2</span>
                  </div>
                  <span>Exercise consistency is an important factor in health trends</span>
                </li>
                {timeRange === 'tomorrow' && (
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">3</span>
                    </div>
                    <span>Health metrics typically improve in the afternoon following activity</span>
                  </li>
                )}
              </>
            ) : title.includes("Energy") ? (
              <>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">1</span>
                  </div>
                  <span>Sleep habits are {userBehavior.sleepConsistency === 'improving' ? 'improving, boosting energy levels' : userBehavior.sleepConsistency === 'declining' ? 'less consistent than optimal' : 'stable, maintaining your energy'}</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">2</span>
                  </div>
                  <span>Stress levels affect overall energy throughout the day</span>
                </li>
                {timeRange === 'tomorrow' && (
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">3</span>
                    </div>
                    <span>Energy typically dips mid-afternoon (2-4pm) and late evening</span>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">1</span>
                  </div>
                  <span>Exercise frequency is {userBehavior.exerciseFrequency === 'improving' ? 'increasing, enhancing cognitive function' : userBehavior.exerciseFrequency === 'declining' ? 'decreasing, which may impact cognitive performance' : 'consistent, maintaining cognitive levels'}</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-indigo-700 text-xs">2</span>
                  </div>
                  <span>Sleep quality directly impacts cognitive performance and memory</span>
                </li>
                {timeRange === 'tomorrow' && (
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-indigo-700 text-xs">3</span>
                    </div>
                    <span>Cognitive function is typically highest in the morning hours</span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionChart;