
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample performance data
const performanceData = [
  { name: 'Apr 16', taskCompletion: 85, errorRate: 3, responseTime: 1.2 },
  { name: 'Apr 17', taskCompletion: 83, errorRate: 4, responseTime: 1.3 },
  { name: 'Apr 18', taskCompletion: 86, errorRate: 2, responseTime: 1.1 },
  { name: 'Apr 19', taskCompletion: 90, errorRate: 1, responseTime: 0.9 },
  { name: 'Apr 20', taskCompletion: 89, errorRate: 2, responseTime: 1.0 },
  { name: 'Apr 21', taskCompletion: 92, errorRate: 1, responseTime: 0.8 },
  { name: 'Apr 22', taskCompletion: 94, errorRate: 1, responseTime: 0.7 },
];

const PerformanceMetrics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
        <CardDescription>
          System performance analysis over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#323850" />
              <XAxis dataKey="name" stroke="#9b87f5" />
              <YAxis yAxisId="left" stroke="#9b87f5" />
              <YAxis yAxisId="right" orientation="right" stroke="#FF5252" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #9b87f5',
                  borderRadius: '8px',
                  color: '#9b87f5',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="taskCompletion"
                name="Task Completion (%)"
                stroke="#33C3F0"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="errorRate"
                name="Error Rate (%)"
                stroke="#FF5252"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="responseTime"
                name="Response Time (s)"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
