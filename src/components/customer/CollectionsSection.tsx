import React from 'react';
import { ChevronRight, Utensils, Bike, Wine } from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { MainExploreTab } from '../../types';

export const CollectionsSection: React.FC = () => {
  const {
    userLocation,
    collections,
    activeMainTab,
    setActiveMainTab,
    activeCollectionId,
    setActiveCollectionId
  } = useFoodDelivery();

  const handleTabChange = (tab: MainExploreTab) => {
    setActiveMainTab(tab);
    setActiveCollectionId(null);
  };

  return (
    <div className="w-full bg-white pt-5 pb-8 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb matching screenshot: 'Home / Mumbai / Mumbai Restaurant' */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 font-normal">
          <span className="hover:text-slate-900 cursor-pointer">Home</span>
          <span className="text-slate-400">/</span>
          <span className="hover:text-slate-900 cursor-pointer">{userLocation.city}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-medium">{userLocation.city} Restaurant</span>
        </nav>

        {/* Tab switcher matching screenshot: 'Dining Out', 'Delivery', 'Nightlife' */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          <button
            onClick={() => handleTabChange('dining')}
            className={`pb-3 font-semibold text-base transition-colors relative flex items-center gap-2 ${
              activeMainTab === 'dining'
                ? 'text-[#E23744] border-b-2 border-[#E23744]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Dining Out</span>
          </button>

          <button
            onClick={() => handleTabChange('delivery')}
            className={`pb-3 font-semibold text-base transition-colors relative flex items-center gap-2 ${
              activeMainTab === 'delivery'
                ? 'text-[#E23744] border-b-2 border-[#E23744]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery</span>
          </button>

          <button
            onClick={() => handleTabChange('nightlife')}
            className={`pb-3 font-semibold text-base transition-colors relative flex items-center gap-2 ${
              activeMainTab === 'nightlife'
                ? 'text-[#E23744] border-b-2 border-[#E23744]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span>Nightlife</span>
          </button>
        </div>

        {/* Collections Header matching screenshot */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-3xl font-bold text-[#1C1C1C] tracking-tight">
                Collections
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore curated lists of top restaurants, cafes, pubs, and bars in {userLocation.city}, based on trends
              </p>
            </div>

            <button
              onClick={() => setActiveCollectionId(null)}
              className="text-xs sm:text-sm font-semibold text-[#E23744] hover:text-[#c42532] flex items-center gap-0.5 transition-colors whitespace-nowrap"
            >
              <span>All collections in {userLocation.city}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Collections Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
          {collections.map(col => {
            const isSelected = activeCollectionId === col.id;
            return (
              <div
                key={col.id}
                onClick={() => setActiveCollectionId(isSelected ? null : col.id)}
                className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border ${
                  isSelected ? 'ring-3 ring-[#E23744] border-transparent' : 'border-slate-200'
                }`}
              >
                {/* Visual Image */}
                <img
                  src={col.coverImage}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Blue / Navy Scrim Gradient matching screenshot */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726]/90 via-[#0E1726]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Card Content at bottom left */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-xs line-clamp-1">
                    {col.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-200 font-medium">
                    <span>{col.placesCount} Places</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Active Indicator Badge if selected */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#E23744] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    Viewing Places
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
