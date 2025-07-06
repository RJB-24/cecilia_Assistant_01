
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Mic, Brain, Zap, Shield, Globe, Cpu } from 'lucide-react';

interface AssistantWelcomePanelProps {
  onClose: () => void;
  isInitialized: boolean;
}

const AssistantWelcomePanel: React.FC<AssistantWelcomePanelProps> = ({ 
  onClose, 
  isInitialized 
}) => {
  const features = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Advanced AI Models",
      description: "Powered by Groq's Llama 3.3 70B and Meta's latest language models"
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice-First Interface",
      description: "Natural speech recognition with multilingual support (English & Hindi)"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast Processing",
      description: "Ultra-low latency responses with Groq's inference technology"
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Agent Mode",
      description: "Web search, code execution, and real-time data analysis"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Cross-Platform Automation",
      description: "Control applications, manage workflows, and automate tasks"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy Focused",
      description: "Local processing with secure API connections"
    }
  ];

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
      <Card className="bg-black/80 backdrop-blur-lg border-cyan-500/30 text-white p-6 max-w-4xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">
              Welcome to CECILIA AI
            </h2>
            <p className="text-gray-300 text-sm">
              Your Advanced AI Assistant powered by Meta Llama & Groq Technology
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="text-cyan-400 mt-1">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              Status: <span className={`font-semibold ${isInitialized ? 'text-green-400' : 'text-yellow-400'}`}>
                {isInitialized ? 'Ready' : 'Initializing...'}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              Click the microphone button or say "Hey CECILIA" to begin
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>• Voice Commands</span>
            <span>• Task Automation</span>
            <span>• Real-time Analysis</span>
            <span>• Cross-app Control</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssistantWelcomePanel;
