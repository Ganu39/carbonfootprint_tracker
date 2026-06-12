import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User,
  Save,
  Download,
  Flame,
  Leaf,
  Check,
  Loader2,
  Target,
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [dietType, setDietType] = useState('mixed');
  const [carType, setCarType] = useState('petrol');
  const [monthlyGoal, setMonthlyGoal] = useState(200);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const initials = (name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/profile');
        const data = res.data;
        setName(data.name || user?.name || '');
        setDietType(data.dietType || data.diet || 'mixed');
        setCarType(data.carType || data.car || 'petrol');
        setMonthlyGoal(data.monthlyGoal || 200);
        setStreak(data.streak || data.streakDays || 0);
      } catch (err) {
        // Use auth user data as fallback
        setName(user?.name || '');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.name]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/profile', {
        name,
        dietType,
        carType,
        monthlyGoal,
      });
      updateUser({ name, dietType, carType, monthlyGoal });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await api.get('/activities?limit=1000');
      const activities = res.data.activities || res.data || [];

      if (!Array.isArray(activities) || activities.length === 0) {
        setError('No activities to export');
        setExporting(false);
        return;
      }

      const headers = ['Date', 'Category', 'Type', 'Quantity', 'Unit', 'CO2 (kg)'];
      const rows = activities.map((a) => [
        new Date(a.date || a.createdAt).toLocaleDateString('en-IN'),
        a.category || '',
        a.type || a.activityType || '',
        a.quantity || a.value || '',
        a.unit || '',
        Number(a.co2 || a.carbonFootprint || 0).toFixed(2),
      ]);

      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ecostep_activities_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export activities');
    } finally {
      setExporting(false);
    }
  };

  const getGoalColor = () => {
    if (monthlyGoal <= 100) return 'text-success';
    if (monthlyGoal <= 200) return 'text-primary dark:text-primary-light';
    if (monthlyGoal <= 350) return 'text-accent';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-32 rounded-lg" />
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
        <div className="skeleton h-32 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ─── Header ────────────────────────────────── */}
      <div className="animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your EcoStep account</p>
      </div>

      {/* ─── Profile Card ──────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up stagger-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">{name || 'User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Diet Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Diet Type
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-cream dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm appearance-none cursor-pointer"
            >
              <option value="mixed">Mixed (Non-veg) 🍖</option>
              <option value="vegetarian">Vegetarian 🥗</option>
              <option value="vegan">Vegan 🌱</option>
            </select>
          </div>

          {/* Car Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Car Type
            </label>
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-cream dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm appearance-none cursor-pointer"
            >
              <option value="petrol">Petrol ⛽</option>
              <option value="diesel">Diesel 🚛</option>
              <option value="electric">Electric ⚡</option>
              <option value="none">No Car 🚶</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Monthly Goal ──────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up stagger-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-light/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary dark:text-primary-light" />
          </div>
          <div>
            <h3 className="font-bold text-dark dark:text-white">Monthly CO₂ Goal</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Set your carbon reduction target</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">50 kg</span>
            <span className={`text-3xl font-bold ${getGoalColor()}`}>
              {monthlyGoal} <span className="text-base font-medium">kg</span>
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">500 kg</span>
          </div>

          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>🌱 Eco Warrior</span>
            <span>🌍 Average</span>
            <span>🏭 High</span>
          </div>
        </div>
      </div>

      {/* ─── Streak Display ────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up stagger-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Logging Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-dark dark:text-white">{streak}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400">days</span>
              </div>
            </div>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
        {streak > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {streak >= 30
              ? '🏆 Incredible! You\'re an EcoStep champion!'
              : streak >= 7
              ? '⭐ Great job! Keep the momentum going!'
              : '🌱 Nice start! Build your streak day by day.'}
          </p>
        )}
      </div>

      {/* ─── Error ─────────────────────────────────── */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-danger animate-slide-down">
          {error}
        </div>
      )}

      {/* ─── Action Buttons ────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up stagger-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <>
              <Check className="w-5 h-5" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-primary dark:border-primary-light text-primary dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/5 transition-all disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
