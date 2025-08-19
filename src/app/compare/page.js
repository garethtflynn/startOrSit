'use client'
import React, { useState } from "react";
import { Trash2, Plus, Users, TrendingUp, Clock } from "lucide-react";
import RecommendationResult from "../components/RecommendationResult";

function ComparePage() {
  const [players, setPlayers] = useState([
    {
      id: Math.random().toString(36),
      name: "",
      team: "",
      position: "",
    },
    {
      id: Math.random().toString(36),
      name: "",
      team: "",
      position: "",
    },
  ]);
  const [recommendation, setRecommendation] = useState(null);
  const [week, setWeek] = useState(1);
  const [loading, setLoading] = useState(false);

  const addPlayer = () => {
    if (players.length < 3) {
      setPlayers([
        ...players,
        {
          id: Math.random().toString(36),
          name: "",
          team: "",
          position: "",
        },
      ]);
    }
  };

  const removePlayer = (id) => {
    if (players.length > 2) {
      setPlayers(players.filter((p) => p.id !== id));
      setRecommendation(null);
    }
  };

  const updatePlayer = (id, field, value) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    console.log('player:', players)
    setRecommendation(null);
  };

  const getRecommendation = async () => {
    if (players.length < 2) {
      alert("Please add at least 2 players to compare");
      return;
    }

    if (players.some((p) => !p.name.trim())) {
      alert("Please enter names for all players");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          players,
          week,
          year: 2025,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendation");
      }

      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get AI recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const positions = ["QB", "RB", "WR", "TE", "K", "DEF"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Fantasy Football Analyzer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare NFL players and get AI-powered start/sit recommendations for your fantasy lineup
          </p>
        </div>

        {/* Week Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Week Selection</h2>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="week" className="text-sm font-medium text-gray-700">
              NFL Week:
            </label>
            <select
              id="week"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {[...Array(18)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Player Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Player Comparison</h2>
            </div>
            {players.length < 3 && (
              <button
                onClick={addPlayer}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Player
              </button>
            )}
          </div>

          <div className="space-y-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-black"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 font-semibold rounded-full">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Player Name
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayer(player.id, "name", e.target.value)}
                      placeholder="e.g., Josh Allen"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Team
                    </label>
                    <input
                      type="text"
                      value={player.team}
                      onChange={(e) => updatePlayer(player.id, "team", e.target.value)}
                      placeholder="e.g., BUF"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={player.position}
                      onChange={(e) => updatePlayer(player.id, "position", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {players.length > 2 && (
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={getRecommendation}
              disabled={loading || players.some((p) => !p.name.trim())}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Players...
                </div>
              ) : (
                "Get AI Recommendation"
              )}
            </button>
          </div>
        </div>

        {recommendation && (
          <RecommendationResult recommendation={recommendation}/>
        )}
      </div>
    </div>
  );
}

export default ComparePage;