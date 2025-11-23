import { MapPin, Cloud, Compass } from 'lucide-react';
import { AgentResponse } from '../types';

interface ResponseDisplayProps {
  response: AgentResponse | null;
  placeName: string;
}

export default function ResponseDisplay({ response, placeName }: ResponseDisplayProps) {
  if (!response) return null;

  if (response.error) {
    return (
      <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <MapPin className="text-red-500 mt-1" size={24} />
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Location Not Found</h3>
            <p className="text-gray-300">{response.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasWeather = response.weather;
  const hasPlaces = response.places && response.places.places.length > 0;

  return (
    <div className="space-y-6">
      {hasWeather && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Cloud className="text-cyan-400 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Weather in {placeName}</h3>
              <p className="text-gray-300 text-lg">
                It's currently <span className="text-cyan-400 font-bold">{response.weather.temperature}°C</span> with a <span className="text-cyan-400 font-bold">{response.weather.rainChance}%</span> chance of rain.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasPlaces && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Compass className="text-cyan-400 mt-1" size={24} />
            <div className="w-full">
              <h3 className="text-xl font-semibold text-white mb-3">Places to visit in {placeName}</h3>
              <ul className="space-y-2">
                {response.places.places.map((place, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    <span className="text-lg">{place.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
