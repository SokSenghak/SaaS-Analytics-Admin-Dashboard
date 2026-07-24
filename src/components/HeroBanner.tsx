import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onOptimizeMetrics?: () => void;
  setActiveTab?: (tab: string) => void;
}

export default function HeroBanner({ onOptimizeMetrics, setActiveTab }: HeroBannerProps) {
  return (
    <section id="hero-banner-section" className="px-8 py-4 select-none">
      <div 
        id="hero-banner-wrapper"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#EAE3F5] via-[#F7F2FB] to-[#EAE3F5] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_10px_35px_-10px_rgba(157,78,221,0.15)]"
      >
        {/* Soft background glow accents to complement the light pastel palette */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-gradient-to-bl from-electric-purple/10 via-neon-magenta/5 to-transparent blur-[60px] pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-64 h-64 rounded-full bg-white/40 blur-[50px] pointer-events-none" />

        {/* Text and Primary Controls Column */}
        <div className="flex-1 max-w-xl relative z-10 text-left">
          {/* Eyebrow Label */}
          <span className="text-[11px] font-bold tracking-wider text-[#9D4EDD] uppercase block mb-1">
            New Collection
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#13092C] font-sans leading-tight">
            Elevate Your <br />
            <span className="text-[#13092C] italic">Everyday</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-[#675B8B] mt-2.5 leading-relaxed font-semibold">
            Modern essentials. Thoughtfully designed.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              id="view-collection-btn"
              onClick={() => setActiveTab && setActiveTab('products')}
              className="bg-[#13092C] text-white hover:bg-[#1C0E3D] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(19,9,44,0.2)] flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button 
              id="manage-products-btn"
              onClick={() => setActiveTab && setActiveTab('products')}
              className="text-[#13092C] hover:text-[#9D4EDD] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Products</span>
            </button>
          </div>
        </div>

        {/* Home Decor Image with floating "12 New Products Added" badge */}
        <div id="banner-image-container" className="relative w-72 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/25">
          <img 
            src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=500&q=80" 
            alt="Modern Minimalist Armchair Room Decor" 
            className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          
          {/* Floating Badge exactly matching "12 New Products Added" */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <span className="w-2 h-2 rounded-full bg-electric-purple animate-pulse" />
            <span className="text-[10px] font-extrabold text-[#13092C] whitespace-nowrap">12 New Products Added</span>
          </div>
        </div>

      </div>
    </section>
  );
}
