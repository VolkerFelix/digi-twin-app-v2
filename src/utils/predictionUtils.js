/**
 * Utility functions for generating prediction data
 */

/**
 * Returns a color class based on metric and value
 * @param {string} metric - The metric type ('stress' or other)
 * @param {number} value - The value to get color for (0-100)
 * @returns {string} The Tailwind color class
 */
export const getMetricColor = (metric, value) => {
    // For stress, lower is better
    if (metric === 'stress') {
      if (value <= 30) return 'text-green-600';
      if (value <= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    // For other metrics, higher is better
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  /**
   * Generates predictive data based on current values and trends
   * @param {number} startValue - The starting value (0-100)
   * @param {number} volatility - How much the values can fluctuate
   * @param {number} trend - The overall trend direction (-1 to 1)
   * @param {string} timeRange - '7days' or 'tomorrow'
   * @returns {Array} Array of data points
   */
  export const generatePredictiveData = (startValue, volatility, trend, timeRange = '7days') => {
    // trend values: 1 = upward, 0 = neutral, -1 = downward
    const data = [];
    const today = new Date();
    let currentValue = startValue;
  
    if (timeRange === 'tomorrow') {
      // Generate hourly data for tomorrow (24 hours)
      for (let i = 0; i < 24; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1); // tomorrow
        nextDate.setHours(i, 0, 0, 0);
        
        // Apply random variation with time-of-day influence
        // Lower energy in early morning and late night, higher during day
        let timeOfDayFactor = 0;
        if (i < 6) timeOfDayFactor = -0.5; // Early morning (midnight-6am)
        else if (i < 11) timeOfDayFactor = 0.3; // Morning (6am-11am)
        else if (i < 15) timeOfDayFactor = 0.1; // Midday (11am-3pm)
        else if (i < 20) timeOfDayFactor = 0.4; // Afternoon/Evening (3pm-8pm)
        else timeOfDayFactor = -0.3; // Night (8pm-midnight)
        
        const randomVariation = (Math.random() * 2 - 1) * volatility;
        const trendInfluence = trend * (0.1 + (Math.random() * 0.2)) + timeOfDayFactor;
        
        currentValue = Math.max(0, Math.min(100, currentValue + randomVariation + trendInfluence));
        
        data.push({
          date: nextDate.toISOString(),
          hour: i,
          value: Math.round(currentValue)
        });
      }
    } else {
      // Generate 3 data points per day for 7 days (morning, afternoon, evening)
      for (let day = 0; day < 7; day++) {
        const periods = [
          { hour: 8, label: 'Morning' },
          { hour: 14, label: 'Afternoon' },
          { hour: 20, label: 'Evening' }
        ];
        
        for (const period of periods) {
          const nextDate = new Date(today);
          nextDate.setDate(today.getDate() + day);
          nextDate.setHours(period.hour, 0, 0, 0);
          
          // Bigger variations between days, smaller within day
          let timeOfDayFactor = 0;
          if (period.label === 'Morning') timeOfDayFactor = -0.2;
          else if (period.label === 'Afternoon') timeOfDayFactor = 0.3;
          else timeOfDayFactor = -0.1; // Evening
          
          const randomVariation = (Math.random() * 2 - 1) * volatility * 0.7;
          const trendInfluence = trend * (0.15 + (Math.random() * 0.25)) + timeOfDayFactor;
          
          currentValue = Math.max(0, Math.min(100, currentValue + randomVariation + trendInfluence));
          
          data.push({
            date: nextDate.toISOString(),
            day,
            period: period.label,
            hour: period.hour,
            value: Math.round(currentValue)
          });
        }
      }
    }
  
    return data;
  };
  
  /**
   * Generates insights based on predictive data
   * @param {Object} predictiveData - The prediction data for all metrics
   * @param {string} timeRange - '7days' or 'tomorrow'
   * @returns {Array} Array of insight objects
   */
  export const generateInsights = (predictiveData, timeRange) => {
    const insights = [];
    
    if (timeRange === '7days') {
      // Insights for 7-day predictions
      // Check health trend
      const healthStart = predictiveData.health['7days'][0].value;
      const healthEnd = predictiveData.health['7days'][predictiveData.health['7days'].length - 1].value;
      const healthDifference = healthEnd - healthStart;
      
      if (healthDifference > 3) {
        insights.push({
          title: 'Improving Health Trend',
          description: 'Your health metrics are projected to improve over the next week. Continue your current routine to maintain this positive trajectory.',
          severity: 'positive'
        });
      } else if (healthDifference < -3) {
        insights.push({
          title: 'Declining Health Trend',
          description: 'Your health metrics may decline slightly in the coming days. Consider focusing on nutrition and rest.',
          severity: 'negative'
        });
      }
      
      // Check stress trend
      const stressStart = predictiveData.stress['7days'][0].value;
      const stressEnd = predictiveData.stress['7days'][predictiveData.stress['7days'].length - 1].value;
      const stressDifference = stressEnd - stressStart;
      
      if (stressDifference > 5) {
        insights.push({
          title: 'Stress Alert',
          description: 'Your stress levels are likely to rise in the next 7 days. Pre-emptive stress management techniques are recommended.',
          severity: 'warning'
        });
      } else if (stressDifference < -5) {
        insights.push({
          title: 'Improving Stress Levels',
          description: 'Your stress levels are projected to decrease over the next week. Your current approach is working well.',
          severity: 'positive'
        });
      }
      
      // Check cognitive function fluctuations
      const cognitiveValues = predictiveData.cognitive['7days'].map(d => d.value);
      const cognitiveVariance = Math.max(...cognitiveValues) - Math.min(...cognitiveValues);
      
      if (cognitiveVariance > 8) {
        insights.push({
          title: 'Cognitive Fluctuations',
          description: 'Your cognitive function may fluctuate considerably over the next week. Plan focused work during projected peak days.',
          severity: 'neutral'
        });
      }
      
      // Check for weekend patterns
      const today = new Date();
      const daysToWeekend = 5 - today.getDay(); // 5 = Friday, assuming weekend is Sat/Sun
      
      if (daysToWeekend >= 0 && daysToWeekend < 3) {
        // Weekend is coming up soon
        const weekendStressIndex = Math.min(daysToWeekend * 3, predictiveData.stress['7days'].length - 1);
        const weekendStress = predictiveData.stress['7days'][weekendStressIndex].value;
        
        if (weekendStress > stressStart) {
          insights.push({
            title: 'Weekend Stress',
            description: 'Stress levels may rise over the weekend. Consider scheduling some relaxation activities.',
            severity: 'warning'
          });
        } else if (weekendStress < stressStart - 5) {
          insights.push({
            title: 'Relaxing Weekend',
            description: 'Your stress levels are projected to decrease over the weekend. Great opportunity to recharge.',
            severity: 'positive'
          });
        }
      }
    } else {
      // Insights for tomorrow's predictions
      // Check energy variations through the day
      const morningEnergy = predictiveData.energy['tomorrow'][8]?.value || predictiveData.energy['tomorrow'][0].value;
      const afternoonEnergy = predictiveData.energy['tomorrow'][14]?.value || predictiveData.energy['tomorrow'][0].value;
      const eveningEnergy = predictiveData.energy['tomorrow'][20]?.value || predictiveData.energy['tomorrow'][0].value;
      
      // Find peak energy time
      const energyValues = predictiveData.energy['tomorrow'].map(d => d.value);
      const maxEnergyIndex = energyValues.indexOf(Math.max(...energyValues));
      const maxEnergyHour = predictiveData.energy['tomorrow'][maxEnergyIndex].hour;
      
      insights.push({
        title: 'Peak Energy Time',
        description: `Your energy levels will likely peak around ${maxEnergyHour}:00 tomorrow. Schedule important tasks around this time for optimal performance.`,
        severity: 'positive'
      });
      
      // Check for afternoon slump
      if (afternoonEnergy < morningEnergy - 5 && afternoonEnergy < eveningEnergy) {
        insights.push({
          title: 'Afternoon Energy Dip',
          description: 'Expect a natural energy dip in the afternoon. Plan for a short break or light physical activity to counteract it.',
          severity: 'warning'
        });
      }
      
      // Check stress patterns
      const stressValues = predictiveData.stress['tomorrow'].map(d => d.value);
      const maxStressIndex = stressValues.indexOf(Math.max(...stressValues));
      const maxStressHour = predictiveData.stress['tomorrow'][maxStressIndex].hour;
      
      insights.push({
        title: 'High Stress Period',
        description: `Your stress levels may peak around ${maxStressHour}:00. Consider scheduling breathing exercises or a short break around this time.`,
        severity: 'warning'
      });
      
      // Check cognitive performance
      const cognitiveValues = predictiveData.cognitive['tomorrow'].map(d => d.value);
      const maxCognitiveIndex = cognitiveValues.indexOf(Math.max(...cognitiveValues));
      const maxCognitiveHour = predictiveData.cognitive['tomorrow'][maxCognitiveIndex].hour;
      
      insights.push({
        title: 'Optimal Focus Time',
        description: `Your cognitive performance will likely be highest at ${maxCognitiveHour}:00. Plan deep work or complex tasks during this period.`,
        severity: 'positive'
      });
    }
    
    // Add general insight if no specific insights were generated
    if (insights.length === 0) {
      insights.push({
        title: 'Stable Health Metrics',
        description: `Your health metrics are projected to remain relatively stable ${timeRange === '7days' ? 'over the next 7 days' : 'throughout tomorrow'}.`,
        severity: 'neutral'
      });
    }
    
    return insights;
  };