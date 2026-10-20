import { UserLocation } from '../types';
import { INDIAN_CITIES } from '../data/mockData';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates approximate ETA in minutes based on distance and average Indian city transit speed
 */
export function calculateEtaMinutes(distanceKm: number, basePrepMinutes = 15): number {
  // Average city courier bike speed in Indian metro traffic: ~18 km/h => ~3.33 min/km
  const transitMinutes = Math.ceil(distanceKm * 3.3);
  return basePrepMinutes + transitMinutes;
}

/**
 * Request real browser GPS location using HTML5 Geolocation API
 */
export async function detectBrowserLocation(): Promise<{
  success: boolean;
  location: UserLocation;
  message: string;
}> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    const defaultCity = INDIAN_CITIES[0];
    return {
      success: false,
      location: {
        city: defaultCity.name,
        locality: defaultCity.defaultLocality,
        addressName: `${defaultCity.defaultLocality}, ${defaultCity.name}, ${defaultCity.state}`,
        lat: defaultCity.lat,
        lng: defaultCity.lng,
        isRealGps: false
      },
      message: 'Geolocation API is not supported by your browser. Using Bengaluru default.'
    };
  }

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;

        // Find nearest supported Indian city or use nearest coordinate
        let nearestCity = INDIAN_CITIES[0];
        let minDistance = Infinity;

        INDIAN_CITIES.forEach(city => {
          const dist = calculateHaversineDistanceKm(latitude, longitude, city.lat, city.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestCity = city;
          }
        });

        const location: UserLocation = {
          city: minDistance < 50 ? nearestCity.name : 'Current Location',
          locality: minDistance < 50 ? nearestCity.defaultLocality : 'Detected GPS Point',
          addressName: `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}° (GPS Accuracy ±${Math.round(accuracy || 15)}m)`,
          lat: latitude,
          lng: longitude,
          isRealGps: true,
          accuracy: accuracy || 10
        };

        resolve({
          success: true,
          location,
          message: `Live GPS detected (Accuracy ±${Math.round(accuracy || 10)}m)`
        });
      },
      error => {
        let msg = 'Location access was not granted.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Switched to Bengaluru, Koramangala.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }

        const fallback = INDIAN_CITIES[0];
        resolve({
          success: false,
          location: {
            city: fallback.name,
            locality: fallback.defaultLocality,
            addressName: `${fallback.defaultLocality}, ${fallback.name}`,
            lat: fallback.lat,
            lng: fallback.lng,
            isRealGps: false
          },
          message: msg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000
      }
    );
  });
}

/**
 * Educational architectural reference explaining how live location tracking is built in production
 */
export const LIVE_LOCATION_ARCHITECTURE_EXPLANATION = [
  {
    step: '1. Device Geolocation via HTML5 & Mobile SDK',
    tech: 'navigator.geolocation.watchPosition() (Web) / FusedLocationProviderClient (Android) / CoreLocation (iOS)',
    description: 'The rider app continuously captures GPS latitude, longitude, heading, and speed every 3–5 seconds with battery-optimized geofencing.'
  },
  {
    step: '2. Low-Latency Coordinate Streaming',
    tech: 'WebSockets (Socket.IO / STOMP) or Server-Sent Events (SSE) / MQTT broker',
    description: 'Driver coordinates are streamed to the backend server with lightweight binary/JSON packets. The server validates token authentication and associates coordinates with active order IDs.'
  },
  {
    step: '3. Snapping-to-Roads & Distance Matrix',
    tech: 'Google Maps Roads API / OSRM (Open Source Routing Machine) / Mapbox Navigation SDK',
    description: 'Raw GPS coordinates often have jitter (±5-15m). Road-snapping maps the raw point to the actual physical lane, and recalculates real-time ETA based on live traffic congestion.'
  },
  {
    step: '4. Client-Side Smooth Marker Animation (Dead Reckoning)',
    tech: 'requestAnimationFrame + Interpolation / SVG Bezier Splines / Leaflet & Google Maps JS SDK',
    description: 'Instead of sudden jumps when new GPS coordinates arrive every 4 seconds, the customer browser smoothly interpolates the vehicle marker along the polyline using bearing orientation and cubic bezier easing.'
  },
  {
    step: '5. Geofence Triggering & Arrival Webhooks',
    tech: 'Polygon Geofencing (radius: 100m from customer building)',
    description: 'When the courier enters the 100-meter boundary around customer coordinates, the backend automatically transitions order status to ARRIVED, sends WhatsApp/SMS alerts, and triggers the doorbell chime.'
  }
];
