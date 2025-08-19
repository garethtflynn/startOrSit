'use client';

import { useState } from 'react';

export default function PlayerComparisonCard({ player, onRemove, onStatsUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    projectedPoints: player.projectedPoints || '',
    averagePoints: player.averagePoints || '',
    lastWeekPoints: player.lastWeekPoints || '',
    injuryStatus: player.injuryStatus || 'Healthy'
  });

  const handleStatsSubmit = () => {
    onStatsUpdate(player.id, stats);
    setIsEditing(false);
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'QB': return 'bg-purple-100 text-purple-800';
      case 'RB': return 'bg-green-100 text-green-800';
      case 'WR': return 'bg-blue-100 text-blue-800';
      case 'TE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <button
        onClick={() => onRemove(player.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
      >
        ×
      </button>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
        <div className="flex gap-2 mt-2">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPositionColor(player.position)}`}>
            {player.position}
          </span>
          <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {player.team}
          </span>
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.projectedPoints || '--'}
              </p>
              <p className="text-xs text-gray-500">Projected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700">
                {stats.averagePoints || '--'}
              </p>
              <p className="text-xs text-gray-500">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.lastWeekPoints || '--'}
              </p>
              <p className="text-xs text-gray-500">Last Week</p>
            </div>
          </div>

          {stats.injuryStatus && stats.injuryStatus !== 'Healthy' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-2">
              <p className="text-sm text-red-700">Status: {stats.injuryStatus}</p>
            </div>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Add Stats
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Projected Points"
              value={stats.projectedPoints}
              onChange={(e) => setStats({...stats, projectedPoints: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Average Points"
              value={stats.averagePoints}
              onChange={(e) => setStats({...stats, averagePoints: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Last Week Points"
              value={stats.lastWeekPoints}
              onChange={(e) => setStats({...stats, lastWeekPoints: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <select
              value={stats.injuryStatus}
              onChange={(e) => setStats({...stats, injuryStatus: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="Healthy">Healthy</option>
              <option value="Questionable">Questionable</option>
              <option value="Doubtful">Doubtful</option>
              <option value="Out">Out</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStatsSubmit}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}