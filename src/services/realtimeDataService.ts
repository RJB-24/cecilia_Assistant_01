
/**
 * Real-time data service for live information feeds
 */

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

export interface EmailSummary {
  unreadCount: number;
  important: Array<{
    subject: string;
    sender: string;
    timestamp: string;
  }>;
}

class RealtimeDataService {
  private newsApiKey: string | null = null;
  private weatherApiKey: string | null = null;
  private googleApiKey: string | null = null;
  
  constructor() {
    this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
    this.weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  }

  /**
   * Get latest news headlines
   */
  async getLatestNews(category: string = 'technology', limit: number = 5): Promise<NewsItem[]> {
    if (!this.newsApiKey) {
      console.warn('News API key not configured, returning mock data');
      return this.getMockNews();
    }

    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=${limit}&apiKey=${this.newsApiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  /**
   * Get current weather for location
   */
  async getCurrentWeather(location: string = 'London'): Promise<WeatherData> {
    if (!this.weatherApiKey) {
      console.warn('Weather API key not configured, returning mock data');
      return this.getMockWeather();
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.weatherApiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return this.getMockWeather();
    }
  }

  /**
   * Get upcoming calendar events
   */
  async getUpcomingEvents(limit: number = 5): Promise<CalendarEvent[]> {
    if (!this.googleApiKey) {
      console.warn('Google API key not configured, returning mock data');
      return this.getMockEvents();
    }

    try {
      // This would require OAuth flow in production
      // For now, return mock data with a note
      console.info('Calendar integration requires OAuth setup');
      return this.getMockEvents();
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return this.getMockEvents();
    }
  }

  /**
   * Get email summary
   */
  async getEmailSummary(): Promise<EmailSummary> {
    // This would require OAuth and Gmail API integration
    console.info('Email integration requires OAuth setup');
    return this.getMockEmailSummary();
  }

  /**
   * Get stock prices for symbols
   */
  async getStockPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
      // Using a free API for demo purposes
      const promises = symbols.map(async (symbol) => {
        const response = await fetch(
          `https://api.twelvedata.com/price?symbol=${symbol}&apikey=demo`
        );
        const data = await response.json();
        return { symbol, price: parseFloat(data.price) || 0 };
      });

      const results = await Promise.all(promises);
      return results.reduce((acc, { symbol, price }) => {
        acc[symbol] = price;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      return symbols.reduce((acc, symbol) => {
        acc[symbol] = Math.random() * 1000;
        return acc;
      }, {} as Record<string, number>);
    }
  }

  // Mock data methods for when APIs are not configured
  private getMockNews(): NewsItem[] {
    return [
      {
        title: "AI Assistant Technology Reaches New Milestone",
        description: "Latest developments in voice-first AI assistants show promising results in productivity automation.",
        url: "https://example.com/news/1",
        source: "Tech News",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Voice Recognition Accuracy Improves Significantly", 
        description: "New algorithms provide better understanding of natural language commands.",
        url: "https://example.com/news/2",
        source: "AI Today",
        publishedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  private getMockWeather(): WeatherData {
    return {
      location: "London",
      temperature: 18,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12
    };
  }

  private getMockEvents(): CalendarEvent[] {
    const now = new Date();
    return [
      {
        id: "1",
        title: "Team Standup",
        start: new Date(now.getTime() + 3600000).toISOString(),
        end: new Date(now.getTime() + 5400000).toISOString(),
        location: "Conference Room A"
      },
      {
        id: "2", 
        title: "Project Review",
        start: new Date(now.getTime() + 7200000).toISOString(),
        end: new Date(now.getTime() + 10800000).toISOString(),
        description: "Review GroqFlow project progress"
      }
    ];
  }

  private getMockEmailSummary(): EmailSummary {
    return {
      unreadCount: 7,
      important: [
        {
          subject: "Project Update Required",
          sender: "manager@company.com",
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          subject: "Meeting Reminder", 
          sender: "calendar@company.com",
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };
  }

  /**
   * Check if all APIs are configured
   */
  isFullyConfigured(): boolean {
    return !!(this.newsApiKey && this.weatherApiKey && this.googleApiKey);
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus(): Record<string, boolean> {
    return {
      news: !!this.newsApiKey,
      weather: !!this.weatherApiKey,
      google: !!this.googleApiKey
    };
  }
}

export const realtimeDataService = new RealtimeDataService();
export default realtimeDataService;
