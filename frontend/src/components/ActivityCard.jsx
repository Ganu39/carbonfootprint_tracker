import { Car, Utensils, Zap, ShoppingBag, Trash2 } from 'lucide-react';

const categoryConfig = {
  transport: {
    icon: Car,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  food: {
    icon: Utensils,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  energy: {
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
  shopping: {
    icon: ShoppingBag,
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
};

export default function ActivityCard({ activity, onDelete }) {
  const category = activity.category?.toLowerCase() || 'transport';
  const config = categoryConfig[category] || categoryConfig.transport;
  const Icon = config.icon;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    if (diffHrs < 48) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass-card rounded-xl p-4 group">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-dark dark:text-white capitalize truncate">
              {activity.type || activity.activityType || category}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
              {category}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {activity.quantity || activity.value || ''} {activity.unit || ''}
            {activity.quantity && ' · '}
            {formatDate(activity.date || activity.createdAt)}
          </p>
        </div>

        {/* CO2 Value */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-dark dark:text-white">
            {Number(activity.co2 || activity.carbonFootprint || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">kg CO₂</p>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(activity._id || activity.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-danger"
            title="Delete activity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
