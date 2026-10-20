import React from 'react';
import { X, Navigation, Crosshair, MapPin, Radio, CheckCircle, Code2, Globe } from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';
import { INDIAN_CITIES } from '../../data/mockData';
import { LIVE_LOCATION_ARCHITECTURE_EXPLANATION } from '../../utils/geolocation';

export const LiveLocationInfoModal: React.FC = () => {
  const {
    liveLocationInfoModalOpen,
    setLiveLocationInfoModalOpen,
    userLocation,
    isDetectingLocation,
    detectLocation,
    selectCity
  } = useFoodDelivery();

  if (!liveLocationInfoModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Live Location Tracking & Architecture</h2>
              <p className="text-xs text-slate-400">
                HTML5 Geolocation · GPS Stream · Dead Reckoning Animation
              </p>
            </div>
          </div>
          <button
            onClick={() => setLiveLocationInfoModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Active Detected GPS Location Box */}
          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Currently Active Delivery Location</span>
              </span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded text-rose-800 border border-rose-200">
                {userLocation.isRealGps ? 'Live Browser GPS' : 'City Preset'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
              <div>
                <span className="text-slate-500 font-medium">City & Locality:</span>{' '}
                <strong>{userLocation.locality}, {userLocation.city}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Coordinates:</span>{' '}
                <strong className="font-mono">{userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span>{isDetectingLocation ? 'Acquiring Satellites...' : 'Detect Real Browser GPS'}</span>
              </button>

              <span className="text-slate-400">or pick city:</span>
              {INDIAN_CITIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => selectCity(c.name)}
                  className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                    userLocation.city === c.name
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Guide: How It Works */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Code2 className="w-4 h-4 text-rose-600" />
              <span>How Production Live Location Tracking Is Implemented:</span>
            </div>

            <div className="space-y-3">
              {LIVE_LOCATION_ARCHITECTURE_EXPLANATION.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{item.step}</h4>
                    <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.tech}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippet for Implementation */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900">Production Web Implementation Pattern:</span>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
{`// 1. Subscribe to Live GPS updates in React
navigator.geolocation.watchPosition(
  (pos) => {
    const { latitude, longitude, heading, speed } = pos.coords;
    // 2. Stream coordinate to backend over WebSocket
    socket.emit('rider_gps_ping', { orderId, lat: latitude, lng: longitude });
  },
  (err) => console.error(err),
  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);`}
            </pre>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setLiveLocationInfoModalOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
