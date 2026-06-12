import { useEffect, useState, useRef } from 'react';

export default function CircularProgress({
  value = 0,
  max = 200,
  size = 180,
  strokeWidth = 12,
  label = 'kg CO₂',
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const circleRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 70) return { stroke: '#22c55e', bg: 'rgba(34,197,94,0.1)', text: 'text-primary-light' };
    if (percentage < 90) return { stroke: '#d97706', bg: 'rgba(217,119,6,0.1)', text: 'text-accent' };
    return { stroke: '#ef4444', bg: 'rgba(239,68,68,0.1)', text: 'text-danger' };
  };

  const colors = getColor();

  // Animate value on mount
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(eased * value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
        />
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colors.text} dark:${colors.text}`}>
          {animatedValue.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          / {max} {label}
        </span>
        <span className={`text-sm font-semibold mt-1 ${colors.text}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
