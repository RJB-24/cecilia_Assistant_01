
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Home as HomeIcon, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Book,
  Music,
  Sun,
  Moon,
  Activity,
  Bell,
  Settings,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 1000);

    updateGreeting();
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { icon: Brain, label: "Ask Cecilia", to: "/command-center", color: "bg-blue-500" },
    { icon: Calendar, label: "Schedule", to: "/tasks", color: "bg-green-500" },
    { icon: MessageCircle, label: "Messages", to: "/messages", color: "bg-purple-500" },
    { icon: Heart, label: "Health", to: "/health", color: "bg-red-500" }
  ];

  const todayStats = [
    { label: "Steps", value: "8,543", goal: "10,000", progress: 85, icon: Activity },
    { label: "Tasks", value: "7/12", goal: "12", progress: 58, icon: Target },
    { label: "Learning", value: "45m", goal: "60m", progress: 75, icon: Book },
    { label: "Focus", value: "3.2h", goal: "4h", progress: 80, icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>LifeOS - Your Ultimate AI Assistant</title>
      </Helmet>

      <div className="container py-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {greeting}, John! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {currentTime.getHours() < 18 ? (
              <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500" />
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-orange-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access your most-used features instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.to}>
                  <Button
                    variant="outline"
                    className="h-20 w-full flex flex-col items-center justify-center space-y-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {todayStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <stat.icon className="h-4 w-4 mr-2 text-blue-500" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <Progress value={stat.progress} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Goal: {stat.goal}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Assistant Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                Cecilia AI Assistant
              </CardTitle>
              <CardDescription>Your intelligent companion is ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Active & Learning</span>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Recent Capabilities:</div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Advanced reasoning with DeepSeek R1
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Real-time web search & code execution
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Voice synthesis & transcription
                  </div>
                </div>
              </div>

              <Link to="/command-center" className="block">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-500" />
                Today's Activity
              </CardTitle>
              <CardDescription>Your progress across all areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Brain className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Completed AI workflow automation</div>
                      <div className="text-sm text-muted-foreground">15 minutes ago</div>
                    </div>
                  </div>
                  <Badge>New</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Reached daily step goal</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Health</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Book className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Finished React course module</div>
                      <div className="text-sm text-muted-foreground">4 hours ago</div>
                    </div>
                  </div>
                  <Badge variant="outline">Learning</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <HomeIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Morning routine automated</div>
                      <div className="text-sm text-muted-foreground">This morning</div>
                    </div>
                  </div>
                  <Badge variant="outline">Smart Home</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/health">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Health & Wellness
                </CardTitle>
                <CardDescription>Track fitness, nutrition, and mental well-being</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm text-muted-foreground">Wellness Score</div>
                </div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/smart-home">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <HomeIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Smart Home
                </CardTitle>
                <CardDescription>Control and automate your connected devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm text-muted-foreground">Devices Online</div>
                </div>
                <div className="mt-2 text-sm text-green-600">All systems running smoothly</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/learning">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Book className="h-5 w-5 mr-2 text-purple-500" />
                  Learning
                </CardTitle>
                <CardDescription>Expand your skills with personalized courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Active Courses</div>
                </div>
                <div className="mt-2 text-sm text-blue-600">7-day learning streak 🔥</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/messages">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                  Messages
                </CardTitle>
                <CardDescription>Unified communication hub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Unread Messages</div>
                </div>
                <div className="mt-2 text-sm text-orange-600">3 important conversations</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/entertainment">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Music className="h-5 w-5 mr-2 text-pink-500" />
                  Entertainment
                </CardTitle>
                <CardDescription>Discover content and plan activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">47h</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
                <div className="mt-2 text-sm text-pink-600">Jazz concert tonight 🎵</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                  Analytics
                </CardTitle>
                <CardDescription>Insights into your patterns and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">+12%</div>
                  <div className="text-sm text-muted-foreground">Productivity</div>
                </div>
                <div className="mt-2 text-sm text-indigo-600">Weekly improvement trend</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Notifications & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-yellow-500" />
              Today's Highlights & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Upcoming Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Team standup in 2 hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Music className="h-4 w-4 text-purple-500" />
                    <span>Jazz Night at Blue Note - Tonight 8PM</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Workout reminder - 6PM</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Smart Suggestions</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Brain className="h-4 w-4 text-green-500" />
                    <span>Time to take a break - you've been focused for 2 hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <HomeIcon className="h-4 w-4 text-orange-500" />
                    <span>Evening routine will start automatically at 9PM</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Book className="h-4 w-4 text-blue-500" />
                    <span>Continue your React course - 15 minutes left in module</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
