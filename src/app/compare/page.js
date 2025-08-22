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
  Calendar,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import RecommendationResult from "../components/RecommendationResult";

function ComparePage() {
  const { data: session, status } = useSession();
  const [players, setPlayers] = useState([
    {
      id: Math.random().toString(36),
      name: "",
      team: "",
      position: "QB",
    },
    {
      id: Math.random().toString(36),
      name: "",
      team: "",
      position: "QB",
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

  const handleChange = (id, field, value) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setRecommendation(null);
  };

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

  const positions = ["QB", "RB", "WR", "TE", "K", "DEF"];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compare Players</h1>
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={loadSearchHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition text-sm"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-200 transition text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-200 transition text-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
            <h2 className="text-lg font-semibold text-gray-900">Select Week</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label htmlFor="week" className="text-sm font-medium text-gray-700">
              NFL Week:
            </label>
            <select
              id="week"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-black"
            >
              {[...Array(18)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">
                Player Comparison
              </h2>
            </div>
            {players.length < 3 && (
              <button
                onClick={addPlayer}
                className="bg-gray-100 text-gray-900 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition text-sm"
              >
                + Add Player
              </button>
            )}
          </div>

          <div className="space-y-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-900 font-semibold rounded-full">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 text-black">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) =>
                      handleChange(player.id, "name", e.target.value)
                    }
                    placeholder="Player Name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                  <input
                    type="text"
                    value={player.team}
                    onChange={(e) =>
                      handleChange(player.id, "team", e.target.value)
                    }
                    placeholder="Team"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                  <select
                    value={player.position}
                    onChange={(e) =>
                      handleChange(player.id, "position", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-black bg-white"
                  >
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                {players.length > 2 && (
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
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
              className="w-full py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Analyzing..." : "Get AI Recommendation"}
            </button>
          </div>
        </div>

        {recommendation && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
            <RecommendationResult recommendation={recommendation} />
          </div>
        )}

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
      </div>
    </div>
  );
}

export default ComparePage;
