import { Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';

export default function InsightCard({ insight }) {
  if (!insight) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl animate-slide-up">
      {/* Gradient accent border */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-accent rounded-2xl" />
      <div className="relative m-[2px] bg-white dark:bg-dark-surface rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-light/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary dark:text-primary-light" />
          </div>
          <div>
            <h3 className="font-bold text-dark dark:text-white">AI Weekly Insight</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {insight.weekRange || 'This week\'s analysis'}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-cream dark:bg-dark-bg rounded-xl p-4 mb-4 border-l-4 border-primary dark:border-primary-light">
          <p className="text-sm text-dark dark:text-gray-200 leading-relaxed italic">
            "{insight.summary || insight.text || 'No insight available yet.'}"
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Worst Category */}
          {insight.worstCategory && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Highest Impact</p>
                <p className="font-semibold text-dark dark:text-white capitalize">
                  {insight.worstCategory}
                </p>
              </div>
            </div>
          )}

          {/* Projected Monthly */}
          {insight.projectedMonthly !== undefined && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-accent shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Projected Monthly</p>
                <p className="font-semibold text-dark dark:text-white">
                  {Number(insight.projectedMonthly).toFixed(1)} kg
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
