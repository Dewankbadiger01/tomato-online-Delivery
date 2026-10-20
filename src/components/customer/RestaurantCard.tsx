import React from 'react';
import { Star, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col focus-within:ring-2 focus-within:ring-rose-500"
    >
      {/* Visual Slot */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Delivery Time tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow">
          <Clock className="w-3.5 h-3.5" />
          <span>{restaurant.deliveryTimeMinutes} mins</span>
        </div>

        {/* Pure Veg or Featured badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {restaurant.isPureVeg && (
            <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Pure Veg</span>
            </div>
          )}
          {restaurant.featured && (
            <div className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              Top Rated
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{restaurant.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({restaurant.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {restaurant.tagline}
          </p>

          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span>{restaurant.locality}, {restaurant.city}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-slate-400 font-mono text-[10px]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>FSSAI: {restaurant.fssaiLicense}</span>
            </span>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <span>{restaurant.cuisines.slice(0, 2).join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {restaurant.approxCostForTwo ? `₹${restaurant.approxCostForTwo} for two` : `₹${restaurant.deliveryFee} Fee`}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 font-semibold text-[#E23744] group-hover:translate-x-0.5 transition-transform shrink-0">
            {restaurant.hasOutdoorSeating ? 'Book / View' : 'Menu'} <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
