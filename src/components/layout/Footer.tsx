import React from 'react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setActiveRestaurant } = useFoodDelivery();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-xl font-black text-rose-600 tracking-tight">TOMATO</span>
            <p className="text-slate-500 leading-relaxed text-xs">
              Fast, fresh food delivery platform connecting local culinary artisans with hungry customers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Customer Experience
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('customer');
                    setActiveRestaurant(null);
                  }}
                  className="hover:text-rose-600 transition-colors"
                >
                  Browse Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <span className="text-slate-400">Available in 120+ Cities</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Partner With Us
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('restaurant_admin')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Restaurant Partner Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('rider_console')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Courier Dispatch Console
                </button>
              </li>
              <li>
                <span className="text-slate-400">Merchant Growth Tools</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Security & Payment
            </h4>
            <p className="text-slate-500 leading-relaxed text-xs">
              All transactions encrypted via 256-bit SSL. Supported: Visa, Mastercard, Apple Pay, Google Pay, UPI, and Cash on Delivery.
            </p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            © {new Date().getFullYear()} TOMATO Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-600">Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-600">Partner Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
