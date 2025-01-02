import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Plus, TrendingUp, FileCheck } from 'lucide-react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`${color} opacity-80 p-3 bg-gray-100 dark:bg-gray-700 rounded-full`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const StatsOverview = ({ logs }) => {
  // Calculate metrics
  const totalStops = logs.reduce((sum, entry) => sum + entry.stops, 0);
  const averageStops = Math.round(totalStops / logs.length) || 0;
  const bestDay = logs.reduce((best, entry) => 
    entry.stops > (best?.stops || 0) ? entry : best, null);

  // Prepare chart data
  const weeklyData = React.useMemo(() => {
    const last7Days = logs.slice(-7).map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      stops: entry.stops,
      earnings: entry.total
    }));
    return last7Days;
  }, [logs]);

  const monthlyData = React.useMemo(() => {
    const byMonth = logs.reduce((acc, entry) => {
      const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) acc[month] = { stops: 0, earnings: 0, count: 0 };
      acc[month].stops += entry.stops;
      acc[month].earnings += entry.total;
      acc[month].count += 1;
      return acc;
    }, {});

    return Object.entries(byMonth).map(([month, stats]) => ({
      month,
      averageStops: Math.round(stats.stops / stats.count),
      totalEarnings: stats.earnings
    }));
  }, [logs]);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Stops"
          value={logs[logs.length - 1]?.stops || 0}
          subtitle="Latest entry"
          icon={Plus}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Average Stops"
          value={averageStops}
          subtitle="All time"
          icon={TrendingUp}
          color="text-purple-600 dark:text-purple-400"
        />
        <DashboardCard
          title="Best Day"
          value={bestDay?.stops || 0}
          subtitle={bestDay ? new Date(bestDay.date).toLocaleDateString() : 'No data'}
          icon={FileCheck}
          color="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                    <Bar 
                      dataKey="stops" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="averageStops" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalEarnings" 
                      stroke="#ec4899" 
                      strokeWidth={2}
                      dot={{ fill: '#ec4899', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsOverview;