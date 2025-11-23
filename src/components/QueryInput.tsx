import { useState } from 'react';
import { Send } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export default function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me about your travel destination..."
          className="w-full px-6 py-4 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
