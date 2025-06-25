
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Camera,
  Tv,
  Music,
  Zap,
  Settings,
  Plus
} from "lucide-react";

const SmartHome: React.FC = () => {
  const [livingRoomLights, setLivingRoomLights] = useState(true);
  const [temperature, setTemperature] = useState([22]);
  const [securitySystem, setSecuritySystem] = useState(false);

  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Smart Home</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Smart Home</h1>
          <p className="text-muted-foreground">
            Control and automate your connected devices
          </p>
        </div>

        {/* Quick Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Living Room</span>
                </div>
                <Switch 
                  checked={livingRoomLights} 
                  onCheckedChange={setLivingRoomLights}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Temperature</span>
                </div>
                <span className="font-bold">{temperature[0]}°C</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Security</span>
                </div>
                <Switch 
                  checked={securitySystem} 
                  onCheckedChange={setSecuritySystem}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Energy</span>
                </div>
                <span className="font-bold text-green-600">2.4kW</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rooms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Living Room
                  </CardTitle>
                  <CardDescription>3 devices connected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Lights</span>
                    <Switch checked={livingRoomLights} onCheckedChange={setLivingRoomLights} />
                  </div>
                  <div className="space-y-2">
                    <span>Brightness</span>
                    <Slider defaultValue={[75]} max={100} step={1} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TV</span>
                    <Switch defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Thermometer className="h-5 w-5 mr-2" />
                    Kitchen
                  </CardTitle>
                  <CardDescription>2 devices connected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Lights</span>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Smart Oven</span>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="space-y-2">
                    <span>Temperature: 20°C</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Bedroom
                  </CardTitle>
                  <CardDescription>4 devices connected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Lights</span>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AC</span>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="space-y-2">
                    <span>Temperature</span>
                    <Slider value={temperature} onValueChange={setTemperature} max={30} min={16} step={1} />
                    <div className="text-center text-sm text-muted-foreground">{temperature[0]}°C</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>Manage all your smart devices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Smart Bulbs (6)</div>
                        <div className="text-sm text-muted-foreground">Living Room, Kitchen, Bedroom</div>
                      </div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Thermostat</div>
                        <div className="text-sm text-muted-foreground">Main HVAC System</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">22°C</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Camera className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Security Cameras (3)</div>
                        <div className="text-sm text-muted-foreground">Front Door, Backyard, Garage</div>
                      </div>
                    </div>
                    <Switch checked={securitySystem} onCheckedChange={setSecuritySystem} />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Music className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="font-medium">Smart Speakers (2)</div>
                        <div className="text-sm text-muted-foreground">Living Room, Kitchen</div>
                      </div>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Status</CardTitle>
                  <CardDescription>Monitor device health and connectivity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">15</div>
                    <div className="text-sm text-muted-foreground">Devices Online</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-semibold">98%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">2.4s</div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Device
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Smart Automations</CardTitle>
                <CardDescription>Create routines and automated behaviors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">Good Morning Routine</h4>
                        <p className="text-sm text-muted-foreground">Triggers at 7:00 AM on weekdays</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          • Turn on bedroom lights (50%)
                          • Set thermostat to 22°C
                          • Start coffee maker
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">Away Mode</h4>
                        <p className="text-sm text-muted-foreground">Activates when everyone leaves</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          • Turn off all lights
                          • Lower thermostat to 18°C
                          • Activate security system
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">Movie Time</h4>
                        <p className="text-sm text-muted-foreground">Manual activation</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          • Dim living room lights to 20%
                          • Turn on TV and sound system
                          • Close smart blinds
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Automation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Usage Today</CardTitle>
                  <CardDescription>Real-time energy consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600">24.7 kWh</div>
                    <div className="text-sm text-muted-foreground">12% less than yesterday</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>HVAC System</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lighting</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electronics</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other</span>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>Smart optimization results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$47</div>
                    <div className="text-sm text-muted-foreground">Saved this month</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Smart Scheduling</span>
                      <span className="text-green-600">$23</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Away Mode</span>
                      <span className="text-green-600">$18</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>LED Optimization</span>
                      <span className="text-green-600">$6</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Optimize Settings
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

export default SmartHome;
