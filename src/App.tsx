import React from 'react';
import { FoodDeliveryProvider, useFoodDelivery } from './context/FoodDeliveryContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomerView } from './components/customer/CustomerView';
import { LiveOrderTracker } from './components/tracking/LiveOrderTracker';
import { RestaurantAdmin } from './components/admin/RestaurantAdmin';
import { RiderConsole } from './components/rider/RiderConsole';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { DishCustomizationModal } from './components/customer/DishCustomizationModal';
import { AuthModal } from './components/auth/AuthModal';
import { LiveLocationInfoModal } from './components/location/LiveLocationInfoModal';
import { Navigation, ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedDishForCustomization,
    setSelectedDishForCustomization,
    activeTrackingOrder
  } = useFoodDelivery();

  const isOrderActive =
    activeTrackingOrder &&
    activeTrackingOrder.status !== 'DELIVERED' &&
    activeTrackingOrder.status !== 'CANCELLED';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      {/* 3-Zone Navbar */}
      <Navbar />


      {/* Real-time Active Order Banner for Customers when an order is in transit */}
      {isOrderActive && currentView === 'customer' && (
        <aside aria-label="Active order status" className="bg-[#1C1C1C] text-white px-4 py-2.5 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold">Active Delivery:</span>
              <span className="text-slate-300">
                Order <strong className="text-white font-mono">{activeTrackingOrder.orderNumber}</strong> from {activeTrackingOrder.restaurant.name} is{' '}
                <strong className="text-rose-400 uppercase tracking-wide">
                  {activeTrackingOrder.status.replace(/_/g, ' ')}
                </strong>
              </span>
            </div>

            <button
              onClick={() => setCurrentView('tracking')}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#E23744] hover:bg-[#d02c38] text-white rounded-lg font-bold text-xs transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Track Live Route</span>
            </button>
          </div>
        </aside>
      )}

      {/* Back to Home Button when customer is on tracking screen */}
      {currentView === 'tracking' && (
        <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentView('customer')}
              className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-[#E23744] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Food Ordering</span>
            </button>
            <span className="text-slate-400 font-medium">Real-Time Satellite GPS Stream</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'customer' && <CustomerView />}
        {currentView === 'tracking' && <LiveOrderTracker />}
        {currentView === 'restaurant_admin' && <RestaurantAdmin />}
        {currentView === 'rider_console' && <RiderConsole />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Secure Indian Payment Checkout Modal */}
      <CheckoutModal />

      {/* User Login & Admin Authentication Modal */}
      <AuthModal />

      {/* Live Location Tracking Architecture Modal */}
      <LiveLocationInfoModal />

      {/* Dish Customization Modal */}
      {selectedDishForCustomization && (
        <DishCustomizationModal
          item={selectedDishForCustomization}
          onClose={() => setSelectedDishForCustomization(null)}
        />
      )}

      {/* Refined Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <FoodDeliveryProvider>
      <AppContent />
    </FoodDeliveryProvider>
  );
}
