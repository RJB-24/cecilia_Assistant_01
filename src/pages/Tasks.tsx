
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import TaskList from "@/components/tasks/TaskList";

const Tasks = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Task Management
        </h1>
        <TaskList />
      </div>
    </MainLayout>
  );
};

export default Tasks;
