
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyConfig {
  key: string;
  name: string;
  description: string;
  required: boolean;
  testEndpoint?: string;
  documentation: string;
  status?: 'valid' | 'invalid' | 'untested';
}

const API_CONFIGS: Record<string, ApiKeyConfig> = {
  VITE_GROQ_API_KEY: {
    key: 'VITE_GROQ_API_KEY',
    name: 'Groq API',
    description: 'Essential for AI assistant functionality, voice synthesis, and natural language processing',
    required: true,
    documentation: 'https://console.groq.com',
  },
  VITE_WEATHER_API_KEY: {
    key: 'VITE_WEATHER_API_KEY',
    name: 'OpenWeatherMap',
    description: 'Real-time weather data and forecasts',
    required: false,
    documentation: 'https://openweathermap.org/api',
  },
  VITE_NEWS_API_KEY: {
    key: 'VITE_NEWS_API_KEY',
    name: 'NewsAPI',
    description: 'Latest news headlines and articles',
    required: false,
    documentation: 'https://newsapi.org',
  },
  VITE_GOOGLE_API_KEY: {
    key: 'VITE_GOOGLE_API_KEY',
    name: 'Google APIs',
    description: 'Calendar, Gmail, and Drive integration',
    required: false,
    documentation: 'https://console.developers.google.com',
  },
  VITE_SCREENPIPE_API_KEY: {
    key: 'VITE_SCREENPIPE_API_KEY',
    name: 'Screenpipe',
    description: 'Desktop automation and screen analysis',
    required: false,
    documentation: 'https://screenpipe.ai',
  },
};

const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load API keys from localStorage
    const storedKeys: Record<string, string> = {};
    Object.keys(API_CONFIGS).forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        storedKeys[key] = value;
      }
    });
    setApiKeys(storedKeys);
  }, []);

  const handleKeyChange = (key: string, value: string) => {
    const newKeys = { ...apiKeys, [key]: value };
    setApiKeys(newKeys);
    
    if (value.trim()) {
      localStorage.setItem(key, value.trim());
    } else {
      localStorage.removeItem(key);
    }
  };

  const toggleVisibility = (key: string) => {
    setVisibleKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const testApiKey = async (key: string) => {
    const value = apiKeys[key];
    if (!value) {
      toast.error('Please enter an API key first');
      return;
    }

    setTestingKeys(prev => ({ ...prev, [key]: true }));

    try {
      let isValid = false;

      switch (key) {
        case 'VITE_GROQ_API_KEY':
          const groqResponse = await fetch('https://api.groq.com/openai/v1/models', {
            headers: { 'Authorization': `Bearer ${value}` }
          });
          isValid = groqResponse.ok;
          break;

        case 'VITE_WEATHER_API_KEY':
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${value}`
          );
          isValid = weatherResponse.ok;
          break;

        case 'VITE_NEWS_API_KEY':
          const newsResponse = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${value}`
          );
          isValid = newsResponse.ok;
          break;

        default:
          toast.info('API key saved (testing not available for this service)');
          return;
      }

      if (isValid) {
        toast.success(`${API_CONFIGS[key].name} API key is valid!`);
      } else {
        toast.error(`${API_CONFIGS[key].name} API key is invalid`);
      }
    } catch (error) {
      toast.error(`Error testing ${API_CONFIGS[key].name} API key`);
    } finally {
      setTestingKeys(prev => ({ ...prev, [key]: false }));
    }
  };

  const getKeyStatus = (key: string): 'valid' | 'invalid' | 'untested' => {
    return apiKeys[key] ? 'untested' : 'invalid';
  };

  const renderApiKeyInput = (config: ApiKeyConfig) => {
    const { key, name, description, required, documentation } = config;
    const value = apiKeys[key] || '';
    const isVisible = visibleKeys[key];
    const isTesting = testingKeys[key];
    const status = getKeyStatus(key);

    return (
      <Card key={key} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{name}</CardTitle>
              {required && <Badge variant="destructive">Required</Badge>}
              {status === 'valid' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {status === 'invalid' && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(documentation, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Get Key
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor={key} className="sr-only">{name} API Key</Label>
                <Input
                  id={key}
                  type={isVisible ? 'text' : 'password'}
                  placeholder={`Enter your ${name} API key`}
                  value={value}
                  onChange={(e) => handleKeyChange(key, e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toggleVisibility(key)}
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {['VITE_GROQ_API_KEY', 'VITE_WEATHER_API_KEY', 'VITE_NEWS_API_KEY'].includes(key) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => testApiKey(key)}
                  disabled={!value || isTesting}
                >
                  {isTesting ? 'Testing...' : 'Test'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const requiredKeys = Object.values(API_CONFIGS).filter(config => config.required);
  const optionalKeys = Object.values(API_CONFIGS).filter(config => !config.required);
  const configuredCount = Object.keys(apiKeys).filter(key => apiKeys[key]).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">API Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Configure your API keys to unlock all GroqFlow features
        </p>
        <div className="mt-4">
          <Badge variant={configuredCount >= 1 ? 'default' : 'destructive'}>
            {configuredCount} of {Object.keys(API_CONFIGS).length} APIs configured
          </Badge>
        </div>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          Your API keys are stored locally in your browser for security. 
          For production use, consider using Supabase for secure key management.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="required" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="required">Required APIs</TabsTrigger>
          <TabsTrigger value="optional">Optional APIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="required" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            These APIs are essential for core functionality:
          </div>
          {requiredKeys.map(renderApiKeyInput)}
        </TabsContent>
        
        <TabsContent value="optional" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            These APIs enhance the assistant with additional features:
          </div>
          {optionalKeys.map(renderApiKeyInput)}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Start with Groq API (Required)</h4>
            <p className="text-sm text-muted-foreground">
              Visit console.groq.com, sign up, and create an API key. This enables AI functionality.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Add Weather & News (Recommended)</h4>
            <p className="text-sm text-muted-foreground">
              Get free API keys from OpenWeatherMap and NewsAPI for real-time data.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. Test Your Keys</h4>
            <p className="text-sm text-muted-foreground">
              Use the "Test" button to verify your API keys are working correctly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;
