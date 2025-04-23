
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const Analytics = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Analytics Dashboard
        </h1>
        <AnalyticsDashboard />
      </div>
    </MainLayout>
  );
};

export default Analytics;
