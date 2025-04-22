
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample usage data
const usageData = [
  { name: 'Email Tasks', count: 42, color: '#33C3F0' },
  { name: 'Social Media', count: 28, color: '#9b87f5' },
  { name: 'Calendar', count: 18, color: '#4CAF50' },
  { name: 'Data Analysis', count: 15, color: '#FFC107' },
  { name: 'Web Browsing', count: 10, color: '#FF5252' },
];

// Usage by time
const timeData = [
  { time: '8 AM', tasks: 8 },
  { time: '10 AM', tasks: 15 },
  { time: '12 PM', tasks: 12 },
  { time: '2 PM', tasks: 18 },
  { time: '4 PM', tasks: 22 },
  { time: '6 PM', tasks: 11 },
];

const UsageStatistics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Usage Statistics</CardTitle>
        <CardDescription>
          Most used features and patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-60">
          <p className="mb-2 text-sm font-medium text-jarvis-secondary">Features Used</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={usageData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#323850" />
              <XAxis dataKey="name" stroke="#9b87f5" />
              <YAxis stroke="#9b87f5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #9b87f5',
                  borderRadius: '8px',
                  color: '#9b87f5',
                }}
              />
              <Bar dataKey="count" name="Usage Count" fill="#33C3F0" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-60">
          <p className="mb-2 text-sm font-medium text-jarvis-secondary">Usage by Time of Day</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#323850" />
              <XAxis dataKey="time" stroke="#9b87f5" />
              <YAxis stroke="#9b87f5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #9b87f5',
                  borderRadius: '8px',
                  color: '#9b87f5',
                }}
              />
              <Bar dataKey="tasks" name="Task Count" fill="#9b87f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatistics;
