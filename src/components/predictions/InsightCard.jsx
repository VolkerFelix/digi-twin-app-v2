import React from 'react';
import { 
  Lightbulb,
  AlertTriangle,
  TrendingDown
} from 'lucide-react';

/**
 * Component to render an insight card
 */
const InsightCard = ({ title, description, severity }) => {
  // Get icon and colors based on severity
  const getIconAndColor = (severity) => {
    switch (severity) {
      case 'positive':
        return {
          icon: <Lightbulb className="h-5 w-5" />,
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
          icon: <Lightbulb className="h-5 w-5" />,
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

export default InsightCard;