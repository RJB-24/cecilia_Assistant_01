
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Activity, 
  Target, 
  Calendar, 
  TrendingUp, 
  Apple,
  Droplets,
  Moon,
  Brain
} from "lucide-react";

const Health: React.FC = () => {
  const [dailySteps] = useState(8543);
  const [stepGoal] = useState(10000);
  const [waterIntake] = useState(6);
  const [waterGoal] = useState(8);
  const [sleepHours] = useState(7.5);
  const [sleepGoal] = useState(8);

  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Health & Wellness</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Health & Wellness</h1>
          <p className="text-muted-foreground">
            Track your fitness, nutrition, and mental well-being
          </p>
        </div>

        {/* Daily Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                Steps Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailySteps.toLocaleString()}</div>
              <Progress value={(dailySteps / stepGoal) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stepGoal - dailySteps} steps to goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-400" />
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waterIntake}/{waterGoal}</div>
              <Progress value={(waterIntake / waterGoal) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {waterGoal - waterIntake} glasses remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Moon className="h-4 w-4 mr-2 text-purple-500" />
                Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sleepHours}h</div>
              <Progress value={(sleepHours / sleepGoal) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Good quality sleep
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Brain className="h-4 w-4 mr-2 text-green-500" />
                Wellness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <Progress value={85} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Very Good
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fitness" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="mental">Mental Health</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="fitness" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Activity</CardTitle>
                  <CardDescription>Your movement and exercise summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Morning Walk</span>
                    <span className="text-sm text-muted-foreground">30 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Calories Burned</span>
                    <span className="font-semibold">324 kcal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Minutes</span>
                    <span className="font-semibold">45 min</span>
                  </div>
                  <Button className="w-full mt-4">
                    <Target className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Your fitness trends this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Mon</span>
                      <Progress value={80} className="w-20" />
                    </div>
                    <div className="flex justify-between">
                      <span>Tue</span>
                      <Progress value={95} className="w-20" />
                    </div>
                    <div className="flex justify-between">
                      <span>Wed</span>
                      <Progress value={75} className="w-20" />
                    </div>
                    <div className="flex justify-between">
                      <span>Thu</span>
                      <Progress value={90} className="w-20" />
                    </div>
                    <div className="flex justify-between">
                      <span>Fri</span>
                      <Progress value={85} className="w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Tracking</CardTitle>
                <CardDescription>Monitor your daily intake and nutrition goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1,847</div>
                    <div className="text-sm text-muted-foreground">Calories Consumed</div>
                    <Progress value={75} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">125g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                    <Progress value={80} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">45g</div>
                    <div className="text-sm text-muted-foreground">Fiber</div>
                    <Progress value={90} className="mt-2" />
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Apple className="h-4 w-4 mr-2" />
                  Log Meal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mental" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mental Wellness</CardTitle>
                <CardDescription>Track your mood, stress, and mindfulness practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Today's Mood</h4>
                    <div className="flex justify-between text-2xl">
                      <span>😊</span>
                      <span>😐</span>
                      <span>😔</span>
                      <span className="bg-blue-100 rounded-full px-2">😄</span>
                      <span>😴</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Stress Level</h4>
                    <Progress value={30} className="mt-2" />
                    <p className="text-sm text-muted-foreground mt-1">Low stress - Great job!</p>
                  </div>
                </div>
                <Button className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Start Meditation (10 min)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Goals</CardTitle>
                <CardDescription>Set and track your wellness objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Walk 10,000 steps daily</h4>
                      <p className="text-sm text-muted-foreground">5 days streak</p>
                    </div>
                    <Progress value={85} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Drink 8 glasses of water</h4>
                      <p className="text-sm text-muted-foreground">3 days streak</p>
                    </div>
                    <Progress value={75} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Sleep 8 hours nightly</h4>
                      <p className="text-sm text-muted-foreground">2 days streak</p>
                    </div>
                    <Progress value={94} className="w-20" />
                  </div>
                </div>
                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Health;
