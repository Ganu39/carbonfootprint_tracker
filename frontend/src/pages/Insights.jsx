import { useState, useEffect } from 'react';
import api from '../api/axios';
import InsightCard from '../components/InsightCard';
import { Sparkles, RefreshCw, Lightbulb, Loader2, Brain } from 'lucide-react';

export default function Insights() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLatest, setFetchingLatest] = useState(true);
  const [error, setError] = useState('');

  // Fetch latest insight on mount
  useEffect(() => {
    const fetchLatest = async () => {
      setFetchingLatest(true);
      try {
        const res = await api.get('/insights/latest');
        if (res.data && (res.data.summary || res.data.text)) {
          setInsight(res.data);
        }
      } catch (err) {
        // No cached insight — that's okay
        console.log('No cached insight found');
      } finally {
        setFetchingLatest(false);
      }
    };
    fetchLatest();
  }, []);

  const generateInsight = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/insights/generate');
      setInsight(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate insight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tips = insight?.tips || [
    'Try replacing one car trip per week with public transport or cycling to reduce your transport emissions.',
    'Incorporate more plant-based meals into your diet — even one meatless day per week makes a difference.',
    'Switch to energy-efficient appliances and LED bulbs to lower your household energy footprint.',
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ────────────────────────────────── */}
      <div className="animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary dark:text-primary-light" />
          AI Insights
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Personalized recommendations powered by AI
        </p>
      </div>

      {/* ─── Generate Button ───────────────────────── */}
      <div className="animate-slide-up stagger-1">
        <button
          onClick={generateInsight}
          disabled={loading}
          className="w-full sm:w-auto btn-primary px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Insight...</span>
            </>
          ) : insight ? (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Regenerate Weekly Insight</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate My Weekly Insight</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Loading Skeleton ──────────────────────── */}
      {loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="skeleton w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            </div>
            <div className="skeleton h-20 rounded-xl mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-16 rounded-xl" />
              <div className="skeleton h-16 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* ─── Error ─────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-danger animate-slide-down">
          {error}
        </div>
      )}

      {/* ─── Insight Card ──────────────────────────── */}
      {!loading && insight && (
        <div className="animate-slide-up stagger-2">
          <InsightCard insight={insight} />
        </div>
      )}

      {/* ─── Tip Cards ─────────────────────────────── */}
      {!loading && insight && (
        <div className="animate-slide-up stagger-3">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Personalized Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl animate-slide-up group"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {/* Gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-primary-light/30 rounded-xl" />
                <div className="relative m-[1px] bg-white dark:bg-dark-surface rounded-xl p-5 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 dark:bg-accent-light/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold text-accent">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Empty State ───────────────────────────── */}
      {!loading && !insight && !fetchingLatest && (
        <div className="glass-card rounded-2xl p-12 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 dark:bg-primary-light/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary dark:text-primary-light animate-float" />
          </div>
          <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
            Get Your AI Insight
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Our AI will analyze your carbon footprint data and provide personalized
            recommendations to help you reduce your environmental impact.
          </p>
          <button
            onClick={generateInsight}
            className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Insight</span>
          </button>
        </div>
      )}

      {/* Fetching latest loading */}
      {fetchingLatest && !loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary dark:text-primary-light animate-spin" />
        </div>
      )}
    </div>
  );
}
