import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, unit = '', icon: Icon, trend, color = 'primary' }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary/10 dark:bg-primary-light/10',
      icon: 'text-primary dark:text-primary-light',
      border: 'border-primary/20 dark:border-primary-light/20',
    },
    accent: {
      bg: 'bg-accent/10 dark:bg-accent-light/10',
      icon: 'text-accent dark:text-accent-light',
      border: 'border-accent/20 dark:border-accent-light/20',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-danger',
      border: 'border-red-200 dark:border-red-800',
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'text-success',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className="glass-card rounded-xl p-5 group cursor-default">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${colors.icon}`} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'down' 
              ? 'bg-emerald-50 text-success dark:bg-emerald-900/30'
              : 'bg-red-50 text-danger dark:bg-red-900/30'
          }`}>
            {trend === 'down' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            {trend === 'down' ? '↓' : '↑'}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-dark dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {unit}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
}
