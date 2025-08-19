import React from "react";

function RecommendationResult({ recommendation }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        AI Recommendation
      </h2>
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="prose max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {recommendation.recommendation || "No recommendation available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecommendationResult;
