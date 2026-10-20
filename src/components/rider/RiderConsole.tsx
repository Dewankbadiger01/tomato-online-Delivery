import React from 'react';
import { Bike, CheckCircle, Navigation, IndianRupee } from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { sound } from '../../utils/audio';

export const RiderConsole: React.FC = () => {
  const {
    activeTrackingOrder,
    orders,
    advanceRiderStep,
    updateOrderStatus,
    setCurrentView
  } = useFoodDelivery();

  const order = activeTrackingOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">
        No orders currently assigned to the courier delivery fleet.
      </div>
    );
  }

  const handlePickup = () => {
    updateOrderStatus(order.id, 'OUT_FOR_DELIVERY');
  };

  const handleDelivered = () => {
    updateOrderStatus(order.id, 'DELIVERED');
    sound.playStatusUpdateChime();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Fleet Workspace Switcher (Internal to Fleet / Admin) */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-400 flex items-center gap-1.5">
            <Bike className="w-4 h-4" />
            <span>Fleet Workspace:</span>
          </span>
          <div className="flex items-center p-0.5 bg-slate-800 rounded-lg">
            <button
              onClick={() => setCurrentView('customer')}
              className="px-3 py-1 rounded-md font-medium text-slate-300 hover:text-white transition-colors"
            >
              Customer Storefront
            </button>
            <button
              onClick={() => setCurrentView('restaurant_admin')}
              className="px-3 py-1 rounded-md font-medium text-slate-300 hover:text-white transition-colors"
            >
              Kitchen & Menu Console
            </button>
            <button
              className="px-3 py-1 rounded-md font-bold bg-sky-600 text-white shadow-xs"
            >
              Rider Fleet Console
            </button>
          </div>
        </div>
      </div>

      {/* Rider Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-sky-400 font-bold uppercase tracking-wider">
              Courier Delivery Partner App Simulator
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Partner: {order.driver?.name || 'Ramesh Kumar'}
            </h2>
            <p className="text-xs text-slate-400">
              Vehicle: {order.driver?.vehicle || 'Ather 450X'} ({order.driver?.vehicleNumber || 'KA-01-EQ-4281'}) · Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-700">
          <IndianRupee className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <span className="text-slate-400">Trip Payout:</span>{' '}
            <strong className="text-emerald-400 font-mono text-sm">
              ₹{order.deliveryFee + order.tip}
            </strong>
          </div>
        </div>
      </div>

      {/* Active Trip Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-slate-400">Live Ticket</span>
            <h3 className="text-lg font-bold text-slate-900 font-mono">
              {order.orderNumber}
            </h3>
          </div>
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Step 1: Restaurant Pickup</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{order.restaurant.name}</h4>
            <p className="text-xs text-slate-600">{order.restaurant.address}</p>
            <div className="text-[11px] text-slate-500 pt-1">
              Food: {order.items.length} dishes in thermal handi
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Step 2: Customer Delivery</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{order.customer.name}</h4>
            <p className="text-xs text-slate-600">
              {order.customer.flatNo}, {order.customer.building}, {order.customer.locality}, {order.customer.city}
            </p>
            {order.customer.deliveryNotes && (
              <p className="text-[11px] text-rose-600 italic">
                Note: "{order.customer.deliveryNotes}"
              </p>
            )}
          </div>
        </div>

        {/* Action Controls for Courier Simulation */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {order.status === 'READY_FOR_PICKUP' && (
              <button
                onClick={handlePickup}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>Confirm Food Pickup & Start Transit</span>
              </button>
            )}

            {order.status === 'OUT_FOR_DELIVERY' && (
              <>
                <button
                  onClick={() => advanceRiderStep(order.id)}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Advance Scooter GPS (+15%)</span>
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'ARRIVED')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  Mark Arrived at Gate
                </button>
              </>
            )}

            {(order.status === 'ARRIVED' || order.status === 'OUT_FOR_DELIVERY') && (
              <button
                onClick={handleDelivered}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Doorstep Handover</span>
              </button>
            )}

            {order.status === 'DELIVERED' && (
              <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Trip delivered. Payout added to your driver bank account.</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentView('tracking')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            Switch to Customer GPS Screen
          </button>
        </div>
      </div>
    </div>
  );
};
