import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Plus, TrendingUp, FileCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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

const ModernDashboard = ({ data }) => {
  const weeklyData = [
    { day: 'Mon', stops: 125, target: 120 },
    { day: 'Tue', stops: 145, target: 120 },
    { day: 'Wed', stops: 132, target: 120 },
    { day: 'Thu', stops: 148, target: 120 },
    { day: 'Fri', stops: 138, target: 120 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Stops"
          value="138"
          subtitle="+15% vs target"
          icon={Plus}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Weekly Average"
          value="142"
          subtitle="Last 7 days"
          icon={TrendingUp}
          color="text-purple-600 dark:text-purple-400"
        />
        <DashboardCard
          title="Invoice Match"
          value="98.5%"
          subtitle="Current month"
          icon={FileCheck}
          color="text-blue-600 dark:text-blue-400"
        />
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="weekly">Weekly Performance</TabsTrigger>
          <TabsTrigger value="comparison">Invoice Comparison</TabsTrigger>
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
                    <XAxis dataKey="day" />
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
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#e11d48" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
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
                      dataKey="stops" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
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

export default ModernDashboard;