
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  Trash2,
  UserX,
  RefreshCw
} from "lucide-react";

const Privacy: React.FC = () => {
  const [dataSharing, setDataSharing] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [voiceRecording, setVoiceRecording] = useState(true);

  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Privacy & Security</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy & Security</h1>
          <p className="text-muted-foreground">
            Control your data, privacy settings, and security preferences
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Security Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <Progress value={98} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Excellent security
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Lock className="h-4 w-4 mr-2 text-blue-500" />
                Encrypted Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground mt-1">
                All data encrypted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2 text-purple-500" />
                Data Shared
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Third-party services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Security issues
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="privacy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Collection</CardTitle>
                  <CardDescription>Control what data is collected and how it's used</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Usage Analytics</div>
                      <div className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</div>
                    </div>
                    <Switch checked={analytics} onCheckedChange={setAnalytics} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Location Tracking</div>
                      <div className="text-sm text-muted-foreground">Enable location-based features and suggestions</div>
                    </div>
                    <Switch checked={locationTracking} onCheckedChange={setLocationTracking} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Voice Recording</div>
                      <div className="text-sm text-muted-foreground">Process voice commands for AI assistant</div>
                    </div>
                    <Switch checked={voiceRecording} onCheckedChange={setVoiceRecording} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Personalization</div>
                      <div className="text-sm text-muted-foreground">Use data to personalize your experience</div>
                    </div>
                    <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                  <CardDescription>Manage how and when we contact you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Product Updates</div>
                      <div className="text-sm text-muted-foreground">News about new features and improvements</div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Security Alerts</div>
                      <div className="text-sm text-muted-foreground">Important security notifications</div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Marketing Emails</div>
                      <div className="text-sm text-muted-foreground">Promotional content and tips</div>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Text message alerts for important events</div>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Protect your account with strong security measures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">SMS-based verification enabled</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Strong Password</div>
                        <div className="text-sm text-muted-foreground">Last updated 2 weeks ago</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-medium">Recovery Email</div>
                        <div className="text-sm text-muted-foreground">Backup email not verified</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">API Keys</div>
                        <div className="text-sm text-muted-foreground">3 active keys</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Activity</CardTitle>
                  <CardDescription>Recent login attempts and active sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-muted-foreground">Chrome on MacOS</div>
                        <div className="text-xs text-muted-foreground">San Francisco, CA • Now</div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Mobile App</div>
                        <div className="text-sm text-muted-foreground">iPhone 14 Pro</div>
                        <div className="text-xs text-muted-foreground">San Francisco, CA • 2 hours ago</div>
                      </div>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Failed Login</div>
                        <div className="text-sm text-muted-foreground">Unknown device</div>
                        <div className="text-xs text-muted-foreground">New York, NY • 3 days ago</div>
                      </div>
                      <Badge variant="destructive">Blocked</Badge>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Export & Backup</CardTitle>
                  <CardDescription>Download or backup your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Complete Data Export</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Download all your data including messages, settings, and activity history
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Request Data Export
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Selective Export</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Choose specific data categories to export
                    </div>
                    <div className="space-y-2 mb-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Messages & Conversations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Settings & Preferences</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Activity Logs</span>
                      </label>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Deletion</CardTitle>
                  <CardDescription>Manage or delete your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="font-medium mb-2 text-orange-800">Clear Activity Data</div>
                    <div className="text-sm text-orange-700 mb-3">
                      Delete your activity history while keeping account settings
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Activity
                    </Button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="font-medium mb-2 text-red-800">Delete Account</div>
                    <div className="text-sm text-red-700 mb-3">
                      Permanently delete your account and all associated data
                    </div>
                    <Button variant="destructive" className="w-full" size="sm">
                      <UserX className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Data Retention</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Control how long your data is stored
                    </div>
                    <select className="w-full p-2 border rounded">
                      <option>Keep data indefinitely</option>
                      <option>Delete after 1 year</option>
                      <option>Delete after 6 months</option>
                      <option>Delete after 3 months</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Permissions</CardTitle>
                  <CardDescription>Control what features can access your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Camera Access</div>
                      <div className="text-sm text-muted-foreground">For video calls and document scanning</div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Microphone Access</div>
                      <div className="text-sm text-muted-foreground">For voice commands and calls</div>
                    </div>
                    <Switch checked={voiceRecording} onCheckedChange={setVoiceRecording} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Location Access</div>
                      <div className="text-sm text-muted-foreground">For location-based features</div>
                    </div>
                    <Switch checked={locationTracking} onCheckedChange={setLocationTracking} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Notification Access</div>
                      <div className="text-sm text-muted-foreground">To show system notifications</div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">File System Access</div>
                      <div className="text-sm text-muted-foreground">To save and access your files</div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Third-Party Integrations</CardTitle>
                  <CardDescription>Apps and services connected to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Google Calendar</div>
                      <div className="text-sm text-muted-foreground">Calendar sync and event management</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Connected</Badge>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Spotify</div>
                      <div className="text-sm text-muted-foreground">Music recommendations and playback</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Connected</Badge>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Slack</div>
                      <div className="text-sm text-muted-foreground">Team communication integration</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Connected</Badge>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg opacity-50">
                    <div>
                      <div className="font-medium">GitHub</div>
                      <div className="text-sm text-muted-foreground">Code repository access</div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>

                  <Button className="w-full" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Connections
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Privacy;
