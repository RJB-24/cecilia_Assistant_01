
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Mail, 
  Send, 
  Search,
  Phone,
  Video,
  Plus,
  Archive,
  Trash2,
  Star,
  Paperclip
} from "lucide-react";

const Messages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Unified Messages</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Unified communication hub for all your conversations
          </p>
        </div>

        {/* Search and Quick Actions */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages, contacts, or conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">12 Unread</Badge>
                    <Badge variant="outline">3 Important</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    <div className="p-3 hover:bg-muted cursor-pointer border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold">Sarah Johnson</div>
                        <div className="text-xs text-muted-foreground">2m ago</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">Project update meeting tomorrow?</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Email</Badge>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </div>
                    </div>

                    <div className="p-3 hover:bg-muted cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold">Marketing Team</div>
                        <div className="text-xs text-muted-foreground">15m ago</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">Campaign results are looking great! 📈</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Slack</Badge>
                        <Badge variant="destructive" className="text-xs">2</Badge>
                      </div>
                    </div>

                    <div className="p-3 hover:bg-muted cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold">Mom</div>
                        <div className="text-xs text-muted-foreground">1h ago</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">Don't forget dinner on Sunday!</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">SMS</Badge>
                      </div>
                    </div>

                    <div className="p-3 hover:bg-muted cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold">LinkedIn</div>
                        <div className="text-xs text-muted-foreground">3h ago</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">You have 5 new connection requests</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Social</Badge>
                        <Badge variant="destructive" className="text-xs">5</Badge>
                      </div>
                    </div>

                    <div className="p-3 hover:bg-muted cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold">Alex Chen</div>
                        <div className="text-xs text-muted-foreground">5h ago</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">Thanks for the code review!</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Email</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversation View */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Sarah Johnson
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </CardTitle>
                      <CardDescription>sarah.johnson@company.com • Online</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-muted p-3 rounded-lg">
                        <div className="text-sm">Hey! Are we still on for the project meeting tomorrow at 2 PM?</div>
                        <div className="text-xs text-muted-foreground mt-1">10:30 AM</div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[70%] bg-primary text-primary-foreground p-3 rounded-lg">
                        <div className="text-sm">Yes, absolutely! I've prepared the presentation slides and will share them before the meeting.</div>
                        <div className="text-xs text-primary-foreground/70 mt-1">10:32 AM</div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-muted p-3 rounded-lg">
                        <div className="text-sm">Perfect! Should we invite the design team as well? Their input would be valuable.</div>
                        <div className="text-xs text-muted-foreground mt-1">10:35 AM</div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[70%] bg-primary text-primary-foreground p-3 rounded-lg">
                        <div className="text-sm">Great idea! I'll send them an invite. Also, I've attached the latest mockups for review.</div>
                        <div className="flex items-center gap-2 mt-2 p-2 bg-primary-foreground/10 rounded">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-xs">project-mockups-v2.pdf</span>
                        </div>
                        <div className="text-xs text-primary-foreground/70 mt-1">10:38 AM</div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-muted p-3 rounded-lg">
                        <div className="text-sm">Thanks! I'll review them tonight. Looking forward to tomorrow's discussion! 🚀</div>
                        <div className="text-xs text-muted-foreground mt-1">2m ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>Manage all your email accounts in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 border rounded-lg">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="font-semibold">Gmail</div>
                    <div className="text-sm text-muted-foreground">15 unread</div>
                    <Badge className="mt-2">Connected</Badge>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <div className="font-semibold">Outlook</div>
                    <div className="text-sm text-muted-foreground">3 unread</div>
                    <Badge className="mt-2">Connected</Badge>
                  </div>
                  <div className="text-center p-6 border rounded-lg opacity-50">
                    <Mail className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-semibold">Yahoo Mail</div>
                    <div className="text-sm text-muted-foreground">Add account</div>
                    <Button size="sm" className="mt-2">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SMS Messages</CardTitle>
                <CardDescription>Text message conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">Mom</div>
                      <div className="text-sm text-muted-foreground">Don't forget dinner on Sunday!</div>
                    </div>
                    <div className="text-xs text-muted-foreground">1h ago</div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">Bank Alert</div>
                      <div className="text-sm text-muted-foreground">Transaction of $50.00 at Coffee Shop</div>
                    </div>
                    <div className="text-xs text-muted-foreground">3h ago</div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">Delivery Update</div>
                      <div className="text-sm text-muted-foreground">Your package will arrive today between 2-4 PM</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Morning</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Messages</CardTitle>
                <CardDescription>Messages from social platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3">LinkedIn</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">5 Connection Requests</div>
                        <div className="text-sm text-muted-foreground">View pending requests</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">2 New Messages</div>
                        <div className="text-sm text-muted-foreground">From recruiters</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Twitter/X</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">15 Mentions</div>
                        <div className="text-sm text-muted-foreground">Your recent post is trending</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">3 Direct Messages</div>
                        <div className="text-sm text-muted-foreground">From followers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Communications</CardTitle>
                <CardDescription>Messages from work platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">Marketing Team - Slack</div>
                        <div className="text-sm text-muted-foreground">Campaign results are looking great! 📈</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">2</Badge>
                        <div className="text-xs text-muted-foreground">15m ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">Dev Team - Discord</div>
                        <div className="text-sm text-muted-foreground">New deployment is ready for testing</div>
                      </div>
                      <div className="text-xs text-muted-foreground">1h ago</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">Project Alpha - Teams</div>
                        <div className="text-sm text-muted-foreground">Meeting scheduled for tomorrow 2 PM</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2h ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Messages;
