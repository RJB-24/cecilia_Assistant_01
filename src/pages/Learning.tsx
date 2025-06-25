
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Clock, 
  Award,
  TrendingUp,
  Play,
  CheckCircle,
  Star
} from "lucide-react";

const Learning: React.FC = () => {
  const [currentStreak] = useState(7);
  const [completedCourses] = useState(12);
  const [totalHours] = useState(47);

  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Learning & Development</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning & Development</h1>
          <p className="text-muted-foreground">
            Expand your skills and knowledge with personalized learning paths
          </p>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Award className="h-4 w-4 mr-2 text-yellow-500" />
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak} days</div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep it up! 🔥
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                Courses Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                Learning Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                Skill Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Advanced</div>
              <Progress value={78} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                78% to Expert
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Currently Learning</CardTitle>
                  <CardDescription>Your active courses and progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Advanced React Patterns</h4>
                        <p className="text-sm text-muted-foreground">by Tech Academy</p>
                      </div>
                      <Badge>In Progress</Badge>
                    </div>
                    <Progress value={65} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Module 7 of 12</span>
                      <span>65% complete</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Machine Learning Fundamentals</h4>
                        <p className="text-sm text-muted-foreground">by AI Institute</p>
                      </div>
                      <Badge>In Progress</Badge>
                    </div>
                    <Progress value={25} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Module 3 of 10</span>
                      <span>25% complete</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">UX Design Principles</h4>
                        <p className="text-sm text-muted-foreground">by Design School</p>
                      </div>
                      <Badge variant="secondary">Paused</Badge>
                    </div>
                    <Progress value={80} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Module 4 of 5</span>
                      <span>80% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recently Completed</CardTitle>
                  <CardDescription>Courses you've finished recently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">TypeScript Mastery</div>
                        <div className="text-sm text-muted-foreground">Completed 2 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Project Management Basics</div>
                        <div className="text-sm text-muted-foreground">Completed 1 week ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Digital Marketing 101</div>
                        <div className="text-sm text-muted-foreground">Completed 2 weeks ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.7</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View All Completed Courses
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended for You</CardTitle>
                  <CardDescription>Based on your learning history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Advanced Node.js</h4>
                    <p className="text-sm text-muted-foreground">8 hours • Intermediate</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.9</span>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">System Design Interview</h4>
                    <p className="text-sm text-muted-foreground">12 hours • Advanced</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.8</span>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Docker & Kubernetes</h4>
                    <p className="text-sm text-muted-foreground">15 hours • Intermediate</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.7</span>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Now</CardTitle>
                  <CardDescription>Popular courses this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">AI Prompt Engineering</h4>
                    <p className="text-sm text-muted-foreground">6 hours • Beginner</p>
                    <Badge variant="secondary" className="text-xs mt-1">🔥 Hot</Badge>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.9</span>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Web3 Development</h4>
                    <p className="text-sm text-muted-foreground">20 hours • Advanced</p>
                    <Badge variant="secondary" className="text-xs mt-1">🚀 New</Badge>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.6</span>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Data Visualization</h4>
                    <p className="text-sm text-muted-foreground">10 hours • Intermediate</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.8</span>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Paths</CardTitle>
                  <CardDescription>Structured skill development</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Full Stack Developer</h4>
                    <p className="text-sm text-muted-foreground">12 courses • 80 hours</p>
                    <Progress value={40} className="mt-2 mb-2" />
                    <p className="text-xs text-muted-foreground">5 of 12 courses completed</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Data Scientist</h4>
                    <p className="text-sm text-muted-foreground">15 courses • 120 hours</p>
                    <Progress value={15} className="mt-2 mb-2" />
                    <p className="text-xs text-muted-foreground">2 of 15 courses completed</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Product Manager</h4>
                    <p className="text-sm text-muted-foreground">8 courses • 50 hours</p>
                    <Progress value={0} className="mt-2 mb-2" />
                    <p className="text-xs text-muted-foreground">Not started</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>Set and track your educational objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Complete React Advanced Course</h4>
                        <p className="text-sm text-muted-foreground">Target: End of March</p>
                      </div>
                      <Badge>On Track</Badge>
                    </div>
                    <Progress value={65} className="mb-2" />
                    <p className="text-sm text-muted-foreground">7 of 12 modules completed</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Study 30 minutes daily</h4>
                        <p className="text-sm text-muted-foreground">Current streak: 7 days</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <Progress value={87} className="mb-2" />
                    <p className="text-sm text-muted-foreground">26 of 30 days this month</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Earn 3 Certificates</h4>
                        <p className="text-sm text-muted-foreground">Target: End of Q2</p>
                      </div>
                      <Badge variant="secondary">Behind</Badge>
                    </div>
                    <Progress value={33} className="mb-2" />
                    <p className="text-sm text-muted-foreground">1 of 3 certificates earned</p>
                  </div>
                </div>
                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest learning milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="font-semibold">7-Day Streak</div>
                      <div className="text-sm text-muted-foreground">Learned every day this week</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <GraduationCap className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-semibold">Course Completed</div>
                      <div className="text-sm text-muted-foreground">TypeScript Mastery</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Star className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="font-semibold">Skill Level Up</div>
                      <div className="text-sm text-muted-foreground">Advanced to Intermediate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges & Certificates</CardTitle>
                  <CardDescription>Your earned credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-xs font-medium">React Expert</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-xs font-medium">JS Master</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-xs font-medium">Quick Learner</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-xs font-medium">Goal Setter</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-xs font-medium">Time Master</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg opacity-50">
                      <div className="h-8 w-8 border-2 border-dashed rounded mx-auto mb-2"></div>
                      <div className="text-xs">Locked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Learning;
