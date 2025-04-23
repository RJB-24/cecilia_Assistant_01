
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Clock, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: "1",
      title: "Draft Q1 Report Email",
      description: "Create and send Q1 performance report to the leadership team",
      status: "in-progress",
      priority: "high",
      createdAt: "2025-04-23 10:30 AM"
    }
  ]);

  const [newTask, setNewTask] = React.useState({
    title: "",
    description: ""
  });

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      priority: "medium",
      createdAt: new Date().toLocaleString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "" });
    toast.success("Task added successfully");
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success(`Task status updated to ${newStatus}`);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="jarvis-hologram">
        <CardHeader>
          <CardTitle className="text-xl font-bold jarvis-glow-text">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task title"
              className="bg-jarvis-dark/30 border-jarvis-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
              className="bg-jarvis-dark/30 border-jarvis-border"
            />
          </div>
          <Button onClick={addTask} className="w-full">Add Task</Button>
        </CardContent>
      </Card>

      <Card className="jarvis-hologram">
        <CardHeader>
          <CardTitle className="text-xl font-bold jarvis-glow-text">Current Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="bg-jarvis-dark/30 border-jarvis-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-jarvis-light">{task.title}</h3>
                      <p className="text-sm text-jarvis-secondary">{task.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-jarvis-secondary">
                        <span>{task.createdAt}</span>
                        <span>•</span>
                        <span className="capitalize">{task.priority} Priority</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                        className="text-xs bg-jarvis-dark border border-jarvis-border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskList;
