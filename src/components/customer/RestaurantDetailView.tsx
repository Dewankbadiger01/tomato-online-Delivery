import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Search, ShieldCheck } from 'lucide-react';
import { Restaurant } from '../../types';
import { DishCard } from './DishCard';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
  restaurant,
  onBack
}) => {
  const {
    menuItems,
    addToCart,
    setSelectedDishForCustomization,
    cartCount,
    cartSubtotal,
    setIsCartOpen
  } = useFoodDelivery();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState<boolean>(false);
  const [dishSearch, setDishSearch] = useState<string>('');

  const restaurantDishes = useMemo(() => {
    return menuItems.filter(item => item.restaurantId === restaurant.id);
  }, [menuItems, restaurant.id]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(restaurantDishes.map(d => d.category)));
    return ['All', ...cats];
  }, [restaurantDishes]);

  const filteredDishes = useMemo(() => {
    return restaurantDishes.filter(item => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (filterVegOnly && item.dietary !== 'veg' && item.dietary !== 'vegan' && item.dietary !== 'jain') return false;
      if (filterSpicyOnly && !item.isSpicy) return false;
      if (dishSearch.trim()) {
        const query = dishSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [restaurantDishes, activeCategory, filterVegOnly, filterSpicyOnly, dishSearch]);

  return (
    <div className="pb-24">
      {/* Restaurant Header Banner */}
      <div className="relative bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-6 px-3 py-1.5 rounded-lg bg-slate-800/80 backdrop-blur-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Restaurants</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {restaurant.name}
                </h1>
                {restaurant.isPureVeg && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Pure Veg
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 max-w-xl">
                {restaurant.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1 font-bold text-white bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums">{restaurant.rating.toFixed(1)}</span>
                  <span className="font-normal">({restaurant.reviewCount} reviews)</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>{restaurant.deliveryTimeMinutes} mins</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Delivery: <strong className="font-mono tabular-nums">₹{restaurant.deliveryFee}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Min Order: <strong className="font-mono tabular-nums">₹{restaurant.minOrder}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>FSSAI Lic: {restaurant.fssaiLicense}</span>
                </div>
              </div>
            </div>

            {/* Restaurant Cover Thumbnail */}
            <div className="md:col-span-4">
              <div className="relative aspect-[16/9] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-700/60">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sticky Filter Controls Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Filters and Search */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterVegOnly(!filterVegOnly)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                  filterVegOnly
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Veg Only</span>
              </button>

              <button
                onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  filterSpicyOnly
                    ? 'bg-amber-50 border-amber-500 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                Spicy
              </button>
            </div>

            <div className="relative w-44 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={dishSearch}
                onChange={e => setDishSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Dish Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 font-medium">No dishes match your selected filters.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setFilterVegOnly(false);
                setFilterSpicyOnly(false);
                setDishSearch('');
              }}
              className="mt-3 px-4 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDishes.map(dish => (
              <DishCard
                key={dish.id}
                item={dish}
                onAddToCart={item => addToCart(item, 1)}
                onCustomize={item => setSelectedDishForCustomization(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Sticky Floating Bag Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
              <span>View Your Bag</span>
            </div>
            <span className="font-mono tabular-nums">₹{cartSubtotal}</span>
          </button>
        </div>
      )}
    </div>
  );
};
