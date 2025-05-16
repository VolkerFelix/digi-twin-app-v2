// Example component using health data
import React from 'react';
import { useHealthData } from '../context/DataContext';

const HealthMetricsDisplay = () => {
  const { healthData, loading, error, lastUpdate, refreshHealthData } = useHealthData();

  if (loading) return <div>Loading health data...</div>;
  if (error) return <div>Error loading health data: {error}</div>;
  if (!healthData) return <div>No health data available</div>;

  return (
    <div>
      <h3>Your Health Metrics</h3>
      <button onClick={refreshHealthData}>Refresh</button>
      <p>Last updated: {lastUpdate?.toLocaleString()}</p>
      
      <div className="metrics-grid">
        {healthData.map(record => (
          <div key={record.id} className="metric-card">
            <h4>Data from {new Date(record.timestamp).toLocaleString()}</h4>
            <p>Steps: {record.steps || 'N/A'}</p>
            <p>Heart Rate: {record.heart_rate || 'N/A'} bpm</p>
            <p>Energy Burned: {record.active_energy_burned || 'N/A'} kcal</p>
            {/* Additional metrics as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthMetricsDisplay;