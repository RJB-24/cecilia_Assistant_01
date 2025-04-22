
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ListOrderedIcon, FileIcon, PlusIcon } from "lucide-react";

const Tasks = () => {
  // Sample task data
  const tasks = {
    pending: [
      {
        id: "task-1",
        title: "Draft Q1 Report Email",
        description: "Create and send Q1 performance report to the leadership team",
        priority: "high",
        dueDate: "Apr 25, 2025"
      },
      {
        id: "task-2",
        title: "Schedule Social Media Posts",
        description: "Prepare and schedule weekly social media content",
        priority: "medium",
        dueDate: "Apr 26, 2025"
      },
    ],
    inProgress: [
      {
        id: "task-3",
        title: "Update Product Documentation",
        description: "Review and update user documentation for new features",
        priority: "medium",
        dueDate: "Apr 27, 2025"
      }
    ],
    completed: [
      {
        id: "task-4",
        title: "Update Contact Database",
        description: "Sync new contacts from CRM to email marketing platform",
        priority: "low",
        completedDate: "Apr 21, 2025"
      },
      {
        id: "task-5",
        title: "Weekly Team Check-in",
        description: "Conduct weekly team sync-up meeting",
        priority: "medium",
        completedDate: "Apr 20, 2025"
      },
      {
        id: "task-6",
        title: "Review PR #123",
        description: "Review and approve code changes for feature release",
        priority: "high",
        completedDate: "Apr 19, 2025"
      }
    ]
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  const TaskItem = ({ task, status }: { task: any, status: string }) => {
    return (
      <Card className="mb-3 shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">{task.title}</h3>
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
              {task.priority}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>
              {status === "completed" 
                ? `Completed: ${task.completedDate}` 
                : `Due: ${task.dueDate}`}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <FileIcon className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-groqflow-navy">Task Management</h1>
          <Button className="bg-groqflow-navy hover:bg-groqflow-navy/80">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Task Queue</CardTitle>
                <CardDescription>Manage and monitor your tasks</CardDescription>
              </div>
              <Button variant="outline" className="bg-white">
                <ListOrderedIcon className="h-4 w-4 mr-2" />
                Priority View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending 
                  <Badge variant="outline" className="ml-2">{tasks.pending.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress
                  <Badge variant="outline" className="ml-2">{tasks.inProgress.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  <Badge variant="outline" className="ml-2">{tasks.completed.length}</Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-4">
                {tasks.pending.map((task) => (
                  <TaskItem key={task.id} task={task} status="pending" />
                ))}
              </TabsContent>
              <TabsContent value="in-progress" className="mt-4">
                {tasks.inProgress.map((task) => (
                  <TaskItem key={task.id} task={task} status="in-progress" />
                ))}
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                {tasks.completed.map((task) => (
                  <TaskItem key={task.id} task={task} status="completed" />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Tasks;
