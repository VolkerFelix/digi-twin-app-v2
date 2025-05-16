// src/context/DataContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchHealthData } from '../utils/healthDataService';
import { getAuthToken, isAuthenticated } from '../utils/auth';

// Create context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Function to load health data
  const loadHealthData = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchHealthData();
      if (result.success) {
        setHealthData(result.data);
        setLastUpdate(new Date());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load health data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load health data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      loadHealthData();
    }
  }, []);

  // The context value
  const value = {
    healthData,
    loading,
    error,
    lastUpdate,
    refreshHealthData: loadHealthData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the data context
export const useHealthData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a DataProvider');
  }
  return context;
};