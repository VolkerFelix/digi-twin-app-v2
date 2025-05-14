import React, { useState } from 'react';
import { uploadHealthData, generateSampleHealthData } from '../utils/healthDataService';

/**
 * Component for uploading health data to the backend
 */
const HealthDataUploader = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceId, setDeviceId] = useState('test-device-001');

  // Handle upload of sample health data
  const handleUploadSampleData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Generate sample health data
      const sampleData = generateSampleHealthData(deviceId);
      
      // Upload to the server
      const result = await uploadHealthData(sampleData);
      
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Data Uploader</h2>
      
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
        <label htmlFor="deviceId" className="block text-gray-700 mb-2">
          Device ID
        </label>
        <input
          id="deviceId"
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Identifier for the device sending health data
        </p>
      </div>
      
      <button
        onClick={handleUploadSampleData}
        disabled={loading}
        className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Uploading...' : 'Upload Sample Health Data'}
      </button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This will generate and upload realistic sample health data to test the backend integration.</p>
        <p>After uploading, you should receive a real-time notification through the WebSocket connection.</p>
      </div>
    </div>
  );
};

export default HealthDataUploader;