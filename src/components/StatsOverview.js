import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StatsOverview = ({ logs }) => {
  const last7Days = logs
    .slice(-7)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const stats = {
    totalEarnings: logs.reduce((sum, log) => sum + log.total, 0),
    averageStops: logs.reduce((sum, log) => sum + log.stops, 0) / logs.length,
    bestDay: logs.reduce((best, log) => log.stops > best.stops ? log : best, logs[0]),
    totalDays: logs.length
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-xl font-bold mt-1">£{stats.totalEarnings.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Average Stops</p>
          <p className="text-xl font-bold mt-1">{Math.round(stats.averageStops)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Best Day</p>
          <p className="text-xl font-bold mt-1">{stats.bestDay?.stops || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.bestDay?.date ? new Date(stats.bestDay.date).toLocaleDateString() : '-'}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Days</p>
          <p className="text-xl font-bold mt-1">{stats.totalDays}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()} 
                />
                <YAxis width={30} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [value, "Stops"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="stops" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;