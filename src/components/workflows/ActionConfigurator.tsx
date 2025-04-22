
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ActionConfigurator = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Action Configuration</CardTitle>
        <CardDescription>
          Configure selected node parameters and connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email (Outlook/Gmail)</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="data">Data Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="action">Action Type</Label>
          <Select disabled>
            <SelectTrigger id="action">
              <SelectValue placeholder="First select a platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="send">Send/Post</SelectItem>
              <SelectItem value="analyze">Analyze</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retry">Retry Settings</Label>
          <Select>
            <SelectTrigger id="retry">
              <SelectValue placeholder="Select retry policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No retries</SelectItem>
              <SelectItem value="3x">Retry 3 times</SelectItem>
              <SelectItem value="5x">Retry 5 times</SelectItem>
              <SelectItem value="custom">Custom policy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full mt-4">
          Apply Configuration
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionConfigurator;
