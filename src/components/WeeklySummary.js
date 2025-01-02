import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from 'framer-motion';
import { 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, CalendarDays } from 'lucide-react';

const WeeklySummary = ({ logs }) => {
  const weeklySummary = useMemo(() => {
    const weeks = {};
    
    logs.forEach(log => {
      const date = new Date(log.date);
      const weekNum = getWeekNumber(date);
      const weekKey = `${date.getFullYear()}-W${weekNum}`;
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          weekNumber: weekNum,
          startDate: getWeekStart(date),
          stops: 0,
          earnings: 0,
          days: new Set(),
          dailyData: []
        };
      }
      
      weeks[weekKey].stops += log.stops;
      weeks[weekKey].earnings += log.total;
      weeks[weekKey].days.add(log.date);
      weeks[weekKey].dailyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        stops: log.stops,
        earnings: log.total
      });
    });

    return Object.entries(weeks)
      .map(([key, data]) => ({
        ...data,
        weekKey: key,
        daysWorked: data.days.size,
        averageStops: Math.round(data.stops / data.days.size) || 0,
        averageEarnings: data.earnings / data.days.size || 0
      }))
      .sort((a, b) => b.startDate - a.startDate);
  }, [logs]);

  const StatCard = ({ title, value, subtitle, icon: Icon }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
          <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {weeklySummary.map((week) => (
        <Card key={week.weekKey} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Week {week.weekNumber}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {week.startDate.toLocaleDateString()} - {
                  new Date(week.startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()
                }
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Stops"
                value={week.stops}
                subtitle={`${week.daysWorked} days worked`}
                icon={CalendarDays}
              />
              <StatCard
                title="Average Stops"
                value={week.averageStops}
                subtitle="per day"
                icon={TrendingUp}
              />
              <StatCard
                title="Total Earnings"
                value={`£${week.earnings.toFixed(2)}`}
                subtitle={`£${week.averageEarnings.toFixed(2)} per day`}
                icon={DollarSign}
              />
            </div>

            {/* Weekly Performance Chart */}
            {week.dailyData.length > 0 && (
              <div className="h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={week.dailyData}>
                    <defs>
                      <linearGradient id={`gradient-${week.weekNumber}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="stops"
                      stroke="#8b5cf6"
                      fill={`url(#gradient-${week.weekNumber})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper functions
const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default WeeklySummary;