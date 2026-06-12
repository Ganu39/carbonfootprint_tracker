import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ActivityCard from '../components/ActivityCard';
import {
  Car,
  Utensils,
  Zap,
  ShoppingBag,
  Check,
  Loader2,
  CalendarDays,
  Leaf,
} from 'lucide-react';

// Emission factors
const EMISSION_FACTORS = {
  transport: { car: 0.21, bus: 0.089, flight: 0.255, bike: 0 },
  food: { beef: 6.61, chicken: 1.24, vegetarian: 0.5, vegan: 0.3 },
  energy: { electricity: 0.82, gas: 2.04 },
  shopping: { clothing: 15, electronics: 50, general: 5 },
};

const CATEGORY_CONFIG = {
  transport: {
    icon: Car,
    emoji: '🚗',
    label: 'Transport',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    types: [
      { value: 'car', label: 'Car 🚗' },
      { value: 'bus', label: 'Bus 🚌' },
      { value: 'flight', label: 'Flight ✈️' },
      { value: 'bike', label: 'Bike 🚲' },
    ],
    quantityLabel: 'Distance',
    unit: 'km',
  },
  food: {
    icon: Utensils,
    emoji: '🍽️',
    label: 'Food',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    types: [
      { value: 'beef', label: 'Beef 🥩' },
      { value: 'chicken', label: 'Chicken 🍗' },
      { value: 'vegetarian', label: 'Vegetarian 🥗' },
      { value: 'vegan', label: 'Vegan 🌱' },
    ],
    quantityLabel: 'Number of meals',
    unit: 'meals',
  },
  energy: {
    icon: Zap,
    emoji: '⚡',
    label: 'Energy',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    types: [
      { value: 'electricity', label: 'Electricity 💡' },
      { value: 'gas', label: 'Gas 🔥' },
    ],
    quantityLabel: 'Amount',
    unit: 'kWh / m³',
  },
  shopping: {
    icon: ShoppingBag,
    emoji: '🛍️',
    label: 'Shopping',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    types: [
      { value: 'clothing', label: 'Clothing 👕' },
      { value: 'electronics', label: 'Electronics 💻' },
      { value: 'general', label: 'General 📦' },
    ],
    quantityLabel: 'Number of items',
    unit: 'items',
  },
};

export default function ActivityLogger() {
  const [activeCategory, setActiveCategory] = useState('transport');
  const [type, setType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [todayActivities, setTodayActivities] = useState([]);
  const [fetchingActivities, setFetchingActivities] = useState(true);

  const config = CATEGORY_CONFIG[activeCategory];

  // Calculate CO2 preview
  const estimatedCO2 = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const factor = EMISSION_FACTORS[activeCategory]?.[type] || 0;
    return qty * factor;
  }, [activeCategory, type, quantity]);

  // Reset type when category changes
  useEffect(() => {
    const firstType = CATEGORY_CONFIG[activeCategory].types[0].value;
    setType(firstType);
    setQuantity('');
    setError('');
  }, [activeCategory]);

  // Fetch today's activities
  useEffect(() => {
    const fetchToday = async () => {
      setFetchingActivities(true);
      try {
        const res = await api.get('/activities?limit=20');
        const activities = res.data.activities || res.data || [];
        const today = new Date().toISOString().split('T')[0];
        const todayActs = Array.isArray(activities)
          ? activities.filter((a) => {
              const actDate = new Date(a.date || a.createdAt).toISOString().split('T')[0];
              return actDate === today;
            })
          : [];
        setTodayActivities(todayActs);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setFetchingActivities(false);
      }
    };
    fetchToday();
  }, [success]); // Re-fetch after success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      await api.post('/activities', {
        category: activeCategory,
        type,
        quantity: parseFloat(quantity),
        unit: config.unit.split(' / ')[0],
        date,
        co2: estimatedCO2,
      });
      setSuccess(true);
      setQuantity('');
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      setTodayActivities((prev) => prev.filter((a) => (a._id || a.id) !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Page Header ───────────────────────────── */}
      <div className="animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white">
          Log Activity
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Record your daily carbon footprint
        </p>
      </div>

      {/* ─── Category Tabs ─────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-slide-up stagger-1 scrollbar-none">
        {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => {
          const Icon = cat.icon;
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-lg shadow-primary/20'
                  : 'glass-card text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className="text-base">{cat.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Activity Form ─────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up stagger-2">
        {/* Success overlay */}
        {success && (
          <div className="absolute inset-0 z-10 bg-white/90 dark:bg-dark-surface/90 rounded-2xl flex flex-col items-center justify-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-success" strokeWidth={3} />
            </div>
            <p className="font-semibold text-dark dark:text-white">Activity Logged!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {estimatedCO2.toFixed(2)} kg CO₂ recorded
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {config.label} Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-cream dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm appearance-none cursor-pointer"
            >
              {config.types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {config.quantityLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Enter ${config.quantityLabel.toLowerCase()}`}
                className="w-full px-4 py-3 pr-16 rounded-xl bg-cream dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                {config.unit}
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm"
              />
            </div>
          </div>

          {/* CO2 Preview */}
          {quantity && parseFloat(quantity) > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 dark:bg-primary-light/5 border border-primary/20 dark:border-primary-light/20 animate-scale-in">
              <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary-light/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary dark:text-primary-light" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Estimated CO₂</p>
                <p className="text-xl font-bold text-primary dark:text-primary-light">
                  {estimatedCO2.toFixed(2)}{' '}
                  <span className="text-sm font-medium">kg CO₂</span>
                </p>
              </div>
              {type === 'bike' && (
                <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full font-medium">
                  Zero Emission! 🎉
                </span>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-danger animate-slide-down">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !quantity}
            className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Log Activity</span>
                <Leaf className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* ─── Today's Activities ────────────────────── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Today's Activities
        </h2>

        {fetchingActivities ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : todayActivities.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No activities logged today. Start tracking!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayActivities.map((activity, index) => (
              <ActivityCard
                key={activity._id || activity.id || index}
                activity={activity}
                onDelete={handleDelete}
              />
            ))}
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total today:{' '}
                <span className="font-bold text-primary dark:text-primary-light">
                  {todayActivities
                    .reduce((sum, a) => sum + Number(a.co2 || a.carbonFootprint || 0), 0)
                    .toFixed(2)}{' '}
                  kg CO₂
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
