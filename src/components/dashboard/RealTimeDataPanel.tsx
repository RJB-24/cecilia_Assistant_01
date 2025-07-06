
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Clock, 
  Newspaper, 
  CloudSun, 
  Calendar, 
  Mail, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { realtimeDataService, NewsItem, WeatherData, CalendarEvent, EmailSummary, StockData } from "@/services/realtimeDataService";

const RealTimeDataPanel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [emailSummary, setEmailSummary] = useState<EmailSummary | null>(null);
  const [stockPrices, setStockPrices] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [configStatus, setConfigStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAllData();
    setConfigStatus(realtimeDataService.getConfigurationStatus());
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [newsData, weatherData, eventsData, emailData, stockData] = await Promise.all([
        realtimeDataService.getLatestNews('technology', 3),
        realtimeDataService.getCurrentWeather(),
        realtimeDataService.getUpcomingEvents(),
        realtimeDataService.getEmailSummary(),
        realtimeDataService.getStockPrices(['AAPL', 'GOOGL', 'MSFT'])
      ]);

      setNews(newsData);
      setWeather(weatherData);
      setEvents(eventsData);
      setEmailSummary(emailData);
      setStockPrices(stockData);
      setLastUpdate(new Date());
    } catch (error) {
      toast.error('Failed to update real-time data');
      console.error('Error loading real-time data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.info('Refreshing data...');
    loadAllData();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isConfigured = realtimeDataService.isFullyConfigured();

  return (
    <div className="space-y-4">
      <Card className="jarvis-hologram">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold jarvis-glow-text">
              Real-Time Intelligence
            </CardTitle>
            <div className="flex items-center space-x-2">
              {!isConfigured && (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <div className="flex items-center text-xs text-jarvis-secondary">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfigured && (
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-yellow-400">API Configuration Required</p>
                  <p className="text-yellow-300 mt-1">
                    Add API keys to .env for live data: News API, Weather API, Google APIs
                  </p>
                  <div className="flex space-x-2 mt-2">
                    {Object.entries(configStatus).map(([service, configured]) => (
                      <Badge
                        key={service}
                        variant={configured ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {configured ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weather */}
          {weather && (
            <div className="bg-jarvis-dark/40 rounded-lg p-3 border border-jarvis-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CloudSun className="h-4 w-4 text-jarvis-blue" />
                  <span className="text-sm font-medium">{weather.location}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{weather.temperature}°C</div>
                  <div className="text-xs text-jarvis-secondary">{weather.condition}</div>
                </div>
              </div>
            </div>
          )}

          {/* News */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4 text-jarvis-blue" />
              <span className="text-sm font-medium">Latest News</span>
            </div>
            {news.slice(0, 2).map((item, index) => (
              <div key={index} className="bg-jarvis-dark/40 rounded-lg p-3 border border-jarvis-border/30">
                <h4 className="text-xs font-medium mb-1 line-clamp-2">{item.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-jarvis-secondary">{item.source}</span>
                  <span className="text-xs text-jarvis-secondary">
                    {formatTime(item.publishedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Events */}
          {events.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-jarvis-blue" />
                <span className="text-sm font-medium">Upcoming</span>
              </div>
              {events.slice(0, 2).map((event) => (
                <div key={event.id} className="bg-jarvis-dark/40 rounded-lg p-3 border border-jarvis-border/30">
                  <h4 className="text-xs font-medium mb-1">{event.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-jarvis-secondary">
                      {event.time}
                    </span>
                    {event.location && (
                      <span className="text-xs text-jarvis-secondary">{event.location}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Email Summary */}
          {emailSummary && emailSummary.unreadCount > 0 && (
            <div className="bg-jarvis-dark/40 rounded-lg p-3 border border-jarvis-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-jarvis-blue" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {emailSummary.unreadCount} unread
                </Badge>
              </div>
            </div>
          )}

          {/* Stock Prices */}
          {stockPrices.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-jarvis-blue" />
                <span className="text-sm font-medium">Markets</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {stockPrices.map((stock) => (
                  <div key={stock.symbol} className="bg-jarvis-dark/40 rounded-lg p-2 border border-jarvis-border/30 text-center">
                    <div className="text-xs font-medium">{stock.symbol}</div>
                    <div className="text-xs text-jarvis-secondary">${stock.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDataPanel;
