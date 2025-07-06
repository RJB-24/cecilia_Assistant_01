
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Home, Settings, Map, Calendar, Mail, FileText, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIEnergyOrb from './AIEnergyOrb';
import { voiceService } from '@/services/voice/voiceService';
import { assistantFeaturesService } from '@/services/assistantFeaturesService';
import { toast } from 'sonner';

const JarvisInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial greeting
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    
    setResponseText(`${greeting}. I'm CECILIA, your advanced AI companion. How may I assist you today?`);
  }, []);

  const handleVoiceToggle = async () => {
    if (isListening) {
      try {
        setIsListening(false);
        setIsProcessing(true);
        setResponseText('Processing your request...');
        
        const transcript = await voiceService.stop();
        if (transcript && transcript.trim()) {
          setIsSpeaking(true);
          const response = await assistantFeaturesService.processAdvancedCommand(transcript);
          const responseMessage = response.message || 'Task completed successfully.';
          
          setResponseText(responseMessage);
          await voiceService.speakText(responseMessage);
          setIsSpeaking(false);
        } else {
          setResponseText('I didn\'t catch that. Please try again.');
        }
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing voice command:', error);
        setIsListening(false);
        setIsSpeaking(false);
        setIsProcessing(false);
        setResponseText('Sorry, there was an error. Please try again.');
        toast.error('Error processing voice command');
      }
    } else {
      try {
        await voiceService.start();
        setIsListening(true);
        setResponseText('I\'m listening... Speak your command now.');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const quickActions = [
    { icon: Home, label: 'Dashboard', link: '/', color: 'bg-blue-500' },
    { icon: Map, label: 'Map View', link: '/map', color: 'bg-green-500' },
    { icon: Calendar, label: 'Schedule', link: '/tasks', color: 'bg-purple-500' },
    { icon: Mail, label: 'Messages', link: '/messages', color: 'bg-orange-500' },
    { icon: FileText, label: 'Notes', link: '/notes', color: 'bg-yellow-500' },
    { icon: Settings, label: 'Settings', link: '/settings', color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold tracking-wider text-cyan-300 drop-shadow-lg">
              CECILIA AI
            </h1>
            <p className="text-cyan-100 text-sm mt-1">
              {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isListening ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 
              isSpeaking ? 'bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50' : 
              isProcessing ? 'bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50' :
              'bg-cyan-400 shadow-lg shadow-cyan-400/50'
            }`} />
            <span className="text-white/80 text-sm font-medium">
              {isListening ? 'Listening...' : 
               isSpeaking ? 'Speaking...' : 
               isProcessing ? 'Processing...' :
               'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Central AI Orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96">
          <AIEnergyOrb 
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Bottom Interface */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex flex-col items-center space-y-6">
          {/* Response Display */}
          <Card className="bg-black/40 backdrop-blur-lg border border-cyan-400/30 max-w-4xl shadow-2xl shadow-cyan-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center min-h-[4rem]">
                <p className="text-white text-center text-lg leading-relaxed">
                  {responseText || "Hello! I'm ready to assist you with anything you need..."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Voice Control */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleVoiceToggle}
              size="lg"
              className={`w-20 h-20 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse shadow-red-500/50' 
                  : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-cyan-500/50'
              }`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </Button>

            <p className="text-white/80 text-sm font-medium text-center">
              {isListening ? 'Click to stop listening' : 'Click to activate voice command'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${action.color} hover:opacity-80 text-white transition-all duration-200 hover:scale-105`}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisInterface;
