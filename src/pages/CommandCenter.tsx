
import React from "react";
import { Helmet } from "react-helmet-async";
import SmartCommandProcessor from "@/components/command/SmartCommandProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommandCenter: React.FC = () => {
  return (
    <div className="container py-6">
      <Helmet>
        <title>GroqFlow - Command Center</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">
            Issue voice or text commands to your AI assistant
          </p>
        </div>

        <SmartCommandProcessor />

        <Card>
          <CardHeader>
            <CardTitle>Voice Command Examples</CardTitle>
            <CardDescription>Try these commands with Cecilia</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• "Open YouTube and search for productivity tips"</li>
              <li>• "Schedule a meeting with the design team for tomorrow at 2pm"</li>
              <li>• "Take notes for my product strategy meeting"</li>
              <li>• "Send an email to the team about the project status"</li>
              <li>• "Search for the latest news on AI assistants"</li>
              <li>• "Analyze this screenshot and tell me what you see"</li>
              <li>• "What's the weather like in New York today?"</li>
              <li>• "Calculate the ROI for a $10,000 investment with 8% annual return over 5 years"</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommandCenter;
