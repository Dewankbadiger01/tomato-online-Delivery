import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Star, Wine, Check, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { CollectionsSection } from './CollectionsSection';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantDetailView } from './RestaurantDetailView';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { Restaurant } from '../../types';

export const CustomerView: React.FC = () => {
  const {
    restaurants,
    activeRestaurant,
    setActiveRestaurant,
    userLocation,
    activeMainTab,
    activeCollectionId,
    setActiveCollectionId,
    collections,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useFoodDelivery();

  // Filters for Dining Out / Nightlife / Delivery
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [filterOutdoorSeating, setFilterOutdoorSeating] = useState(false);
  const [filterServesAlcohol, setFilterServesAlcohol] = useState(false);
  const [filterPureVeg, setFilterPureVeg] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'costAsc' | 'costDesc'>('rating');

  const selectedCollection = useMemo(() => {
    return collections.find(c => c.id === activeCollectionId) || null;
  }, [collections, activeCollectionId]);

  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter(rest => {
        // Tab specific filter
        if (activeMainTab === 'nightlife' && !rest.servesAlcohol && !rest.collectionIds?.includes('col-bars')) {
          return false;
        }

        // Active collection filter
        if (activeCollectionId && !rest.collectionIds?.includes(activeCollectionId)) {
          return false;
        }

        // Feature toggles
        if (filterRating4Plus && rest.rating < 4.5) return false;
        if (filterOutdoorSeating && !rest.hasOutdoorSeating) return false;
        if (filterServesAlcohol && !rest.servesAlcohol) return false;
        if (filterPureVeg && !rest.isPureVeg) return false;

        // Search
        if (globalSearchQuery.trim()) {
          const q = globalSearchQuery.toLowerCase();
          const matchName = rest.name.toLowerCase().includes(q);
          const matchTag = rest.tagline.toLowerCase().includes(q);
          const matchLocality = rest.locality.toLowerCase().includes(q);
          const matchCuisines = rest.cuisines.some(c => c.toLowerCase().includes(q));
          return matchName || matchTag || matchLocality || matchCuisines;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'costAsc') {
          return (a.approxCostForTwo || 600) - (b.approxCostForTwo || 600);
        }
        if (sortBy === 'costDesc') {
          return (b.approxCostForTwo || 600) - (a.approxCostForTwo || 600);
        }
        return b.rating - a.rating;
      });
  }, [
    restaurants,
    activeMainTab,
    activeCollectionId,
    filterRating4Plus,
    filterOutdoorSeating,
    filterServesAlcohol,
    filterPureVeg,
    globalSearchQuery,
    sortBy
  ]);

  if (activeRestaurant) {
    return (
      <RestaurantDetailView
        restaurant={activeRestaurant}
        onBack={() => setActiveRestaurant(null)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Collections section exactly matching the user's uploaded screenshot */}
      <CollectionsSection />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Active Collection Filter Banner */}
        {selectedCollection && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Active Collection</span>
              <h3 className="text-base font-bold text-slate-900">{selectedCollection.title} in {userLocation.city}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{selectedCollection.description}</p>
            </div>
            <button
              onClick={() => setActiveCollectionId(null)}
              className="px-3 py-1.5 bg-white text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl hover:bg-rose-100/50 transition-colors flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}

        {/* Filter Pills Bar (Zomato / Tomato Style) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Rating 4.5+ */}
            <button
              onClick={() => setFilterRating4Plus(!filterRating4Plus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                filterRating4Plus
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Rating: 4.5+</span>
            </button>

            {/* Pure Veg */}
            <button
              onClick={() => setFilterPureVeg(!filterPureVeg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                filterPureVeg
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Pure Veg</span>
            </button>

            {/* Outdoor Seating */}
            <button
              onClick={() => setFilterOutdoorSeating(!filterOutdoorSeating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterOutdoorSeating
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Outdoor Seating
            </button>

            {/* Serves Alcohol */}
            <button
              onClick={() => setFilterServesAlcohol(!filterServesAlcohol)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                filterServesAlcohol
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>Serves Alcohol</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'rating' | 'costAsc' | 'costDesc')}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
            >
              <option value="rating">Popularity & Rating</option>
              <option value="costAsc">Cost: Low to High</option>
              <option value="costDesc">Cost: High to Low</option>
            </select>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">
            {activeMainTab === 'dining'
              ? `Best Dining Restaurants in ${userLocation.city}`
              : activeMainTab === 'delivery'
              ? `Order Food Online in ${userLocation.locality}, ${userLocation.city}`
              : `Top Nightlife & Pubs in ${userLocation.city}`}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {filteredRestaurants.length} places available
          </span>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-900">No restaurants match your selected filters</h3>
            <p className="text-xs text-slate-500">
              Try resetting your filters or search query to discover more places in {userLocation.city}.
            </p>
            <button
              onClick={() => {
                setFilterRating4Plus(false);
                setFilterOutdoorSeating(false);
                setFilterServesAlcohol(false);
                setFilterPureVeg(false);
                setActiveCollectionId(null);
                setGlobalSearchQuery('');
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(rest => (
              <RestaurantCard
                key={rest.id}
                restaurant={rest}
                onSelect={(r: Restaurant) => setActiveRestaurant(r)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
