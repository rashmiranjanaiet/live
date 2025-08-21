import { useState, useEffect } from 'react';
import { DisasterAlert } from '../types/disaster';
import { GDACSService } from '../services/gdacsService';

export const useGDACSData = () => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await GDACSService.fetchDisasterAlerts();
      setAlerts(data);
      setLastUpdate(new Date().toISOString());
    } catch (err) {
      setError('Failed to fetch disaster alerts');
      console.error('Error fetching GDACS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    alerts,
    isLoading,
    error,
    lastUpdate,
    refetch: fetchData
  };
};