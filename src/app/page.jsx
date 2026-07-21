"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Quote,
  Layers,
  ScanText,
  Settings,
  LogOut,
  Search,
  Bell,
  Heart,
  Share2,
  Plus,
  Home as HomeIcon,
  User
} from "lucide-react";

// Count-up animation helper component
function CountUp({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasRun) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
              setHasRun(true);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration, hasRun]);

  return <span ref={elementRef}>{count}</span>;
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [searchFocused, setSearchFocused] = useState(false);
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      text: "Hidup adalah perjalanan yang harus dinikmati.",
      author: "Unknown",
      category: "Life",
      isFavorite: false,
      delay: "0.7s"
    },
    {
      id: 2,
      text: "Kesuksesan dimulai dari langkah kecil.",
      author: "Business",
      category: "Motivation",
      isFavorite: true,
      delay: "0.8s"
    }
  ]);

  const stats = [
    { label: "Total Quotes", value: 156, icon: Quote, colorClass: "bg-primary/10 text-primary", delay: "0.2s" },
    { label: "Kategori", value: 8, icon: Layers, colorClass: "bg-tertiary/10 text-tertiary", delay: "0.3s" },
    { label: "Favorit", value: 23, icon: Heart, colorClass: "bg-error/10 text-error", delay: "0.4s", isFilledHeart: true },
    { label: "Scanned", value: 12, icon: ScanText, colorClass: "bg-secondary/10 text-secondary", delay: "0.5s" }
  ];

  const categories = [
    { name: "Motivasi", count: 45, color: "bg-primary", shadow: "shadow-[0_0_8px_#c0c1ff]", borderHover: "hover:border-primary/40", textHover: "group-hover:text-primary" },
    { name: "Islami", count: 32, color: "bg-tertiary", shadow: "shadow-[0_0_8px_#ffb783]", borderHover: "hover:border-tertiary/40", textHover: "group-hover:text-tertiary" },
    { name: "Cinta", count: 28, color: "bg-secondary", shadow: "shadow-[0_0_8px_#d0bcff]", borderHover: "hover:border-secondary/40", textHover: "group-hover:text-secondary" }
  ];

  const sidebarNav = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Quotes", icon: Quote },
    { name: "Categories", icon: Layers },
    { name: "Scan Quote", icon: ScanText }
  ];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const toggleFavorite = (id) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e4e1ed] font-sans overflow-x-hidden selection:bg-primary/30">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] bg-surface/80 backdrop-blur-xl border-r border-outline-variant/20 z-50 p-6">
        <div className="mb-10">
          <h1 className="font-display-lg text-4xl font-extrabold text-primary tracking-tight">KataKata</h1>
          <p className="text-on-surface-variant font-label-md text-sm mt-1">Curation Hub</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          {sidebarNav.map((item) => {
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
        
        <button className="mt-4 bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-md text-sm font-bold py-3 px-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer">
          Add New Quote
        </button>
        
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

      {/* Top Navigation */}
      <header className="fixed top-0 right-0 z-40 flex justify-between items-center h-16 px-gutter lg:left-[260px] left-0 bg-background/60 backdrop-blur-md border-b border-outline-variant/10">
        <h2 className="font-headline-md text-2xl font-bold text-primary lg:hidden ml-4">KataKata</h2>
        
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className={`w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-on-surface transition-all duration-300 font-label-md text-sm outline-none ${
              searchFocused ? "ring-2 ring-primary/50 shadow-[0_0_12px_rgba(99,102,241,0.3)]" : ""
            }`}
            placeholder="Search quotes..."
            type="text"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        
        <div className="flex items-center gap-4 mr-4">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20">
            <img
              className="w-full h-full object-cover"
              alt="A professional avatar portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANfKQwI9-YwZgRpbiWESzYx62wd-fcBXyg3_qOZBsADTH21xx59P4asLLviQfUAZrbB_b2bVDULBdcKrEhGLR_gOSs6WKNlmSQeOhIbtgg9QFn7on0rn6gfqo20cgCxCUY8QODYwFGnoQZGTvjTVmW5z1rTQ7g2XCEn2NPgDSa2Z23YM0RDpQkPJgVXvTBhxN3BeK4vY3kVV7MzvSUxWQR7aBHKq2yJEKI2c9veyArj-mT2wZ0pv-Ch_hflBP2jo41L6Pxvj_o-HA"
            />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="lg:ml-[260px] pt-24 pb-32 lg:pb-12 px-gutter min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4">
          
          {/* Greeting */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-display-lg text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
              Selamat pagi, Ahmad! 👋
            </h2>
            <p className="text-on-surface-variant font-body-lg text-lg mt-2">Mari temukan inspirasi baru hari ini.</p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  onMouseMove={handleMouseMove}
                  className="glass-surface p-6 rounded-2xl glass-card-hover animate-fade-in cursor-default"
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${stat.colorClass}`}>
                      <Icon className="w-5 h-5" fill={stat.isFilledHeart ? "currentColor" : "none"} />
                    </div>
                    <span className="text-on-surface-variant font-label-md text-sm font-semibold">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-extrabold text-on-surface">
                    <CountUp end={stat.value} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Content: Quotes Terbaru */}
          <section className="mb-12">
            <div className="flex justify-between items-end mb-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface">Quotes Terbaru</h3>
                <p className="text-on-surface-variant font-label-md text-sm">Koleksi kurasi terakhir Anda.</p>
              </div>
              <a className="text-primary font-label-md text-sm hover:underline" href="#all-quotes">Lihat Semua</a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  onMouseMove={handleMouseMove}
                  className="glass-surface p-8 rounded-3xl glass-card-hover animate-fade-in relative overflow-hidden group"
                  style={{ animationDelay: quote.delay }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                  <Quote className="w-16 h-16 text-primary/20 absolute top-4 left-4 pointer-events-none stroke-1" />
                  
                  <div className="relative z-10">
                    <p className="font-headline-sm text-lg md:text-xl italic mb-6 leading-relaxed">"{quote.text}"</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-label-md text-sm text-primary">— {quote.author}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full tracking-wider">
                            {quote.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(quote.id)}
                          className={`p-2 rounded-full hover:bg-surface-variant/50 transition-all cursor-pointer ${
                            quote.isFavorite ? "text-error" : "text-on-surface-variant hover:text-error"
                          }`}
                        >
                          <Heart className="w-5 h-5" fill={quote.isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-surface-variant/50 text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Section: Kategori Populer */}
          <section className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-6">Kategori Populer</h3>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`glass-surface px-6 py-3 rounded-full flex items-center gap-3 border border-outline-variant/30 ${cat.borderHover} transition-all cursor-pointer group`}
                >
                  <span className={`w-2 h-2 rounded-full ${cat.color} ${cat.shadow}`}></span>
                  <span className={`font-label-md text-sm text-on-surface ${cat.textHover} transition-colors`}>{cat.name}</span>
                  <span className="text-on-surface-variant font-label-sm text-xs bg-surface-variant px-2 py-0.5 rounded-full">{cat.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-8 lg:bottom-12 lg:right-12 z-50 flex items-center gap-2 bg-gradient-to-br from-primary to-secondary text-on-primary font-bold px-6 py-4 rounded-2xl shadow-[0_8px_25px_rgba(192,193,255,0.4)] hover:scale-110 active:scale-95 transition-all group cursor-pointer">
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-label-md text-sm">Tambah Quote</span>
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant/20 rounded-t-xl lg:hidden">
        <a className="flex flex-col items-center justify-center text-primary scale-110 transition-transform" href="#home">
          <HomeIcon className="w-5 h-5" />
          <span className="font-label-sm text-xs mt-0.5">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors" href="#quotes">
          <Quote className="w-5 h-5" />
          <span className="font-label-sm text-xs mt-0.5">Quotes</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors" href="#scan">
          <ScanText className="w-5 h-5" />
          <span className="font-label-sm text-xs mt-0.5">Scan</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors" href="#profile">
          <User className="w-5 h-5" />
          <span className="font-label-sm text-xs mt-0.5">Profile</span>
        </a>
      </nav>
    </div>
  );
}
