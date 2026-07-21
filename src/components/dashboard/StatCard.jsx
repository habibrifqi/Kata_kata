"use client";

import CountUp from "@/components/ui/CountUp";

export default function StatCard({ label, value, icon: Icon, colorClass, delay = "0.2s", isFilledHeart = false }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="glass-surface p-6 rounded-2xl glass-card-hover animate-fade-in cursor-default"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" fill={isFilledHeart ? "currentColor" : "none"} />
        </div>
        <span className="text-on-surface-variant font-label-md text-sm font-semibold">{label}</span>
      </div>
      <div className="text-3xl font-extrabold text-on-surface">
        <CountUp end={value} />
      </div>
    </div>
  );
}
