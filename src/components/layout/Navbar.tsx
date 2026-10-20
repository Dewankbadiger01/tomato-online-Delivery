import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, ShoppingBag, User, LogOut, Navigation, ChefHat, Bike, ShieldCheck } from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { INDIAN_CITIES } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    setActiveRestaurant,
    currentUser,
    isAdmin,
    isPartner,
    logoutUser,
    setAuthModalOpen,
    setAuthModalTab,
    userLocation,
    selectCity,
    globalSearchQuery,
    setGlobalSearchQuery,
    activeTrackingOrder
  } = useFoodDelivery();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'customer') {
      setCurrentView('customer');
      setActiveRestaurant(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 h-20">
        {/* Wordmark matching screenshot: 'tomato.' with bold black type and dot */}
        <button
          onClick={() => {
            setCurrentView('customer');
            setActiveRestaurant(null);
          }}
          className="text-3xl font-black tracking-tight text-[#1C1C1C] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-none"
        >
          <span>tomato<span className="text-[#E23744]">.</span></span>
        </button>

        {/* Delivering To Location Selector Box matching screenshot */}
        <div className="relative shrink-0 hidden sm:block">
          <button
            onClick={() => {
              setCityDropdownOpen(!cityDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors text-left shadow-2xs"
          >
            <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                DELIVERING TO
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <span>{userLocation.city}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </button>

          {/* City Selection Dropdown */}
          {cityDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select City
              </div>
              {INDIAN_CITIES.map(city => (
                <button
                  key={city.name}
                  onClick={() => {
                    selectCity(city.name);
                    setCityDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    userLocation.city === city.name ? 'text-rose-600 bg-rose-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] text-slate-400">{city.defaultLocality.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar with FIND FOOD button matching screenshot */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500"
        >
          <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={e => setGlobalSearchQuery(e.target.value)}
            placeholder="Search dishes, restaurants..."
            className="w-full px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="mr-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-[11px] font-bold tracking-wider rounded-xl transition-colors uppercase whitespace-nowrap shrink-0"
          >
            FIND FOOD
          </button>
        </form>

        {/* Top Right Actions: Log in, Sign up matching screenshot */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setCityDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#E23744] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-bold text-slate-800 leading-none">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>

                  {/* Customer view options */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentView('customer');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      <span>Browse Restaurants</span>
                    </button>

                    {activeTrackingOrder && (
                      <button
                        onClick={() => {
                          setCurrentView('tracking');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Track Active Order</span>
                      </button>
                    )}
                  </div>

                  {/* Admin & Partner Specific Options (Visible ONLY when logged in with admin/partner role) */}
                  {(isAdmin || isPartner) && (
                    <div className="py-1 border-t border-slate-100 bg-slate-50/50">
                      <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Admin Workspace
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('restaurant_admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-slate-800 hover:bg-slate-100 font-bold flex items-center gap-2"
                      >
                        <ChefHat className="w-4 h-4 text-rose-600" />
                        <span>Menu & Kitchen Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('rider_console');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-slate-800 hover:bg-slate-100 font-medium flex items-center gap-2"
                      >
                        <Bike className="w-4 h-4 text-sky-600" />
                        <span>Rider Fleet Console</span>
                      </button>
                    </div>
                  )}

                  {/* Sign out */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Log in text link */}
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="text-slate-700 hover:text-rose-600 font-semibold text-sm px-2 py-1 transition-colors whitespace-nowrap"
              >
                Log in
              </button>

              {/* Sign up solid red/coral button */}
              <button
                onClick={() => {
                  setAuthModalTab('signup');
                  setAuthModalOpen(true);
                }}
                className="bg-[#E23744] hover:bg-[#d02c38] active:scale-[0.98] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-xs transition-all whitespace-nowrap"
              >
                Sign up
              </button>
            </>
          )}

          {/* Cart Bag Button */}
          {cartCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl transition-all shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono tabular-nums">{cartCount} · ₹{cartSubtotal}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
