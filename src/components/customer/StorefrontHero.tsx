import React from 'react';
import { Search, Clock, ShieldCheck, Sparkles, MapPin, Crosshair, ChevronDown } from 'lucide-react';
import { HERO_IMAGE, INDIAN_CITIES } from '../../data/mockData';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';

interface StorefrontHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCuisine: string;
  onCuisineSelect: (c: string) => void;
  pureVegOnly: boolean;
  onPureVegToggle: () => void;
}

const CUISINES = [
  'All',
  'Biryani',
  'South Indian',
  'North Indian',
  'Dosa',
  'Curries',
  'Burgers',
  'Pizza',
  'Dessert'
];

export const StorefrontHero: React.FC<StorefrontHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCuisine,
  onCuisineSelect,
  pureVegOnly,
  onPureVegToggle
}) => {
  const {
    userLocation,
    selectCity,
    detectLocation,
    isDetectingLocation,
    setLiveLocationInfoModalOpen
  } = useFoodDelivery();

  return (
    <div className="relative bg-gradient-to-b from-rose-50/70 via-white to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Location selector banner */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span className="text-slate-500 font-medium">Delivering to:</span>
                <select
                  value={userLocation.city}
                  onChange={e => selectCity(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {INDIAN_CITIES.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.defaultLocality})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={detectLocation}
                disabled={isDetectingLocation}
                title="Detect exact browser GPS coordinates"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-100/70 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl transition-colors"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span>{isDetectingLocation ? 'Locating...' : 'Detect GPS'}</span>
              </button>

              <button
                onClick={() => setLiveLocationInfoModalOpen(true)}
                className="text-[11px] text-slate-500 hover:text-rose-600 underline"
              >
                (How live GPS works?)
              </button>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-700 tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>India's Taste, Delivered at Speed</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Craving Biryani, Dosas or Burgers? We got you.
            </h1>

            <p className="text-base text-slate-600 max-w-xl leading-relaxed">
              Order legendary dishes from iconic local food partners with live turn-by-turn rider tracking and instant UPI payments.
            </p>

            {/* Functional Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search Biryani, Butter Chicken, Masala Dosa, Burgers..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Cuisines Filter + Pure Veg toggle */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Popular Categories
                </div>

                {/* Pure Veg Switcher (Iconic Indian Feature) */}
                <button
                  onClick={onPureVegToggle}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    pureVegOnly
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>Pure Veg Mode</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {CUISINES.map(c => (
                  <button
                    key={c}
                    onClick={() => onCuisineSelect(c)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedCuisine === c
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Key trust markers */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-medium text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Average 24 mins in {userLocation.city}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FSSAI Certified Kitchens</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Res Food Asset */}
          <div className="lg:col-span-5">
            <div className="relative group overflow-hidden rounded-3xl shadow-xl border border-slate-200/80 bg-slate-950 aspect-[4/3] lg:aspect-auto lg:h-[400px]">
              <img
                src={HERO_IMAGE}
                alt="Culinary feast spread"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                  {userLocation.locality} Special
                </div>
                <div className="text-lg font-bold">Hyderabadi Dum & Tandoor Feasts</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Made with pure desi ghee, saffron & secret royal spice blends
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
