
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Bell, 
  Globe,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Camera,
  Edit,
  Save,
  X
} from "lucide-react";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [bio, setBio] = useState("AI enthusiast and productivity geek. Love exploring new technologies and optimizing workflows.");
  const [location, setLocation] = useState("San Francisco, CA");
  const [occupation, setOccupation] = useState("Product Manager");

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Profile</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-1">
                <CardHeader className="text-center">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="text-xl">JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>{occupation}</CardDescription>
                  <div className="flex justify-center space-x-2 mt-2">
                    <Badge variant="secondary">Pro User</Badge>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined March 2024</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">{bio}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Profile Form */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    Update your personal details and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Occupation</label>
                      <Input
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Website</label>
                      <Input
                        placeholder="https://yourwebsite.com"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Theme</label>
                    <select className="w-full p-2 border rounded">
                      <option>System Default</option>
                      <option>Light Mode</option>
                      <option>Dark Mode</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <select className="w-full p-2 border rounded">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Zone</label>
                    <select className="w-full p-2 border rounded">
                      <option>Pacific Time (PT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Central Time (CT)</option>
                      <option>Eastern Time (ET)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Format</label>
                    <select className="w-full p-2 border rounded">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant Settings</CardTitle>
                  <CardDescription>Configure your AI assistant behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assistant Voice</label>
                    <select className="w-full p-2 border rounded">
                      <option>Celeste (Default)</option>
                      <option>Sarah</option>
                      <option>Alex</option>
                      <option>Morgan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Response Style</label>
                    <select className="w-full p-2 border rounded">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Concise</option>
                      <option>Detailed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Wake Word</label>
                    <select className="w-full p-2 border rounded">
                      <option>Hey Cecilia</option>
                      <option>Cecilia</option>
                      <option>Assistant</option>
                      <option>Computer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Proactive suggestions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Context awareness</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Learning mode</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                  <CardDescription>Your accomplishments and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">🏆</div>
                      <div className="text-sm font-medium">Early Adopter</div>
                      <div className="text-xs text-muted-foreground">First 1000 users</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">🔥</div>
                      <div className="text-sm font-medium">7-Day Streak</div>
                      <div className="text-xs text-muted-foreground">Daily usage</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">💬</div>
                      <div className="text-sm font-medium">Chatty</div>
                      <div className="text-xs text-muted-foreground">1000+ messages</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">📚</div>
                      <div className="text-sm font-medium">Learner</div>
                      <div className="text-xs text-muted-foreground">10 courses completed</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm font-medium">Goal Setter</div>
                      <div className="text-xs text-muted-foreground">5 goals achieved</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg opacity-50">
                      <div className="text-2xl mb-2">🌟</div>
                      <div className="text-sm font-medium">Power User</div>
                      <div className="text-xs text-muted-foreground">Locked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Stats</CardTitle>
                  <CardDescription>Your usage and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasks Completed</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Interactions</span>
                    <span className="font-semibold">1,423</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Learning Hours</span>
                    <span className="font-semibold">47h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Health Goals Met</span>
                    <span className="font-semibold">23/30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Smart Home Actions</span>
                    <span className="font-semibold">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Social Events</span>
                    <span className="font-semibold">8</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Completed TypeScript course</div>
                      <div className="text-sm text-muted-foreground">Learning • 2 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Reached daily step goal</div>
                      <div className="text-sm text-muted-foreground">Health • 4 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Scheduled team meeting</div>
                      <div className="text-sm text-muted-foreground">Tasks • 6 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Automated morning routine</div>
                      <div className="text-sm text-muted-foreground">Smart Home • Yesterday</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Sent quarterly report</div>
                      <div className="text-sm text-muted-foreground">Messages • Yesterday</div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Full Activity History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
