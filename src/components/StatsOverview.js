import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import _ from 'lodash';

const StatsOverview = ({ logs }) => {
  // Memoized calculations for performance
  const stats = useMemo(() => {
    if (!logs.length) return null;

    // Basic stats
    const totalEarnings = logs.reduce((sum, log) => sum + log.total, 0);
    const totalStops = logs.reduce((sum, log) => sum + log.stops, 0);
    const averageStops = totalStops / logs.length;
    const bestDay = logs.reduce((best, log) => log.stops > best.stops ? log : best, logs[0]);

    // Weekly performance
    const byDayOfWeek = _.groupBy(logs, log => 
      new Date(log.date).toLocaleDateString('en-US', { weekday: 'long' })
    );
    const weekdayStats = Object.entries(byDayOfWeek).map(([day, dayLogs]) => ({
      day,
      averageStops: dayLogs.reduce((sum, log) => sum + log.stops, 0) / dayLogs.length,
      totalEarnings: dayLogs.reduce((sum, log) => sum + log.total, 0)
    }));

    // Monthly trends
    const byMonth = _.groupBy(logs, log => 
      new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    );
    const monthlyTrends = Object.entries(byMonth).map(([month, monthLogs]) => ({
      month,
      totalStops: monthLogs.reduce((sum, log) => sum + log.stops, 0),
      totalEarnings: monthLogs.reduce((sum, log) => sum + log.total, 0),
      averageStops: monthLogs.reduce((sum, log) => sum + log.stops, 0) / monthLogs.length
    }));

    // Performance distribution
    const stopRanges = _.groupBy(logs, log => {
      const stops = log.stops;
      if (stops < 80) return '< 80';
      if (stops < 100) return '80-100';
      if (stops < 120) return '100-120';
      return '120+';
    });
    const distribution = Object.entries(stopRanges).map(([range, rangeLogs]) => ({
      range,
      count: rangeLogs.length,
      percentage: (rangeLogs.length / logs.length) * 100
    }));

    return {
      totalEarnings,
      averageStops,
      bestDay,
      totalDays: logs.length,
      weekdayStats,
      monthlyTrends,
      distribution,
      averageEarningsPerDay: totalEarnings / logs.length,
      averageEarningsPerStop: totalEarnings / totalStops
    };
  }, [logs]);

  if (!stats) return null;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              £{stats.averageEarningsPerDay.toFixed(2)} per day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageStops)}</div>
            <p className="text-xs text-muted-foreground">
              £{stats.averageEarningsPerStop.toFixed(2)} per stop
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestDay.stops}</div>
            <p className="text-xs text-muted-foreground">
              {new Date(stats.bestDay.date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekdayStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="averageStops" fill="#8884d8" name="Avg Stops" />
                <Bar yAxisId="right" dataKey="totalEarnings" fill="#82ca9d" name="Earnings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="averageStops" stroke="#8884d8" name="Avg Stops" />
                <Line type="monotone" dataKey="totalEarnings" stroke="#82ca9d" name="Total Earnings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stop Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Stops Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;