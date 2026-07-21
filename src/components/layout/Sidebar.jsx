"use client";

import {
  LayoutDashboard,
  Quote,
  Layers,
  ScanText,
  Settings,
  LogOut
} from "lucide-react";

export const DEFAULT_NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Quotes", icon: Quote },
  { name: "Categories", icon: Layers },
  { name: "Scan Quote", icon: ScanText }
];

export default function Sidebar({ activeMenu, setActiveMenu, navItems = DEFAULT_NAV_ITEMS }) {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] bg-surface/80 backdrop-blur-xl border-r border-outline-variant/20 z-50 p-6">
      {/* Brand Header */}
      <div className="mb-10">
        <h1 className="font-display-lg text-4xl font-extrabold text-primary tracking-tight">KataKata</h1>
        <p className="text-on-surface-variant font-label-md text-sm mt-1">Curation Hub</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container/30 text-primary border-l-4 border-primary shadow-[0_0_15px_rgba(192,193,255,0.3)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-label-md text-sm font-semibold">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Action CTA */}
      <button className="mt-4 bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-md text-sm font-bold py-3 px-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer">
        Add New Quote
      </button>

      {/* Footer Navigation */}
      <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-outline-variant/10">
        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-all duration-300" href="#settings">
          <Settings className="w-5 h-5" />
          <span className="font-label-md text-sm font-semibold">Settings</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-all duration-300" href="#logout">
          <LogOut className="w-5 h-5" />
          <span className="font-label-md text-sm font-semibold">Logout</span>
        </a>
      </div>
    </aside>
  );
}
