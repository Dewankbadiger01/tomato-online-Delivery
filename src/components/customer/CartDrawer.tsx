import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartPlatformFee,
    discountAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen
  } = useFoodDelivery();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  const finalDeliveryFee = appliedPromo === 'FREEDELIVERY' ? 0 : cartDeliveryFee;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + finalDeliveryFee + cartPlatformFee);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Bag</h2>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore delicious Biryani, Dosas, Burgers, and Curries from top rated local food kitchens.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-slate-700 tabular-nums mt-0.5">
                        ₹{item.unitPrice}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Customizations */}
                  {Object.keys(item.selectedOptions).length > 0 && (
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      {Object.entries(item.selectedOptions).map(([grp, val]) => (
                        <div key={grp}>
                          <span className="font-medium text-slate-600">{grp}:</span> {val}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <p className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded-lg border border-slate-100">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                      ₹{item.itemTotal}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Module */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/50 space-y-4">
              {/* Promo Code Form */}
              <div className="space-y-1.5">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => {
                        setPromoInput(e.target.value);
                        setPromoMessage(null);
                      }}
                      placeholder="Coupon: TOMATO50 or SWADINDIA"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-medium">Coupon '{appliedPromo}' active</span>
                    <button
                      onClick={removePromoCode}
                      className="text-xs font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoMessage && !appliedPromo && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-mono tabular-nums text-slate-900">₹{cartSubtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="font-mono tabular-nums text-slate-900">
                    {finalDeliveryFee === 0 ? 'FREE' : `₹${finalDeliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee & Govt GST</span>
                  <span className="font-mono tabular-nums text-slate-900">₹{cartPlatformFee}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>To Pay</span>
                  <span className="font-mono tabular-nums text-rose-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-between"
              >
                <span>Select Address & Pay</span>
                <span className="flex items-center gap-1 font-mono">
                  ₹{grandTotal} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
