import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  Store,
  Home,
  AlertCircle,
  Play,
  Info,
  ShieldCheck,
  Bike,
  ChefHat
} from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { OrderStatus } from '../../types';
import { calculateHaversineDistanceKm } from '../../utils/geolocation';

export const LiveOrderTracker: React.FC = () => {
  const {
    activeTrackingOrder,
    orders,
    setActiveTrackingOrder,
    simulationSpeed,
    setSimulationSpeed,
    advanceRiderStep,
    updateOrderStatus,
    setLiveLocationInfoModalOpen,
    userLocation,
    isAdmin,
    isPartner
  } = useFoodDelivery();

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    { sender: 'driver', text: 'Namaste! Order picked up from Meghana Foods. I will be at your apartment in 12 mins.', time: '16:55' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [phoneCallActive, setPhoneCallActive] = useState(false);

  if (!activeTrackingOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">No active orders to track</h2>
        <p className="text-sm text-slate-500 mt-1">
          Place an order from our restaurant partners to experience live real-time courier tracking.
        </p>
      </div>
    );
  }

  const order = activeTrackingOrder;
  const progress = Math.min(100, Math.max(0, order.routeProgress));

  // Calculate live Haversine distance from rest to destination
  const totalTripDistanceKm = calculateHaversineDistanceKm(
    12.9348,
    77.6212,
    userLocation.lat,
    userLocation.lng
  ) || 3.8;

  const remainingDistanceKm = Math.max(0.1, Math.round((totalTripDistanceKm * (1 - progress / 100)) * 10) / 10);

  // Bezier curve coordinate calculation for interactive vector map
  const getCubicBezierPoint = (t: number) => {
    const p0 = { x: 120, y: 310 };
    const p1 = { x: 310, y: 350 };
    const p2 = { x: 440, y: 140 };
    const p3 = { x: 670, y: 90 };

    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    return { x, y };
  };

  const currentRiderPos = getCubicBezierPoint(progress / 100);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg = { sender: 'user' as const, text: chatInput, time };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'driver',
          text: 'Ji, just crossed Sony World signal! Arriving right away.',
          time: `${now.getHours()}:${String(now.getMinutes() + 1).padStart(2, '0')}`
        }
      ]);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Order Header & Active Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Live Real-Time GPS Tracking Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Order #{order.orderNumber}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Placed {order.placedAt}</span>
            <span aria-hidden="true">·</span>
            <span>From {order.restaurant.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-900 font-bold">₹{order.total}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Paid via {order.payment.upiApp || order.payment.method}
            </span>
          </div>
        </div>

        {/* Real-time Streaming Status Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time GPS Connected</span>
          </div>
          <button
            onClick={() => setLiveLocationInfoModalOpen(true)}
            title="Live GPS & Geolocation Architecture"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>

          {orders.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <select
                value={order.id}
                onChange={e => {
                  const found = orders.find(o => o.id === e.target.value);
                  if (found) setActiveTrackingOrder(found);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-semibold text-slate-800 focus:outline-none"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} ({o.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Delivery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Vector GPS Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-[#1A202C] rounded-3xl overflow-hidden border border-slate-700 shadow-lg aspect-[16/10] sm:aspect-[16/9] w-full">
            {/* SVG Interactive Road Grid with Indian Landmarks */}
            <svg
              className="w-full h-full select-none"
              viewBox="0 0 800 450"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="city-grid-in" width="60" height="60" patternUnits="userSpaceOnUse">
                  <rect width="60" height="60" fill="#18202F" />
                  <rect x="2" y="2" width="56" height="56" rx="4" fill="#1E293B" opacity="0.6" />
                </pattern>
                <linearGradient id="route-gradient-in" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
                <filter id="glow-in" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="800" height="450" fill="url(#city-grid-in)" />

              {/* Water tank / lake (e.g. Agara / Ulsoor Lake) */}
              <path
                d="M 0,220 Q 200,240 400,190 T 800,230"
                fill="none"
                stroke="#0E3A56"
                strokeWidth="24"
                opacity="0.4"
              />

              {/* Major Indian Urban Arterials */}
              <line x1="0" y1="140" x2="800" y2="140" stroke="#334155" strokeWidth="8" />
              <line x1="0" y1="290" x2="800" y2="290" stroke="#334155" strokeWidth="8" />
              <line x1="220" y1="0" x2="220" y2="450" stroke="#334155" strokeWidth="8" />
              <line x1="520" y1="0" x2="520" y2="450" stroke="#334155" strokeWidth="8" />

              {/* Landmark text labels */}
              <text x="30" y="132" fill="#64748B" fontSize="10" fontWeight="bold">
                100 FT ROAD
              </text>
              <text x="230" y="20" fill="#64748B" fontSize="10" fontWeight="bold">
                OUTER RING ROAD
              </text>
              <text x="530" y="20" fill="#64748B" fontSize="10" fontWeight="bold">
                SONY WORLD FLYOVER
              </text>
              <text x="30" y="282" fill="#64748B" fontSize="10" fontWeight="bold">
                KORAMANGALA 80FT RD
              </text>

              {/* Full Route Path (dashed) */}
              <path
                d="M 120,310 C 310,350 440,140 670,90"
                fill="none"
                stroke="#475569"
                strokeWidth="6"
                strokeDasharray="4 4"
              />

              {/* Traveled Route Path (neon glowing) */}
              <path
                d="M 120,310 C 310,350 440,140 670,90"
                fill="none"
                stroke="url(#route-gradient-in)"
                strokeWidth="6"
                strokeDasharray="800"
                strokeDashoffset={800 - (800 * progress) / 100}
                filter="url(#glow-in)"
              />

              {/* Restaurant Origin Marker (120, 310) */}
              <g transform="translate(120, 310)">
                <circle r="22" fill="#E11D48" opacity="0.2" className="animate-ping" />
                <circle r="14" fill="#E11D48" />
                <circle r="12" fill="#FFFFFF" />
                <foreignObject x="-9" y="-9" width="18" height="18">
                  <div className="flex items-center justify-center text-rose-600">
                    <Store className="w-4 h-4" />
                  </div>
                </foreignObject>
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {order.restaurant.name.split(' ')[0]}
                </text>
              </g>

              {/* Customer Destination Marker (670, 90) */}
              <g transform="translate(670, 90)">
                <circle r="20" fill="#10B981" opacity="0.2" />
                <circle r="14" fill="#10B981" />
                <circle r="12" fill="#FFFFFF" />
                <foreignObject x="-9" y="-9" width="18" height="18">
                  <div className="flex items-center justify-center text-emerald-600">
                    <Home className="w-4 h-4" />
                  </div>
                </foreignObject>
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Your Home ({userLocation.locality})
                </text>
              </g>

              {/* Live Moving Rider Marker */}
              {order.status === 'OUT_FOR_DELIVERY' || order.status === 'ARRIVED' ? (
                <g transform={`translate(${currentRiderPos.x}, ${currentRiderPos.y})`}>
                  <circle r="28" fill="#38BDF8" opacity="0.25" className="animate-ping" />
                  <circle r="16" fill="#0284C7" />
                  <circle r="13" fill="#FFFFFF" />
                  <foreignObject x="-9" y="-9" width="18" height="18">
                    <div className="flex items-center justify-center text-sky-600">
                      <Navigation className="w-4 h-4" />
                    </div>
                  </foreignObject>
                  <rect
                    x="-48"
                    y="-32"
                    width="96"
                    height="18"
                    rx="9"
                    fill="#0F172A"
                    stroke="#38BDF8"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-20"
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    Ather Rider ({Math.round(progress)}%)
                  </text>
                </g>
              ) : null}
            </svg>

            {/* Top Overlay Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs pointer-events-auto flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>
                  ETA:{' '}
                  <strong className="font-mono tabular-nums text-white">
                    {order.status === 'DELIVERED'
                      ? 'Delivered'
                      : `${order.estimatedDeliveryMinutes} mins (${remainingDistanceKm} km)`}
                  </strong>
                </span>
              </div>

              {/* Real-Time Live GPS Stream Indicator */}
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs pointer-events-auto flex items-center gap-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-400 tracking-wide text-[11px]">LIVE GPS STREAM</span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {order.status === 'OUT_FOR_DELIVERY' ? '· 38 km/h' : '· Connected'}
                </span>
              </div>
            </div>

            {/* Bottom Overlay Status bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-200">
                  {order.status === 'OUT_FOR_DELIVERY'
                    ? `Rider is on Ather 450X · Remaining ${remainingDistanceKm} km`
                    : order.status === 'PREPARING'
                    ? 'Chefs are packing freshly prepared dishes in thermal handi'
                    : order.status === 'ARRIVED'
                    ? 'Courier has arrived at your apartment gate'
                    : order.status === 'DELIVERED'
                    ? 'Package handed over safely with zero contact'
                    : 'Order confirmed and ticket sent to kitchen'}
                </span>
              </div>
              <span className="font-mono tabular-nums text-slate-400">
                {Math.round(progress)}% route completed
              </span>
            </div>
          </div>

          {/* Real-Time Safety & Handover Verification Card for Customers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Secure Delivery Handover</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Verified
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Share OTP with delivery partner <strong className="text-slate-800">{order.driver?.name}</strong> upon arrival.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delivery OTP:</span>
              <span className="font-mono text-sm font-black tracking-widest text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200 shadow-2xs">
                4281
              </span>
            </div>
          </div>

          {/* Admin-Only Control (Strictly visible ONLY when logged in as Admin or Restaurant Partner) */}
          {(isAdmin || isPartner) && (
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 text-xs space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Admin Profile Override: Update Live Order Status</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Visible only in Admin Profile</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'ARRIVED', 'DELIVERED'] as OrderStatus[]).map(
                  st => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(order.id, st)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        order.status === st
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Courier Card with Indian Details */}
          {order.driver && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-lg shrink-0">
                  {order.driver.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{order.driver.name}</h4>
                    <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      ★ {order.driver.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.driver.vehicle} ({order.driver.vehicleNumber}) · {order.driver.totalDeliveries} deliveries
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setChatModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => setPhoneCallActive(!phoneCallActive)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    phoneCallActive
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{phoneCallActive ? 'Connected (0:24)' : 'Call Rider'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Step Timeline & Order Receipt */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">Delivery Timeline</h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((step, idx) => {
                const isCurrent = step.status === order.status;
                const isPast = step.completed;

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-sm'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent ? 'text-rose-600' : isPast ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Order Bill & Invoice</h3>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified: {order.payment.upiApp || order.payment.method}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {order.items.map(ci => (
                <div key={ci.cartItemId} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">
                      {ci.quantity}x {ci.menuItem.name}
                    </span>
                    {Object.keys(ci.selectedOptions).length > 0 && (
                      <p className="text-[11px] text-slate-500">
                        {Object.values(ci.selectedOptions).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono tabular-nums text-slate-900 font-medium">
                    ₹{ci.itemTotal}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-mono tabular-nums">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Savings ({order.promoCode})</span>
                  <span className="font-mono tabular-nums">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-mono tabular-nums">₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Govt Taxes & Packaging</span>
                <span className="font-mono tabular-nums">₹{order.platformFee}</span>
              </div>
              {order.tip > 0 && (
                <div className="flex justify-between">
                  <span>Courier Partner Tip</span>
                  <span className="font-mono tabular-nums">₹{order.tip}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums text-rose-600">₹{order.total}</span>
              </div>
            </div>

            {/* Delivery address info */}
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Delivering to:
              </div>
              <p className="pl-4">
                {order.customer.flatNo}, {order.customer.building}, {order.customer.locality}, {order.customer.city} - {order.customer.pincode}
              </p>
              {order.customer.deliveryNotes && (
                <p className="pl-4 text-[11px] text-slate-400 italic">
                  "{order.customer.deliveryNotes}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Chat Modal */}
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[500px]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold">
                  {order.driver?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{order.driver?.name}</h4>
                  <p className="text-[11px] text-slate-300">Delivery Partner · Ather 450X</p>
                </div>
              </div>
              <button
                onClick={() => setChatModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type message to Ramesh..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
