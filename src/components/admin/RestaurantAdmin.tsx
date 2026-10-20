import React, { useState, useMemo } from 'react';
import {
  ChefHat,
  Plus,
  IndianRupee,
  ShoppingBag,
  Clock,
  TrendingUp,
  Search,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit2,
  Save,
  X,
  Volume2,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { OrderStatus, DietaryTag, MenuItem } from '../../types';
import { sound } from '../../utils/audio';

export const RestaurantAdmin: React.FC = () => {
  const {
    restaurants,
    menuItems,
    selectedAdminRestaurantId,
    setSelectedAdminRestaurantId,
    orders,
    updateOrderStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    isAdmin,
    isPartner,
    setAuthModalOpen,
    setAuthModalTab,
    setCurrentView,
    currentUser
  } = useFoodDelivery();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [menuSearch, setMenuSearch] = useState('');
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);

  // New dish form state
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Dum Biryani',
    dietary: 'veg' as DietaryTag,
    isSpicy: false,
    preparationTimeMinutes: '15',
    calories: '650'
  });

  // Editing existing dish price
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>('');

  const currentRestaurant = useMemo(() => {
    return restaurants.find(r => r.id === selectedAdminRestaurantId) || restaurants[0];
  }, [restaurants, selectedAdminRestaurantId]);

  const restaurantOrders = useMemo(() => {
    return orders.filter(o => o.restaurant.id === currentRestaurant.id);
  }, [orders, currentRestaurant.id]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'ALL') return restaurantOrders;
    return restaurantOrders.filter(o => o.status === orderStatusFilter);
  }, [restaurantOrders, orderStatusFilter]);

  const restaurantMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (item.restaurantId !== currentRestaurant.id) return false;
      if (menuSearch.trim()) {
        const query = menuSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [menuItems, currentRestaurant.id, menuSearch]);

  const totalRevenue = useMemo(() => {
    return restaurantOrders.reduce((sum, ord) => sum + ord.subtotal, 0);
  }, [restaurantOrders]);

  const activeOrdersCount = useMemo(() => {
    return restaurantOrders.filter(
      o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
    ).length;
  }, [restaurantOrders]);

  const completedOrdersCount = useMemo(() => {
    return restaurantOrders.filter(o => o.status === 'DELIVERED').length;
  }, [restaurantOrders]);

  if (!isAdmin && !isPartner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Portal Authentication Required</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You need Partner Chef or Platform Admin credentials to manage restaurant menus and live kitchen tickets.
        </p>
        <button
          onClick={() => {
            setAuthModalTab('admin');
            setAuthModalOpen(true);
          }}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Sign In to Admin Portal
        </button>
      </div>
    );
  }

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim() || !newDish.price) return;

    const dishData: Omit<MenuItem, 'id'> = {
      restaurantId: currentRestaurant.id,
      name: newDish.name,
      description: newDish.description || 'Prepared fresh with premium ingredients & desi spices.',
      price: parseInt(newDish.price) || 249,
      category: newDish.category || 'Specialties',
      image: currentRestaurant.coverImage,
      dietary: newDish.dietary,
      isSpicy: newDish.isSpicy,
      isAvailable: true,
      preparationTimeMinutes: parseInt(newDish.preparationTimeMinutes) || 15,
      calories: parseInt(newDish.calories) || 550
    };

    addMenuItem(dishData);
    setIsAddDishOpen(false);
    setNewDish({
      name: '',
      description: '',
      price: '',
      category: 'Dum Biryani',
      dietary: 'veg',
      isSpicy: false,
      preparationTimeMinutes: '15',
      calories: '650'
    });
  };

  const handleSavePrice = (itemId: string) => {
    const p = parseInt(editPriceValue);
    if (!isNaN(p) && p > 0) {
      updateMenuItem(itemId, { price: p });
    }
    setEditingItemId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Workspace Header (Strictly inside Admin Profile) */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-rose-400 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4" />
            <span>Admin Workspace:</span>
          </span>
          <div className="flex items-center p-0.5 bg-slate-800 rounded-lg">
            <button
              onClick={() => setCurrentView('customer')}
              className="px-3 py-1 rounded-md font-medium text-slate-300 hover:text-white transition-colors"
            >
              Customer Storefront
            </button>
            <button
              className="px-3 py-1 rounded-md font-bold bg-rose-600 text-white shadow-xs"
            >
              Kitchen & Menu Console
            </button>
            <button
              onClick={() => setCurrentView('rider_console')}
              className="px-3 py-1 rounded-md font-medium text-slate-300 hover:text-white transition-colors"
            >
              Rider Fleet Console
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Profile: <strong className="text-white">{currentUser?.name || 'Administrator'}</strong> ({isAdmin ? 'Super Admin' : 'Restaurant Partner'})
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <ChefHat className="w-4 h-4" />
            <span>Restaurant Kitchen Display & Partner Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentRestaurant.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>{currentRestaurant.address}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FSSAI: {currentRestaurant.fssaiLicense}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => sound.playOrderPlacedChime()}
            title="Test kitchen chime speaker"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Kitchen Chime</span>
          </button>

          <div className="bg-slate-800/90 p-1 rounded-2xl border border-slate-700 flex items-center">
            <span className="text-xs text-slate-400 px-3 font-medium">Select Outlet:</span>
            <select
              value={selectedAdminRestaurantId}
              onChange={e => setSelectedAdminRestaurantId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.locality})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            ₹{totalRevenue}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            +24.6% vs yesterday
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Kitchen Tickets</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Awaiting pickup or prep
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Dispatched Orders</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            {completedOrdersCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Handed over to delivery couriers
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Handover Time</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
            11.4 min
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Fastest in {currentRestaurant.locality}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-bold text-sm rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Live Kitchen Queue ({restaurantOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 font-bold text-sm rounded-xl transition-all ${
            activeTab === 'menu'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Menu Management ({restaurantMenuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-bold text-sm rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Sales & Analytics
        </button>
      </div>

      {/* TAB 1: Kitchen Orders Queue */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(
              [
                'ALL',
                'PLACED',
                'CONFIRMED',
                'PREPARING',
                'READY_FOR_PICKUP',
                'OUT_FOR_DELIVERY',
                'DELIVERED'
              ] as const
            ).map(st => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  orderStatusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {st === 'ALL' ? 'All Tickets' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No tickets in this status</h3>
              <p className="text-xs text-slate-500">
                New incoming orders will chime and display in this queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map(ord => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900 font-mono">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${
                            ord.status === 'PREPARING'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'READY_FOR_PICKUP'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'OUT_FOR_DELIVERY'
                              ? 'bg-sky-100 text-sky-800'
                              : ord.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Customer: <strong className="text-slate-800">{ord.customer.name}</strong> · {ord.placedAt}
                      </p>
                    </div>

                    <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                      ₹{ord.total}
                    </span>
                  </div>

                  {/* Items Ticket */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs">
                    {ord.items.map(it => (
                      <div key={it.cartItemId} className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900">
                            {it.quantity}x {it.menuItem.name}
                          </span>
                          {Object.keys(it.selectedOptions).length > 0 && (
                            <p className="text-[11px] text-slate-500">
                              {Object.values(it.selectedOptions).join(', ')}
                            </p>
                          )}
                          {it.specialInstructions && (
                            <p className="text-[10px] text-rose-600 italic">
                              Special request: "{it.specialInstructions}"
                            </p>
                          )}
                        </div>
                        <span className="font-mono tabular-nums text-slate-600 font-semibold">
                          ₹{it.itemTotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dispatch Actions */}
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    {ord.status === 'PLACED' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'CONFIRMED')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                      >
                        Accept Ticket
                      </button>
                    )}

                    {ord.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors"
                      >
                        Start Cooking (Kitchen Station)
                      </button>
                    )}

                    {ord.status === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                      >
                        Pack in Thermal Bag & Mark Ready
                      </button>
                    )}

                    {ord.status === 'READY_FOR_PICKUP' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'OUT_FOR_DELIVERY')}
                        className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
                      >
                        Handover to Rider (Out for Delivery)
                      </button>
                    )}

                    {ord.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'DELIVERED')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
                      >
                        Confirm Handover at Doorstep
                      </button>
                    )}

                    {ord.status === 'DELIVERED' && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Fulfilled & Payment Credited
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Menu Management */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder="Search Biryani, Tandoor, Curries..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <button
              onClick={() => setIsAddDishOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Dish Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Dietary</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {restaurantMenuItems.map(dish => (
                    <tr key={dish.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{dish.name}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {dish.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{dish.category}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`capitalize font-semibold ${
                            dish.dietary === 'veg' || dish.dietary === 'jain' || dish.dietary === 'vegan'
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {dish.dietary}
                        </span>
                      </td>

                      {/* Price inline editing */}
                      <td className="py-3.5 px-4">
                        {editingItemId === dish.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-mono">₹</span>
                            <input
                              type="number"
                              value={editPriceValue}
                              onChange={e => setEditPriceValue(e.target.value)}
                              className="w-16 px-1.5 py-0.5 border border-rose-400 rounded text-xs font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(dish.id)}
                              className="p-1 text-emerald-600 hover:text-emerald-700"
                              title="Save Price"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingItemId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold font-mono text-slate-900 tabular-nums">
                              ₹{dish.price}
                            </span>
                            <button
                              onClick={() => {
                                setEditingItemId(dish.id);
                                setEditPriceValue(dish.price.toString());
                              }}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title="Edit price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Stock toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleItemAvailability(dish.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            dish.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border border-rose-300'
                          }`}
                        >
                          {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteMenuItem(dish.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Sales Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Today's Hourly Order Rush</h3>
              <p className="text-xs text-slate-500">Dinner rush peak between 8:00 PM – 10:30 PM</p>
              
              <div className="pt-4 flex items-end gap-3 h-48 border-b border-slate-200 pb-2">
                {[
                  { hour: '12pm', val: 40 },
                  { hour: '1pm', val: 75 },
                  { hour: '2pm', val: 90 },
                  { hour: '3pm', val: 35 },
                  { hour: '4pm', val: 20 },
                  { hour: '5pm', val: 30 },
                  { hour: '6pm', val: 45 },
                  { hour: '7pm', val: 65 },
                  { hour: '8pm', val: 95 },
                  { hour: '9pm', val: 100 },
                  { hour: '10pm', val: 80 }
                ].map(bar => (
                  <div key={bar.hour} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      style={{ height: `${bar.val}%` }}
                      className="w-full bg-rose-500 hover:bg-rose-600 rounded-t transition-all"
                      title={`${bar.hour}: ${bar.val}% capacity`}
                    />
                    <span className="text-[10px] text-slate-400 font-mono">{bar.hour}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Bestselling Dishes in {currentRestaurant.locality}</h3>
              <div className="space-y-3">
                {restaurantMenuItems.slice(0, 4).map((dish, idx) => (
                  <div key={dish.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{dish.name}</span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-700 font-semibold">
                      ₹{dish.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Dish to {currentRestaurant.name}</h3>
              <button
                onClick={() => setIsAddDishOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newDish.name}
                  onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="e.g. Mutton Rogan Josh Special"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDish.description}
                  onChange={e => setNewDish({ ...newDish, description: e.target.value })}
                  placeholder="Ingredients, spice level, serving size..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newDish.price}
                    onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                    placeholder="349"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newDish.category}
                    onChange={e => setNewDish({ ...newDish, category: e.target.value })}
                    placeholder="Biryani / Tandoor / Curries"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dietary Tag</label>
                  <select
                    value={newDish.dietary}
                    onChange={e => setNewDish({ ...newDish, dietary: e.target.value as DietaryTag })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="jain">Jain (No Onion / Garlic)</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preparation Time (mins)</label>
                  <input
                    type="number"
                    value={newDish.preparationTimeMinutes}
                    onChange={e => setNewDish({ ...newDish, preparationTimeMinutes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDishOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-2xs"
                >
                  Publish to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
