import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const WeeklySummary = ({ logs }) => {
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const groupByWeek = logs.reduce((acc, log) => {
    const weekNum = getWeekNumber(log.date);
    if (!acc[weekNum]) acc[weekNum] = [];
    acc[weekNum].push(log);
    return acc;
  }, {});

  const weeklyStats = Object.entries(groupByWeek).map(([week, logs]) => ({
    week,
    totalStops: logs.reduce((sum, log) => sum + log.stops, 0),
    totalEarnings: logs.reduce((sum, log) => sum + log.total, 0),
    averageStops: logs.reduce((sum, log) => sum + log.stops, 0) / logs.length
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyStats.map((stat) => (
            <div key={stat.week} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Week {stat.week}</div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <div className="text-xs text-gray-500">Total Stops</div>
                  <div className="font-bold">{stat.totalStops}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Average</div>
                  <div className="font-bold">{Math.round(stat.averageStops)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Earnings</div>
                  <div className="font-bold">£{stat.totalEarnings.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;