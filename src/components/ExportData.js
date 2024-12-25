import React from 'react';
import { Button } from "./ui/button";
import { Download } from 'lucide-react';

const ExportData = ({ logs }) => {
  const exportToCSV = () => {
    const headers = ['Date', 'Stops', 'Extra', 'Total'];
    const csvData = [
      headers,
      ...logs.map(log => [
        new Date(log.date).toLocaleDateString(),
        log.stops,
        log.extra,
        log.total
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stops-data-${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  return (
    <Button onClick={exportToCSV} variant="outline" className="w-full">
      <Download className="w-4 h-4 mr-2" />
      Export Data
    </Button>
  );
};

export default ExportData;