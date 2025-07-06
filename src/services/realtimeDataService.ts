
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export class RealtimeDataService {
  private weatherApiKey: string | null = null;
  private newsApiKey: string | null = null;

  constructor() {
    this.weatherApiKey = localStorage.getItem('weather_api_key') || process.env.WEATHER_API_KEY;
    this.newsApiKey = localStorage.getItem('news_api_key') || process.env.NEWS_API_KEY;
  }

  setWeatherApiKey(apiKey: string) {
    this.weatherApiKey = apiKey;
    localStorage.setItem('weather_api_key', apiKey);
  }

  setNewsApiKey(apiKey: string) {
    this.newsApiKey = apiKey;
    localStorage.setItem('news_api_key', apiKey);
  }

  async getCurrentWeather(location: string = 'auto'): Promise<WeatherData> {
    if (!this.weatherApiKey) {
      // Return mock data when API key is not configured
      return {
        location: 'Demo Location',
        temperature: 22,
        condition: 'Clear Sky',
        humidity: 65,
        windSpeed: 12,
        icon: '01d'
      };
    }

    try {
      let weatherUrl: string;
      
      if (location === 'auto') {
        // Get user's location first
        const position = await this.getCurrentPosition();
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${this.weatherApiKey}&units=metric`;
      } else {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.weatherApiKey}&units=metric`;
      }

      const response = await fetch(weatherUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Weather API error');
      }

      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Unable to fetch weather data');
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true
      });
    });
  }

  async getLatestNews(category: string = 'general', limit: number = 10): Promise<NewsArticle[]> {
    if (!this.newsApiKey) {
      // Return mock data when API key is not configured
      return [
        {
          title: 'Demo News Article 1',
          description: 'This is a demo news article for testing purposes.',
          url: '#',
          source: 'Demo Source',
          publishedAt: new Date().toISOString()
        },
        {
          title: 'Demo News Article 2', 
          description: 'Another demo news article with sample content.',
          url: '#',
          source: 'Demo News',
          publishedAt: new Date().toISOString()
        }
      ];
    }

    try {
      const newsUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=${limit}&apiKey=${this.newsApiKey}`;
      
      const response = await fetch(newsUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'News API error');
      }

      return data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        imageUrl: article.urlToImage
      }));
    } catch (error) {
      console.error('News API Error:', error);
      throw new Error('Unable to fetch news data');
    }
  }

  async getStockPrice(symbol: string): Promise<any> {
    // Mock implementation - would need a real stock API
    return {
      symbol: symbol.toUpperCase(),
      price: (Math.random() * 1000 + 100).toFixed(2),
      change: (Math.random() * 20 - 10).toFixed(2),
      changePercent: (Math.random() * 5 - 2.5).toFixed(2)
    };
  }

  getConfiguration() {
    return {
      hasWeatherApi: !!this.weatherApiKey,
      hasNewsApi: !!this.newsApiKey
    };
  }
}

export const realtimeDataService = new RealtimeDataService();
export default realtimeDataService;
