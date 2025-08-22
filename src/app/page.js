import Link from "next/link";
import { Brain, Zap, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Fantasy Football AI Advisor
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can`t decide between two players? Get AI-powered recommendations to
            help you make the right start/sit decision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/compare"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Compare Players Now
            </Link>
            <Link
              href="/auth/sign-in"
              className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600">
              Get intelligent recommendations based on stats, matchups, and
              current form.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">
              Quick Comparisons
            </h3>
            <p className="text-gray-600">
              Compare 2-3 players instantly without complex league integrations.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">
              Decision History
            </h3>
            <p className="text-gray-600">
              Track your past comparisons and see how the AI`s recommendations
              performed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
