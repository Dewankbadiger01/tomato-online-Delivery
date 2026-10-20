import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  CheckCircle,
  Loader2,
  MapPin,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { CustomerDetails, PaymentMethod } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartPlatformFee,
    discountAmount,
    appliedPromo,
    placeOrder,
    currentUser,
    userLocation
  } = useFoodDelivery();

  // Address fields matching Indian delivery systems
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    const defaultAddr = currentUser?.savedAddresses[0];
    return {
      name: currentUser?.name || 'Dewank Badiger',
      phone: currentUser?.phone || '+91 98452 31092',
      email: currentUser?.email || 'dewankbadiger628@gmail.com',
      flatNo: defaultAddr?.flatNo || 'Flat 402, Sai Residency',
      building: defaultAddr?.building || '17th Main Road',
      locality: defaultAddr?.locality || userLocation.locality,
      city: defaultAddr?.city || userLocation.city,
      pincode: defaultAddr?.pincode || '560095',
      landmark: defaultAddr?.landmark || 'Opposite Jyoti Nivas College',
      deliveryNotes: 'Leave with security or ring flat 402 bell.'
    };
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'CRED'>('GPay');
  const [upiId, setUpiId] = useState('dewank@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [tip, setTip] = useState<number>(30); // ₹30 delivery partner tip
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const finalDeliveryFee = appliedPromo === 'FREEDELIVERY' ? 0 : cartDeliveryFee;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + finalDeliveryFee + cartPlatformFee + tip);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (paymentMethod === 'UPI') {
        setProcessingStep(`Routing through NPCI UPI Gateway to ${upiApp}...`);
        await new Promise(r => setTimeout(r, 650));
        setProcessingStep(`Awaiting biometric UPI PIN authorization...`);
        await new Promise(r => setTimeout(r, 700));
      } else if (paymentMethod === 'CARD') {
        setProcessingStep('Authorizing RuPay/Visa payment token...');
        await new Promise(r => setTimeout(r, 700));
        setProcessingStep('Verifying 6-digit Bank OTP...');
        await new Promise(r => setTimeout(r, 650));
      } else if (paymentMethod === 'NET_BANKING') {
        setProcessingStep(`Connecting to ${selectedBank} NetBanking gateway...`);
        await new Promise(r => setTimeout(r, 800));
      } else {
        setProcessingStep('Verifying Cash on Delivery booking...');
        await new Promise(r => setTimeout(r, 500));
      }

      setProcessingStep('Payment settled. Kitchen notified!');
      await new Promise(r => setTimeout(r, 400));

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });

      await placeOrder(customer, paymentMethod, tip, {
        upiApp: paymentMethod === 'UPI' ? upiApp : undefined,
        upiId: paymentMethod === 'UPI' ? upiId : undefined,
        cardLast4: paymentMethod === 'CARD' ? '4242' : undefined
      });
    } catch {
      // Error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Secure Indian Payment Checkout</h2>
              <p className="text-[11px] text-slate-500">NPCI Unified Payments Interface & 256-bit SSL</p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Processing Payment</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">{processingStep}</p>
            </div>
            <div className="text-[11px] text-slate-400">Please do not press back or refresh</div>
          </div>
        )}

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Saved Addresses / Custom Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Delivery Address ({userLocation.city})
              </h3>
              {currentUser?.savedAddresses && currentUser.savedAddresses.length > 0 && (
                <div className="flex gap-1.5 text-xs">
                  {currentUser.savedAddresses.map(addr => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => {
                        setCustomer(prev => ({
                          ...prev,
                          flatNo: addr.flatNo,
                          building: addr.building,
                          locality: addr.locality,
                          city: addr.city,
                          pincode: addr.pincode,
                          landmark: addr.landmark || ''
                        }));
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px]"
                    >
                      Use {addr.type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile (+91)</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Flat / House / Floor No.</label>
                <input
                  type="text"
                  required
                  value={customer.flatNo}
                  onChange={e => setCustomer({ ...customer, flatNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Building / Society Name</label>
                <input
                  type="text"
                  required
                  value={customer.building}
                  onChange={e => setCustomer({ ...customer, building: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Area / Locality</label>
                <input
                  type="text"
                  required
                  value={customer.locality}
                  onChange={e => setCustomer({ ...customer, locality: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={e => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={customer.pincode}
                    onChange={e => setCustomer({ ...customer, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Nearby Landmark / Instructions</label>
                <input
                  type="text"
                  value={customer.deliveryNotes || ''}
                  onChange={e => setCustomer({ ...customer, deliveryNotes: e.target.value })}
                  placeholder="e.g. Opposite Metro Pillar 142, ring doorbell, leave with guard"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Indian Delivery Rider Tip */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Delivery Partner Tip
              </h3>
              <span className="text-[11px] text-slate-400">100% credited to courier's account</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0, 20, 30, 50].map(amount => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => setTip(amount)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    tip === amount
                      ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {amount === 0 ? 'No Tip' : `₹${amount}`}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Indian Payment Options */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Payment Options
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5 text-indigo-600 mb-2" />
                <span className="text-xs font-bold">UPI (GPay / PhonePe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-rose-600 mb-2" />
                <span className="text-xs font-bold">Cards (RuPay/Visa)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5 text-slate-800 mb-2" />
                <span className="text-xs font-bold">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 mb-2" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>
            </div>

            {/* UPI Details */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Select Instant UPI App:</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Zero Gateway Charges</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(['GPay', 'PhonePe', 'Paytm', 'CRED'] as const).map(app => (
                    <button
                      type="button"
                      key={app}
                      onClick={() => setUpiApp(app)}
                      className={`py-2 px-1 text-center font-bold text-xs rounded-xl border transition-all ${
                        upiApp === app
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Or Enter UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="mobile@upi or user@okhdfcbank"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Card Details */}
            {paymentMethod === 'CARD' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RuPay / Visa / Mastercard Number</label>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">CVV (3 digits)</label>
                    <input
                      type="password"
                      maxLength={3}
                      defaultValue="883"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'NET_BANKING' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <label className="block text-slate-700 font-semibold">Select Indian Bank</label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Cash on delivery */}
            {paymentMethod === 'COD' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <div className="font-bold">Cash on Delivery (Pay on Arrival)</div>
                <p>
                  Please keep exact cash ready (₹{grandTotal}) for the delivery partner upon arrival at your doorstep.
                </p>
              </div>
            )}
          </div>

          {/* Bill Breakdown in INR */}
          <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Item Total ({cart.length})</span>
              <span className="font-mono tabular-nums text-slate-900">₹{cartSubtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Savings ({appliedPromo})</span>
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
              <span>Govt Taxes & Restaurant Packaging</span>
              <span className="font-mono tabular-nums text-slate-900">₹{cartPlatformFee}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between">
                <span>Rider Tip</span>
                <span className="font-mono tabular-nums text-slate-900">₹{tip}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="font-mono tabular-nums text-rose-600">₹{grandTotal}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg transition-all flex items-center justify-between"
          >
            <span>{paymentMethod === 'COD' ? 'Confirm Order (Pay on Delivery)' : 'Proceed & Pay via UPI / Card'}</span>
            <span className="font-mono tabular-nums">₹{grandTotal}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
