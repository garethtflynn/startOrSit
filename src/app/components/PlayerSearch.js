'use client';

import { useState, useEffect } from 'react';
import { searchPlayers } from '../lib/nfl-players';

export default function PlayerSearch({ onPlayerSelect, selectedPlayers = [], placeholder = "Search for a player..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query) {
      const searchResults = searchPlayers(query);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handlePlayerSelect = (player) => {
    onPlayerSelect(player);
    setQuery('');
    setIsOpen(false);
  };

  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some(p => p.id === playerId);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {results.map((player) => (
            <button
              key={player.id}
              onClick={() => handlePlayerSelect(player)}
              disabled={isPlayerSelected(player.id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                isPlayerSelected(player.id) ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{player.name}</p>
                  <p className="text-sm text-gray-600">{player.position} - {player.team}</p>
                </div>
                {isPlayerSelected(player.id) && (
                  <span className="text-sm text-green-600 font-medium">Selected</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}