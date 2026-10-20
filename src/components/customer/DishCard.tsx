import React from 'react';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';

interface DishCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ item, onAddToCart, onCustomize }) => {
  const hasCustomizations = item.customizationGroups && item.customizationGroups.length > 0;

  const handleAction = () => {
    if (hasCustomizations) {
      onCustomize(item);
    } else {
      onAddToCart(item);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-start justify-between shadow-xs hover:shadow transition-shadow">
      {/* Left Details */}
      <div className="flex-1 space-y-1.5 pr-2">
        {/* Authentic Indian Veg / Non-Veg Mark */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center justify-center w-3.5 h-3.5 border rounded-xs ${
              item.dietary === 'veg' || item.dietary === 'jain' || item.dietary === 'vegan'
                ? 'border-emerald-600'
                : 'border-rose-700'
            }`}
            title={item.dietary.toUpperCase()}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item.dietary === 'veg' || item.dietary === 'jain' || item.dietary === 'vegan'
                  ? 'bg-emerald-600'
                  : 'bg-rose-700'
              }`}
            />
          </span>

          <span className="capitalize text-slate-500 font-medium">{item.category}</span>

          {item.isSpicy && (
            <span className="flex items-center gap-0.5 text-amber-700 font-medium text-[11px]">
              <Flame className="w-3 h-3 text-amber-600" /> Spicy
            </span>
          )}

          {item.isPopular && (
            <span className="flex items-center gap-0.5 text-rose-600 font-medium text-[11px]">
              <Sparkles className="w-3 h-3" /> Bestseller
            </span>
          )}
        </div>

        <h4 className="text-base font-bold text-slate-900 leading-snug">
          {item.name}
        </h4>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
            ₹{item.price}
          </span>
          {item.calories && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{item.calories} kcal</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{item.preparationTimeMinutes} min prep</span>
        </div>
      </div>

      {/* Right Image & Action Button */}
      <div className="relative shrink-0 w-full sm:w-32 flex flex-col items-center">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[1px] flex items-center justify-center text-white text-xs font-bold">
              Sold Out
            </div>
          )}
        </div>

        {item.isAvailable && (
          <button
            onClick={handleAction}
            className="mt-2 w-full py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-500 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{hasCustomizations ? 'Customize' : 'ADD'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
