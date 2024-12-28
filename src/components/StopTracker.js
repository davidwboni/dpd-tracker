import ModernDashboard from './ModernDashboard';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {  
  PlusCircle, 
  BarChart2, 
  Settings, 
  Calendar,
  Loader2,
  Calculator 
} from 'lucide-react';
import { Alert, AlertDescription } from "./ui/alert";
import PaymentConfig from './PaymentConfig';
import StatsOverview from './StatsOverview';
import WeeklySummary from './WeeklySummary';
import EntriesList from './EntriesList';
import ExpenseTracker from './ExpenseTracker';
import { useSyncData } from '../hooks/useSyncData';

const StopTracker = () => {
  const { 
    data: logs, 
    loading: logsLoading, 
    error: logsError, 
    updateData: updateLogs 
  } = useSyncData('logs');

  const [activeTab, setActiveTab] = useState('entry');
  const [isLoading, setIsLoading] = useState(false);

  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split('T')[0],
    stops: '',
    extra: '',
    notes: ''
  });

  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = localStorage.getItem('payment-config');
    return saved ? JSON.parse(saved) : {
      cutoffPoint: 110,
      rateBeforeCutoff: 1.98,
      rateAfterCutoff: 1.48
    };
  });

  const [showAlert, setShowAlert] = useState('');
  const [alertType, setAlertType] = useState('default');

  useEffect(() => {
    localStorage.setItem('payment-config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  const calculateRate = (stops) => {
    if (stops <= paymentConfig.cutoffPoint) {
      return stops * paymentConfig.rateBeforeCutoff;
    }
    return (paymentConfig.cutoffPoint * paymentConfig.rateBeforeCutoff) + 
           ((stops - paymentConfig.cutoffPoint) * paymentConfig.rateAfterCutoff);
  };

  const displayAlert = (message, type = 'default') => {
    setShowAlert(message);
    setAlertType(type);
    setTimeout(() => {
      setShowAlert('');
      setAlertType('default');
    }, 3000);
  };

  const handleAddEntry = async () => {
    if (!currentLog.stops) {
      displayAlert('Please enter number of stops', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const stops = parseInt(currentLog.stops);
      const extra = currentLog.extra ? parseFloat(currentLog.extra) : 0;
      const total = calculateRate(stops) + extra;

      const newLog = {
        id: Date.now(),
        date: currentLog.date,
        stops,
        extra,
        total,
        notes: currentLog.notes
      };

      const updatedLogs = [...(logs || []), newLog]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      await updateLogs(updatedLogs);
      
      setCurrentLog({ 
        ...currentLog, 
        stops: '', 
        extra: '', 
        notes: '' 
      });
      displayAlert('Entry added successfully', 'success');
    } catch (error) {
      displayAlert('Error adding entry. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      const updatedLogs = (logs || []).filter(log => log.id !== id);
      await updateLogs(updatedLogs);
      displayAlert('Entry deleted successfully', 'success');
    } catch (error) {
      displayAlert('Error deleting entry', 'error');
    }
  };

  if (logsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (logsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading data. Please try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Navigation Tabs */}
      <div className="flex rounded-lg shadow-sm bg-white dark:bg-gray-800 p-1 sticky top-0 z-10">
        <Button
          variant={activeTab === 'entry' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveTab('entry')}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Entry</span>
        </Button>
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveTab('stats')}
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Stats</span>
        </Button>
        <Button
          variant={activeTab === 'expenses' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveTab('expenses')}
        >
          <Calculator className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Expenses</span>
        </Button>
        <Button
          variant={activeTab === 'weekly' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveTab('weekly')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Weekly</span>
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </div>

      {/* Entry Tab */}
      {activeTab === 'entry' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="date"
                value={currentLog.date}
                onChange={(e) => setCurrentLog({ ...currentLog, date: e.target.value })}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Number of stops"
                value={currentLog.stops}
                onChange={(e) => setCurrentLog({ ...currentLog, stops: e.target.value })}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Extra pay (optional)"
                value={currentLog.extra}
                onChange={(e) => setCurrentLog({ ...currentLog, extra: e.target.value })}
                step="0.01"
                className="w-full"
              />
              <Input
                type="text"
                placeholder="Notes (optional)"
                value={currentLog.notes}
                onChange={(e) => setCurrentLog({ ...currentLog, notes: e.target.value })}
                className="w-full"
              />
              <Button 
                onClick={handleAddEntry} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Entry'
                )}
              </Button>
            </CardContent>
          </Card>

          {(logs || []).length > 0 && <EntriesList logs={logs || []} onDeleteEntry={handleDeleteEntry} />}
        </>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && <ModernDashboard data={logs || []} />}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && <ExpenseTracker />}

      {/* Weekly Tab */}
      {activeTab === 'weekly' && <WeeklySummary logs={logs || []} />}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <PaymentConfig
          currentConfig={paymentConfig}
          onSave={setPaymentConfig}
        />
      )}

      {/* Alert */}
      {showAlert && (
        <Alert 
          className={`fixed bottom-4 left-4 right-4 ${
            alertType === 'success' ? 'bg-green-50 border-green-200' :
            alertType === 'error' ? 'bg-red-50 border-red-200' :
            'bg-gray-50 border-gray-200'
          }`}
        >
          <AlertDescription className={`${
            alertType === 'success' ? 'text-green-800' :
            alertType === 'error' ? 'text-red-800' :
            'text-gray-800'
          }`}>
            {showAlert}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StopTracker;