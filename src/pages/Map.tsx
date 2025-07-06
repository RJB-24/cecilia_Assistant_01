
import React from 'react';
import InteractiveMap from '@/components/maps/InteractiveMap';

const Map: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold jarvis-glow-text mb-2">AI Map Interface</h1>
        <p className="text-gray-400">Navigate and explore with AI assistance</p>
      </div>
      <InteractiveMap />
    </div>
  );
};

export default Map;
