import { useState } from 'react';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import ResponseDisplay from './components/ResponseDisplay';
import { orchestrateTourismQuery } from './services/tourismAgent';
import { parseUserQuery } from './utils/queryParser';
import { AgentResponse } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [placeName, setPlaceName] = useState('');

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const { place, needsWeather, needsPlaces } = parseUserQuery(query);

      if (!place) {
        setResponse({
          error: "I couldn't understand which place you want to visit. Please try again with a place name.",
        });
        setIsLoading(false);
        return;
      }

      setPlaceName(place);

      const result = await orchestrateTourismQuery(place, needsWeather, needsPlaces);
      setResponse(result);
    } catch (error) {
      setResponse({
        error: 'An error occurred while processing your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Plan Your Perfect Trip
            </h2>
            <p className="text-gray-400 text-lg">
              Ask me about weather, attractions, or plan your entire journey
            </p>
          </div>

          <div className="mb-8">
            <QueryInput onSubmit={handleQuery} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-cyan-500" size={48} />
            </div>
          )}

          {!isLoading && <ResponseDisplay response={response} placeName={placeName} />}

          {!response && !isLoading && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">Try asking questions like:</p>
              <div className="space-y-2 text-gray-300">
                <p className="italic">"I'm going to Bangalore, let's plan my trip"</p>
                <p className="italic">"What is the temperature in Paris?"</p>
                <p className="italic">"What places can I visit in Tokyo?"</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
