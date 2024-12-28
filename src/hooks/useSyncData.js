import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { syncData } from '../services/firebase';

export const useSyncData = (dataType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe;

    const initSync = async () => {
      try {
        // Load initial data from localStorage as fallback
        const localData = localStorage.getItem(`delivery-${dataType}`);
        if (localData) {
          setData(JSON.parse(localData));
        }

        // Subscribe to real-time updates
        if (dataType === 'logs') {
          unsubscribe = syncData.subscribeToDeliveryLogs(user.uid, (newData) => {
            setData(newData);
            localStorage.setItem(`delivery-${dataType}`, JSON.stringify(newData));
          });
        } else if (dataType === 'expenses') {
          unsubscribe = syncData.subscribeToExpenses(user.uid, (newData) => {
            setData(newData);
            localStorage.setItem(`delivery-${dataType}`, JSON.stringify(newData));
          });
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    initSync();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, dataType]);

  const updateData = async (newData) => {
    if (!user) return;

    try {
      if (dataType === 'logs') {
        await syncData.saveDeliveryLogs(user.uid, newData);
      } else if (dataType === 'expenses') {
        await syncData.saveExpenses(user.uid, newData);
      }
      
      // Update local storage as fallback
      localStorage.setItem(`delivery-${dataType}`, JSON.stringify(newData));
      setData(newData);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    updateData
  };
};

export const useBackup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBackup = async () => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const backup = await syncData.backupAllData(user.uid);
      setLoading(false);
      return backup;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  const restoreBackup = async (backupData) => {
    if (!user) return false;

    setLoading(true);
    try {
      await syncData.restoreFromBackup(user.uid, backupData);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err);
      setLoading(false);
      return false;
    }
  };

  return {
    createBackup,
    restoreBackup,
    loading,
    error
  };
};

export default useSyncData;