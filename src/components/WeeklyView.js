import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const WeeklyView = ({ logs }) => {
  const weeklyData = React.useMemo(() => {
    const weeks = {};
    logs.forEach(log => {
      const date = new Date(log.date);
      const weekNumber = getWeekNumber(date);
      const weekKey = `${date.getFullYear()}-W${weekNumber}`;
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          stops: 0,
          earnings: 0,
          days: new Set(),
          weekStart: getWeekStart(date)
        };
      }
      
      weeks[weekKey].stops += log.stops;
      weeks[weekKey].earnings += log.total;
      weeks[weekKey].days.add(log.date);
    });
    
    return Object.entries(weeks).map(([key, data]) => ({
      week: key,
      ...data,
      daysWorked: data.days.size,
      weekStart: data.weekStart
    })).sort((a, b) => b.weekStart - a.weekStart);
  }, [logs]);

  return (
    <div className="space-y-4">
      {weeklyData.map((week) => (
        <Card key={week.week} className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Week {week.week.split('-W')[1]} ({week.weekStart.toLocaleDateString()} - {
                new Date(week.weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()
              })
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Stops</div>
                <div className="text-xl font-bold dark:text-white">{week.stops}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Earnings</div>
                <div className="text-xl font-bold dark:text-white">£{week.earnings.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Days Worked</div>
                <div className="text-xl font-bold dark:text-white">{week.daysWorked}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWeekStart(d) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export default WeeklyView;