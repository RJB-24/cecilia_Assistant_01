
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import CommandProcessor from "../command/CommandProcessor";

const CommandInput = () => {
  return (
    <Card className="jarvis-hologram">
      <CardHeader>
        <CardTitle className="text-xl font-bold jarvis-glow-text">Command Center</CardTitle>
        <CardDescription className="text-jarvis-secondary">
          Interact with Cecilia using voice or text commands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CommandProcessor />
      </CardContent>
    </Card>
  );
};

export default CommandInput;
