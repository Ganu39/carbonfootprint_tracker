import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CircularProgress from '../components/CircularProgress';
import MetricCard from '../components/MetricCard';
import ActivityCard from '../components/ActivityCard';
import {
  CalendarDays,
  TrendingDown,
  Flame,
  Tag,
  Plus,
  Activity,
  ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({ total: 0, goal: 200 });
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [categories, setCategories] = useState({});
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getBiggestCategory = () => {
    if (!categories || Object.keys(categories).length === 0) return 'N/A';
    const sorted = Object.entries(categories).sort(([, a], [, b]) => b - a);
    return sorted[0]?.[0] || 'N/A';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesRes, monthlyRes, categoriesRes] = await Promise.allSettled([
          api.get('/activities?limit=5'),
          api.get('/stats/monthly'),
          api.get('/stats/categories'),
        ]);

        if (activitiesRes.status === 'fulfilled') {
          const acts = activitiesRes.value.data.activities || activitiesRes.value.data || [];
          setRecentActivities(Array.isArray(acts) ? acts : []);
        }

        if (monthlyRes.status === 'fulfilled') {
          const data = monthlyRes.value.data;
          setMonthlyStats({
            total: data.total || data.totalCO2 || 0,
            goal: data.goal || user?.monthlyGoal || 200,
          });
          setWeeklyTotal(data.weeklyTotal || data.thisWeek || 0);
          setStreak(data.streak || data.streakDays || 0);
        }

        if (categoriesRes.status === 'fulfilled') {
          setCategories(categoriesRes.value.data.categories || categoriesRes.value.data || {});
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.monthlyGoal]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      setRecentActivities((prev) => prev.filter((a) => (a._id || a.id) !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Skeleton for greeting */}
        <div className="space-y-2">
          <div className="skeleton h-8 w-64 rounded-lg" />
          <div className="skeleton h-4 w-48 rounded-lg" />
        </div>
        {/* Skeleton for progress + metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Skeleton for activities */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Greeting ──────────────────────────────── */}
      <div className="animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white">
          {getGreeting()}, <span className="text-primary dark:text-primary-light">{user?.name || 'Eco Warrior'}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {formatDate()}
        </p>
      </div>

      {/* ─── Progress Ring + Metric Cards ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center animate-slide-up stagger-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Monthly Carbon Budget
          </h3>
          <CircularProgress
            value={monthlyStats.total}
            max={monthlyStats.goal}
            size={180}
            strokeWidth={14}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            {monthlyStats.total < monthlyStats.goal
              ? `${(monthlyStats.goal - monthlyStats.total).toFixed(1)} kg remaining`
              : `${(monthlyStats.total - monthlyStats.goal).toFixed(1)} kg over budget`}
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="animate-slide-up stagger-2">
            <MetricCard
              title="This Month"
              value={monthlyStats.total.toFixed(1)}
              unit="kg CO₂"
              icon={Activity}
              trend={monthlyStats.total < monthlyStats.goal ? 'down' : 'up'}
              color="primary"
            />
          </div>
          <div className="animate-slide-up stagger-3">
            <MetricCard
              title="This Week"
              value={weeklyTotal.toFixed(1)}
              unit="kg CO₂"
              icon={TrendingDown}
              color="accent"
            />
          </div>
          <div className="animate-slide-up stagger-4">
            <MetricCard
              title="Biggest Category"
              value={getBiggestCategory()}
              icon={Tag}
              color="danger"
            />
          </div>
          <div className="animate-slide-up stagger-5">
            <MetricCard
              title="Streak Days 🔥"
              value={streak}
              unit="days"
              icon={Flame}
              color="success"
            />
          </div>
        </div>
      </div>

      {/* ─── Recent Activities ─────────────────────── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark dark:text-white">Recent Activities</h2>
          <Link
            to="/log"
            className="text-sm font-medium text-primary dark:text-primary-light hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentActivities.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="font-semibold text-dark dark:text-white mb-1">No activities yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Start logging your carbon footprint today!
            </p>
            <Link
              to="/log"
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Log Activity</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={activity._id || activity.id || index}
                className="animate-slide-up"
                style={{ animationDelay: `${0.35 + index * 0.05}s` }}
              >
                <ActivityCard activity={activity} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Floating Action Button ────────────────── */}
      <Link
        to="/log"
        className="fixed bottom-24 lg:bottom-8 right-6 z-40 w-14 h-14 gradient-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-110 animate-pulse-glow"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}
