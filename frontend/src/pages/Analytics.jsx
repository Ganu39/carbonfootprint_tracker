import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import { BarChart3, TrendingDown, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const NATIONAL_AVERAGE = 158; // kg/month for India

export default function Analytics() {
  const { darkMode } = useTheme();
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [userMonthly, setUserMonthly] = useState(0);
  const [loading, setLoading] = useState(true);

  const textColor = darkMode ? '#e2e8f0' : '#1a1a2e';
  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff';

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [activitiesRes, categoriesRes, weeklyRes, monthlyRes] = await Promise.allSettled([
          api.get('/activities?limit=100'),
          api.get('/stats/categories'),
          api.get('/stats/weekly'),
          api.get('/stats/monthly'),
        ]);

        // Process daily data from activities (last 30 days)
        if (activitiesRes.status === 'fulfilled') {
          const activities = activitiesRes.value.data.activities || activitiesRes.value.data || [];
          const last30Days = getLast30DaysData(Array.isArray(activities) ? activities : []);
          setDailyData(last30Days);
        }

        // Category breakdown
        if (categoriesRes.status === 'fulfilled') {
          setCategoryData(categoriesRes.value.data.categories || categoriesRes.value.data || {});
        }

        // Weekly data
        if (weeklyRes.status === 'fulfilled') {
          const wd = weeklyRes.value.data.weeks || weeklyRes.value.data || [];
          setWeeklyData(Array.isArray(wd) ? wd : []);
        }

        // Monthly total
        if (monthlyRes.status === 'fulfilled') {
          setUserMonthly(monthlyRes.value.data.total || monthlyRes.value.data.totalCO2 || 0);
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getLast30DaysData = (activities) => {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTotal = activities
        .filter((a) => {
          const aDate = new Date(a.date || a.createdAt).toISOString().split('T')[0];
          return aDate === dateStr;
        })
        .reduce((sum, a) => sum + Number(a.co2 || a.carbonFootprint || 0), 0);
      days.push({
        date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        value: Number(dayTotal.toFixed(2)),
      });
    }
    return days;
  };

  // ─── Line Chart Config ────────────────────────
  const lineChartData = {
    labels: dailyData.map((d) => d.date),
    datasets: [
      {
        label: 'Daily CO₂ (kg)',
        data: dailyData.map((d) => d.value),
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.01)');
          return gradient;
        },
        borderColor: '#22c55e',
        borderWidth: 2.5,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toFixed(2)} kg CO₂`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, maxRotation: 0, autoSkip: true, maxTicksLimit: 8, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 }, callback: (val) => `${val} kg` },
        beginAtZero: true,
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  // ─── Doughnut Chart Config ────────────────────
  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);
  const categoryColors = {
    transport: '#3b82f6',
    food: '#d97706',
    energy: '#eab308',
    shopping: '#8b5cf6',
  };

  const doughnutData = {
    labels: categoryLabels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((l) => categoryColors[l] || '#6b7280'),
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: darkMode ? '#0f172a' : '#ffffff',
        spacing: 4,
        borderRadius: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
            return `${ctx.parsed.toFixed(2)} kg CO₂ (${pct}%)`;
          },
        },
      },
    },
  };

  // ─── Bar Chart Config ─────────────────────────
  const weekLabels = weeklyData.length > 0
    ? weeklyData.map((_, i) => `Week ${i + 1}`)
    : Array.from({ length: 8 }, (_, i) => `W${i + 1}`);
  const weekValues = weeklyData.length > 0
    ? weeklyData.map((w) => w.total || w.value || 0)
    : Array(8).fill(0);

  const barChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Weekly CO₂ (kg)',
        data: weekValues,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, '#22c55e');
          gradient.addColorStop(1, '#1a6b3c');
          return gradient;
        },
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toFixed(2)} kg CO₂`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 }, callback: (val) => `${val} kg` },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton h-4 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  const comparisonPct = NATIONAL_AVERAGE > 0
    ? (((userMonthly - NATIONAL_AVERAGE) / NATIONAL_AVERAGE) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6">
      {/* ─── Header ────────────────────────────────── */}
      <div className="animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary dark:text-primary-light" />
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Visualize your carbon footprint trends
        </p>
      </div>

      {/* ─── Charts Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Daily */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-slide-up stagger-1">
          <h3 className="font-bold text-dark dark:text-white mb-1">Daily CO₂ Emissions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last 30 days</p>
          <div className="h-72">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Categories */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-2">
          <h3 className="font-bold text-dark dark:text-white mb-1">Category Breakdown</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">By emission source</p>
          <div className="h-72 flex items-center justify-center">
            {categoryLabels.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm">No category data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart - Weekly */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-3">
          <h3 className="font-bold text-dark dark:text-white mb-1">Weekly Comparison</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Past 8 weeks</p>
          <div className="h-72">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* ─── Comparison Card ───────────────────────── */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-dark dark:text-white">You vs Average Indian</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly CO₂ comparison</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Your emissions */}
          <div className="bg-primary/5 dark:bg-primary-light/5 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Monthly</p>
            <p className="text-3xl font-bold text-primary dark:text-primary-light">
              {userMonthly.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">kg CO₂</p>
          </div>

          {/* Comparison */}
          <div className="flex items-center justify-center">
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              userMonthly <= NATIONAL_AVERAGE
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
            }`}>
              {userMonthly <= NATIONAL_AVERAGE ? (
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  {Math.abs(Number(comparisonPct))}% below avg
                </span>
              ) : (
                <span>↑ {comparisonPct}% above avg</span>
              )}
            </div>
          </div>

          {/* National average */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">National Average</p>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-300">
              {NATIONAL_AVERAGE}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">kg CO₂</p>
          </div>
        </div>

        {/* Visual bar comparison */}
        <div className="mt-6 space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>You</span>
              <span>{userMonthly.toFixed(1)} kg</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-1000"
                style={{ width: `${Math.min((userMonthly / (NATIONAL_AVERAGE * 1.5)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>National Avg</span>
              <span>{NATIONAL_AVERAGE} kg</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gray-400 dark:bg-gray-600 transition-all duration-1000"
                style={{ width: `${Math.min((NATIONAL_AVERAGE / (NATIONAL_AVERAGE * 1.5)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
