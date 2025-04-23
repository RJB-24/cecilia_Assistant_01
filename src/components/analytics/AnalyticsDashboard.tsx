
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', tasks: 4, automation: 2, commands: 8 },
  { name: 'Tue', tasks: 6, automation: 4, commands: 12 },
  { name: 'Wed', tasks: 8, automation: 5, commands: 15 },
  { name: 'Thu', tasks: 5, automation: 3, commands: 10 },
  { name: 'Fri', tasks: 7, automation: 6, commands: 14 },
];

const stats = [
  { title: "Total Tasks", value: "156", change: "+12%", changeType: "positive" },
  { title: "Automation Success Rate", value: "94%", change: "+3%", changeType: "positive" },
  { title: "Commands Processed", value: "1,234", change: "+18%", changeType: "positive" },
  { title: "Average Response Time", value: "0.8s", change: "-25%", changeType: "positive" },
];

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="jarvis-hologram">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-jarvis-secondary">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-jarvis-primary jarvis-glow-text">
                  {stat.value}
                </div>
                <div className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="jarvis-hologram">
        <CardHeader>
          <CardTitle className="text-xl font-bold jarvis-glow-text">
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#8b5cf6" />
                <Line type="monotone" dataKey="automation" stroke="#3b82f6" />
                <Line type="monotone" dataKey="commands" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
