import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Trash2, PlusCircle, FileText, ChartBar, Settings, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from "./ui/alert";
import PaymentConfig from './PaymentConfig';
import StatsOverview from './StatsOverview';
import WeeklySummary from './WeeklySummary';

const StopTracker = () => {
  const [activeTab, setActiveTab] = useState('entry');
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('delivery-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoiceRange, setInvoiceRange] = useState({
    startDate: '',
    endDate: '',
    totalStops: ''
  });

  const [comparisonResult, setComparisonResult] = useState(null);

  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split('T')[0],
    stops: '',
    extra: ''
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

  useEffect(() => {
    localStorage.setItem('delivery-logs', JSON.stringify(logs));
  }, [logs]);

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

  const handleAddEntry = () => {
    if (!currentLog.stops) {
      setShowAlert('Please enter number of stops');
      return;
    }

    const stops = parseInt(currentLog.stops);
    const extra = currentLog.extra ? parseFloat(currentLog.extra) : 0;
    const total = calculateRate(stops) + extra;

    const newLog = {
      id: Date.now(),
      date: currentLog.date,
      stops,
      extra,
      total
    };

    setLogs(prev => [...prev, newLog].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setCurrentLog({ ...currentLog, stops: '', extra: '' });
    setShowAlert('Entry added successfully');
    setTimeout(() => setShowAlert(''), 3000);
  };

  const handleDeleteEntry = (id) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const compareInvoice = () => {
    const { startDate, endDate, totalStops } = invoiceRange;
    const filteredLogs = logs.filter(log => {
      const date = new Date(log.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    const yourStops = filteredLogs.reduce((sum, log) => sum + log.stops, 0);
    const difference = yourStops - parseInt(totalStops);

    setComparisonResult({
      yourStops,
      invoiceStops: parseInt(totalStops),
      difference
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
     <div className="flex rounded-lg shadow-sm bg-white p-1 sticky top-0 z-10">
  <Button
    variant={activeTab === 'entry' ? 'default' : 'ghost'}
    className="flex-1"
    onClick={() => setActiveTab('entry')}
  >
    <PlusCircle className="w-4 h-4 mr-2" />
    Entry
  </Button>
  <Button
    variant={activeTab === 'stats' ? 'default' : 'ghost'}
    className="flex-1"
    onClick={() => setActiveTab('stats')}
  >
    <ChartBar className="w-4 h-4 mr-2" />
    Stats
  </Button>
  <Button
    variant={activeTab === 'invoice' ? 'default' : 'ghost'}
    className="flex-1"
    onClick={() => setActiveTab('invoice')}
  >
    <FileText className="w-4 h-4 mr-2" />
    Invoice
  </Button>
  <Button
    variant={activeTab === 'weekly' ? 'default' : 'ghost'}
    className="flex-1"
    onClick={() => setActiveTab('weekly')}
  >
    <Calendar className="w-4 h-4 mr-2" />
    Weekly
  </Button>
  <Button
    variant={activeTab === 'settings' ? 'default' : 'ghost'}
    className="flex-1"
    onClick={() => setActiveTab('settings')}
  >
    <Settings className="w-4 h-4 mr-2" />
    Settings
  </Button>
</div>

      {activeTab === 'entry' && (
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
            <Button onClick={handleAddEntry} className="w-full">Add Entry</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'stats' && <StatsOverview logs={logs} />}

      {activeTab === 'invoice' && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="date"
              placeholder="Start Date"
              value={invoiceRange.startDate}
              onChange={(e) => setInvoiceRange({...invoiceRange, startDate: e.target.value})}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={invoiceRange.endDate}
              onChange={(e) => setInvoiceRange({...invoiceRange, endDate: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Invoice Total Stops"
              value={invoiceRange.totalStops}
              onChange={(e) => setInvoiceRange({...invoiceRange, totalStops: e.target.value})}
            />
            <Button className="w-full" onClick={compareInvoice}>Compare</Button>

            {comparisonResult && (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Your Total</div>
                    <div className="text-xl font-bold">{comparisonResult.yourStops}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Invoice Total</div>
                    <div className="text-xl font-bold">{comparisonResult.invoiceStops}</div>
                  </div>
                </div>
                <div className={`p-3 rounded ${comparisonResult.difference === 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-sm">Difference</div>
                  <div className={`text-xl font-bold ${comparisonResult.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonResult.difference > 0 ? '+' : ''}{comparisonResult.difference}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

{activeTab === 'stats' && <StatsOverview logs={logs} />}

{activeTab === 'weekly' && <WeeklySummary logs={logs} />}
{activeTab === 'weekly' && <WeeklySummary logs={logs} />}

      {activeTab === 'settings' && (
        <PaymentConfig
          currentConfig={paymentConfig}
          onSave={setPaymentConfig}
        />
      )}

      {logs.length > 0 && activeTab === 'entry' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {logs.slice().reverse().slice(0, 5).map(log => (
                <div key={log.id} className="flex justify-between items-center p-4">
                  <div>
                    <div className="font-medium">{new Date(log.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">
                      {log.stops} stops {log.extra > 0 ? `+ £${log.extra}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-medium">£{log.total.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(log.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showAlert && (
        <Alert className="fixed bottom-4 left-4 right-4">
          <AlertDescription>{showAlert}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StopTracker;