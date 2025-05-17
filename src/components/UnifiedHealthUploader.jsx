import React, { useState } from 'react';
import { uploadHealthData } from '../utils/healthDataService';
import { 
  Activity, 
  Heart, 
  Moon, 
  Zap, 
  Clock, 
  Send, 
  PlusCircle,
  MinusCircle
} from 'lucide-react';

/**
 * Component for simulating and uploading comprehensive health data
 */
const UnifiedHealthUploader = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceId, setDeviceId] = useState('health-simulator-001');
  
  // Common health metrics
  const [steps, setSteps] = useState(8500);
  const [heartRate, setHeartRate] = useState(68);
  const [activeEnergyBurned, setActiveEnergyBurned] = useState(350);
  
  // Sleep data
  const [includeSleep, setIncludeSleep] = useState(false);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState('good'); // 'poor', 'good', 'excellent'
  const [bedTime, setBedTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:00');
  
  // Additional metrics
  const [includeAdditionalMetrics, setIncludeAdditionalMetrics] = useState(false);
  const [bloodOxygen, setBloodOxygen] = useState(97);
  const [restingHeartRate, setRestingHeartRate] = useState(62);
  const [hrv, setHrv] = useState(45);
  const [respiratoryRate, setRespiratoryRate] = useState(15);
  const [stressLevel, setStressLevel] = useState(35);

  // Handle upload of health data
  const handleUploadHealthData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Generate timestamp for the data - current time
      const now = new Date();
      
      // Build the health data object
      const healthData = {
        device_id: deviceId,
        timestamp: now.toISOString(),
        steps: steps,
        heart_rate: heartRate,
        active_energy_burned: activeEnergyBurned
      };
      
      // Add sleep data if included
      if (includeSleep) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Parse bed time and wake time
        const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
        const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
        
        // Set bed time to yesterday evening
        const bedDateTime = new Date(yesterday);
        bedDateTime.setHours(bedHours, bedMinutes, 0, 0);
        
        // Set wake time to this morning
        const wakeDateTime = new Date(now);
        wakeDateTime.setHours(wakeHours, wakeMinutes, 0, 0);
        
        // Calculate time in bed (milliseconds to hours)
        const timeInBedMs = wakeDateTime.getTime() - bedDateTime.getTime();
        const timeInBedHours = timeInBedMs / (1000 * 60 * 60);
        
        healthData.sleep = {
          total_sleep_hours: sleepHours,
          in_bed_time: Math.floor(bedDateTime.getTime() / 1000), // Unix timestamp in seconds
          out_bed_time: Math.floor(wakeDateTime.getTime() / 1000), // Unix timestamp in seconds
          time_in_bed: timeInBedHours,
          quality: sleepQuality
        };
      }
      
      // Add additional metrics if included
      if (includeAdditionalMetrics) {
        healthData.additional_metrics = {
          blood_oxygen: bloodOxygen,
          resting_heart_rate: restingHeartRate,
          hrv: hrv,
          respiratory_rate: respiratoryRate,
          stress_level: stressLevel
        };
      }
      
      // Upload to the server
      const result = await uploadHealthData(healthData);
      
      if (result.success) {
        setSuccess(`Health data uploaded successfully! Sync ID: ${result.data.sync_id}`);
        
        // Notify parent component if callback provided
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        setError(result.error || 'Failed to upload health data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Health data upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-indigo-600" />
        Health Data Simulator
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="deviceId" className="block text-gray-700 mb-2 text-sm">
          Device ID
        </label>
        <input
          id="deviceId"
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>
      
      {/* Basic Health Metrics */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
          <Heart className="h-4 w-4 mr-1 text-red-500" />
          Basic Health Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="steps" className="block text-gray-700 mb-2 text-xs">
              Steps
            </label>
            <input
              id="steps"
              type="number"
              min="0"
              max="50000"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="heartRate" className="block text-gray-700 mb-2 text-xs">
              Heart Rate (bpm)
            </label>
            <input
              id="heartRate"
              type="number"
              min="40"
              max="200"
              value={heartRate}
              onChange={(e) => setHeartRate(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="activeEnergy" className="block text-gray-700 mb-2 text-xs">
              Active Energy (kcal)
            </label>
            <input
              id="activeEnergy"
              type="number"
              min="0"
              max="2000"
              value={activeEnergyBurned}
              onChange={(e) => setActiveEnergyBurned(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Sleep Data Toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIncludeSleep(!includeSleep)}
          className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg text-left ${
            includeSleep 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          <span className="flex items-center">
            <Moon className="h-4 w-4 mr-2" />
            <span className="font-medium">Include Sleep Data</span>
          </span>
          
          {includeSleep ? (
            <MinusCircle className="h-4 w-4 text-indigo-600" />
          ) : (
            <PlusCircle className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
      
      {/* Sleep Data Form */}
      {includeSleep && (
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h3 className="text-md font-medium text-indigo-800 mb-3 flex items-center">
            <Moon className="h-4 w-4 mr-1 text-indigo-600" />
            Sleep Data
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sleepHours" className="block text-gray-700 mb-2 text-xs">
                Sleep Duration (hours)
              </label>
              <input
                id="sleepHours"
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="sleepQuality" className="block text-gray-700 mb-2 text-xs">
                Sleep Quality
              </label>
              <select
                id="sleepQuality"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="poor">Poor</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="bedTime" className="block text-gray-700 mb-2 text-xs">
                <Moon className="h-3 w-3 inline mr-1" /> Bed Time (yesterday)
              </label>
              <input
                id="bedTime"
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="wakeTime" className="block text-gray-700 mb-2 text-xs">
                <Zap className="h-3 w-3 inline mr-1" /> Wake Time (today)
              </label>
              <input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Additional Metrics Toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIncludeAdditionalMetrics(!includeAdditionalMetrics)}
          className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg text-left ${
            includeAdditionalMetrics 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          <span className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            <span className="font-medium">Include Additional Metrics</span>
          </span>
          
          {includeAdditionalMetrics ? (
            <MinusCircle className="h-4 w-4 text-blue-600" />
          ) : (
            <PlusCircle className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
      
      {/* Additional Metrics Form */}
      {includeAdditionalMetrics && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-md font-medium text-blue-800 mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-1 text-blue-600" />
            Additional Health Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bloodOxygen" className="block text-gray-700 mb-2 text-xs">
                Blood Oxygen (SpO2 %)
              </label>
              <input
                id="bloodOxygen"
                type="number"
                min="80"
                max="100"
                value={bloodOxygen}
                onChange={(e) => setBloodOxygen(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="restingHeartRate" className="block text-gray-700 mb-2 text-xs">
                Resting Heart Rate (bpm)
              </label>
              <input
                id="restingHeartRate"
                type="number"
                min="40"
                max="100"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="hrv" className="block text-gray-700 mb-2 text-xs">
                Heart Rate Variability (ms)
              </label>
              <input
                id="hrv"
                type="number"
                min="10"
                max="100"
                value={hrv}
                onChange={(e) => setHrv(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="respiratoryRate" className="block text-gray-700 mb-2 text-xs">
                Respiratory Rate (breaths/min)
              </label>
              <input
                id="respiratoryRate"
                type="number"
                min="10"
                max="30"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="stressLevel" className="block text-gray-700 mb-2 text-xs">
                Stress Level (0-100)
              </label>
              <input
                id="stressLevel"
                type="number"
                min="0"
                max="100"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        onClick={handleUploadHealthData}
        disabled={loading}
        className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <>
            <Clock className="animate-spin h-4 w-4 mr-2" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            <span>Upload Health Data</span>
          </>
        )}
      </button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This will upload comprehensive health data that mimics Apple HealthKit data format.</p>
        <p>After uploading, the analyzer will process the data and send notifications via WebSocket.</p>
      </div>
    </div>
  );
};

export default UnifiedHealthUploader;