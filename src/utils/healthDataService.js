import { getAuthHeaders } from './auth';

/**
 * API endpoint base for health data
 * @type {string}
 */
const HEALTH_API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/health`
  : '/health';

/**
 * Fetch health data from the API
 * @returns {Promise<Object>} - The health data response
 */
export const fetchHealthData = async () => {
  try {
    const response = await fetch(`${HEALTH_API_BASE}/data`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch health data');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching health data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload health data to the API
 * @param {Object} healthData - The health data to upload
 * @returns {Promise<Object>} - The upload response
 */
export const uploadHealthData = async (healthData) => {
  try {
    const response = await fetch(`${HEALTH_API_BASE}/upload_health`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(healthData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to upload health data');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error uploading health data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate sample health data for testing
 * @param {string} deviceId - Device identifier
 * @returns {Object} - Sample health data
 */
export const generateSampleHealthData = (deviceId = 'test-device-001') => {
  // Generate realistic health metrics
  const healthData = {
    device_id: deviceId,
    timestamp: new Date().toISOString(),
    steps: Math.floor(Math.random() * 5000) + 3000, // 3000-8000 steps
    heart_rate: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
    sleep: {
      total_sleep_hours: (Math.random() * 3) + 5, // 5-8 hours
      in_bed_time: Date.now() - (8 * 60 * 60 * 1000), // 8 hours ago
      out_bed_time: Date.now() - (30 * 60 * 1000), // 30 minutes ago
      time_in_bed: (Math.random() * 3) + 6, // 6-9 hours
    },
    active_energy_burned: Math.floor(Math.random() * 300) + 200, // 200-500 calories
    additional_metrics: {
      blood_oxygen: Math.floor(Math.random() * 4) + 95, // 95-99%
      skin_temperature: Math.floor(Math.random() * 3) + 35.5, // 35.5-38.5°C
      hrv: Math.floor(Math.random() * 20) + 30, // 30-50ms
      respiratory_rate: Math.floor(Math.random() * 4) + 14, // 14-18 breaths per minute
      stress_level: Math.floor(Math.random() * 60) + 20, // 20-80 (lower is better)
    }
  };
  
  return healthData;
};