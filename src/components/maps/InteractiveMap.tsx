
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search, Zap } from 'lucide-react';
import { toast } from 'sonner';

const InteractiveMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Initialize map (using a simple implementation since we don't have Mapbox token)
    const initializeMap = () => {
      // This is a placeholder for map initialization
      // In production, you would use Mapbox or Google Maps API
      const mapContainer = mapRef.current;
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
              <div class="absolute top-1/4 left-1/3 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              <div class="absolute top-1/2 left-1/2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              <div class="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
            </div>
            <div class="text-center text-white z-10">
              <div class="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Interactive Map</h3>
              <p class="text-sm opacity-80">Your location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</p>
              <p class="text-xs mt-2 opacity-60">Configure Mapbox API key in settings for full functionality</p>
            </div>
          </div>
        `;
      }
    };

    initializeMap();
  }, [userLocation]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    toast.info(`Searching for: ${searchQuery}`);
    // In production, this would integrate with maps API for search
  };

  const handleNavigate = () => {
    if (!userLocation) {
      toast.error('Location not available');
      return;
    }
    
    toast.success('Navigation activated');
    // In production, this would start navigation
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="jarvis-hologram">
        <CardHeader>
          <CardTitle className="text-xl font-bold jarvis-glow-text flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            AI-Powered Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search locations, find nearby services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-slate-800 border-cyan-400/30 text-white"
              />
            </div>
            <Button onClick={handleSearch} className="bg-cyan-600 hover:bg-cyan-700">
              <Search className="w-4 h-4" />
            </Button>
            <Button onClick={handleNavigate} className="bg-green-600 hover:bg-green-700">
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {['Restaurants', 'Gas Stations', 'Hospitals', 'Hotels', 'ATMs'].map((place) => (
              <Button
                key={place}
                variant="outline"
                size="sm"
                className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
                onClick={() => {
                  setSearchQuery(place);
                  handleSearch();
                }}
              >
                {place}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Display */}
      <Card className="jarvis-hologram">
        <CardContent className="p-0">
          <div ref={mapRef} className="w-full h-96 rounded-lg"></div>
        </CardContent>
      </Card>

      {/* Location Info */}
      {userLocation && (
        <Card className="jarvis-hologram">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-cyan-300">Current Location</h3>
                <p className="text-sm text-gray-300">
                  Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                </p>
              </div>
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
