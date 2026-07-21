"use client";

import { useState } from "react";
import { Quote, Layers, Heart, ScanText } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentQuotes from "@/components/dashboard/RecentQuotes";
import PopularCategories from "@/components/dashboard/PopularCategories";
import AddQuoteFab from "@/components/dashboard/AddQuoteFab";

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
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

  const toggleFavorite = (id) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e4e1ed] font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Desktop Sidebar Navigation */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Top Header Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="lg:ml-[260px] pt-24 pb-32 lg:pb-12 px-gutter min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4">
          
          {/* Greeting Banner */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-display-lg text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
              Selamat pagi, Ahmad! 👋
            </h2>
            <p className="text-on-surface-variant font-body-lg text-lg mt-2">Mari temukan inspirasi baru hari ini.</p>
          </section>

          {/* Key Statistics Grid */}
          <StatsGrid stats={stats} />

          {/* Recent Quotes Section */}
          <RecentQuotes quotes={quotes} onToggleFavorite={toggleFavorite} />

          {/* Popular Categories Section */}
          <PopularCategories categories={categories} />
        </div>
      </main>

      {/* Floating Action Button */}
      <AddQuoteFab />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
