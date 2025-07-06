
import React from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  title = "CECILIA AI", 
  message = "Advanced AI Assistant Ready" 
}) => {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="text-white text-center p-8">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center justify-center animate-pulse">
          <Bot className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-300 mb-6">{message}</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-400/30 rounded-lg">
            <p className="text-red-300 text-sm">Error: {error.message}</p>
          </div>
        )}
        
        {resetError && (
          <Button 
            onClick={resetError}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
