
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PerformanceMetrics from "@/components/analytics/PerformanceMetrics";
import UsageStatistics from "@/components/analytics/UsageStatistics";

const Analytics = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Analytics Dashboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceMetrics />
          <UsageStatistics />
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
