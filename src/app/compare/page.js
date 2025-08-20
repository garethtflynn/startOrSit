"use client";
import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Users,
  TrendingUp,
  Clock,
  History,
  LogIn,
  LogOut,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

function ComparePage() {
  const { data: session, status } = useSession();
  const [players, setPlayers] = useState([
    {
      id: Math.random().toString(36),
      name: "",
      team: "",
      position: "RB",
    },
    {
      id: Math.random().toString(36),
      name: "",
      team: "",
      position: "RB",
    },
  ]);
  const [recommendation, setRecommendation] = useState(null);
  const [week, setWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const addPlayer = () => {
    if (players.length < 3) {
      setPlayers([
        ...players,
        {
          id: Math.random().toString(36),
          name: "",
          team: "",
          position: "RB",
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
    setRecommendation(null);
  };

  // const getRecommendation = async () => {
  //   if (players.length < 2) {
  //     alert("Please add at least 2 players to compare");
  //     return;
  //   }

  //   if (players.some((p) => !p.name.trim())) {
  //     alert("Please enter names for all players");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch("/api/recommendation", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         players,
  //         week,
  //         year: 2025,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to get recommendation");
  //     }

  //     const data = await response.json();
  //     setRecommendation(data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to get AI recommendation. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadSearchHistory = async () => {
    try {
      const res = await fetch("/api/search-history", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load history");

      const data = await res.json();
      setSearchHistory(data);
      setShowHistory(true);
    } catch (err) {
      console.error("Error loading history:", err);
      alert("Could not load history. Please try again.");
    }
  };

  const handleRecommendation = async () => {
    if (players.length < 2) {
      alert("Please add at least 2 players");
      return;
    }

    if (players.some((p) => !p.name.trim())) {
      alert("Please fill in all player names");
      return;
    }

    setLoading(true);

    try {
      const recRes = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players, week, year: 2025 }),
      });

      if (!recRes.ok) throw new Error("Failed to get recommendation");

      const data = await recRes.json();
      setRecommendation(data);

      const saveRes = await fetch("/api/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          players,
          week,
          year: 2025,
          recommendation: data.recommendation,
        }),
      });

      if (!saveRes.ok) {
        console.error("Failed to save search");
      } else {
        console.log("Search saved successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  // const saveSearch = async () => {
  //   try {
  //     const res = await fetch("/api/search-history", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ players, week, year, recommendation }),
  //     });
  //     if (!res.ok) {
  //       const error = await res.json();
  //       throw new Error(error.error || "Failed to save search");
  //     }
  //     return await res.json();
  //   } catch (error) {
  //     console.error("Error saving search:", err);
  //     return null;
  //   }
  // };

  const positions = ["QB", "RB", "WR", "TE", "K", "DEF"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                Fantasy Football Analyzer
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadSearchHistory}
                    className="flex items-center gap-1 px-3 py-2 bg-green-800 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                  >
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Compare NFL players and get AI-powered start/sit recommendations for
            your fantasy lineup
          </p>
          {session && (
            <p className="text-sm text-green-600 mt-2">
              Welcome back, {session.user.username}! Your searches will be saved
              to history.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Week Selection
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label htmlFor="week" className="text-sm font-medium text-gray-700">
              NFL Week:
            </label>
            <select
              id="week"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
            >
              {[...Array(18)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Player Comparison
              </h2>
            </div>
            {players.length < 3 && (
              <button
                onClick={addPlayer}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
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
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 font-semibold rounded-full">
                  {index + 1}
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 text-black">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Player Name
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        updatePlayer(player.id, "name", e.target.value)
                      }
                      placeholder="e.g., Josh Allen"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Team
                    </label>
                    <input
                      type="text"
                      value={player.team}
                      onChange={(e) =>
                        updatePlayer(player.id, "team", e.target.value)
                      }
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
                      onChange={(e) =>
                        updatePlayer(player.id, "position", e.target.value)
                      }
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
              onClick={handleRecommendation}
              disabled={loading || players.some((p) => !p.name.trim())}
              className="w-full py-3.5 sm:py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-base sm:text-base"
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

        {/* Search History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {searchHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No search history yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((search) => (
                      <div key={search.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">
                            Week {search.week} {search.year}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(search.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Players:{" "}
                          {search.players.map((p) => p.name).join(", ")}
                        </div>
                        <div className="text-sm text-gray-800">
                          {search.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {recommendation && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              AI Recommendation
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {recommendation.recommendation ||
                    "No recommendation available"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;
