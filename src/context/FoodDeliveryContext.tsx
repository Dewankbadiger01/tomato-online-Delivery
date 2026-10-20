import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Restaurant,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  CustomerDetails,
  StatusTimelineStep,
  User,
  UserLocation,
  UserRole,
  FoodCollection,
  MainExploreTab,
  AuthPageMode
} from '../types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_DEMO_ORDER,
  DEFAULT_USER_LOCATION,
  DEMO_USERS,
  INDIAN_CITIES,
  MUMBAI_COLLECTIONS
} from '../data/mockData';
import { sound } from '../utils/audio';
import { detectBrowserLocation } from '../utils/geolocation';

interface PromoValidationResult {
  success: boolean;
  message: string;
  discountAmount?: number;
}

interface FoodDeliveryContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  collections: FoodCollection[];
  activeRestaurant: Restaurant | null;
  setActiveRestaurant: (restaurant: Restaurant | null) => void;
  selectedDishForCustomization: MenuItem | null;
  setSelectedDishForCustomization: (item: MenuItem | null) => void;
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    selectedOptions?: Record<string, string>,
    instructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  cartDeliveryFee: number;
  cartPlatformFee: number;
  appliedPromo: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => PromoValidationResult;
  removePromoCode: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeOrder: (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod,
    tip: number,
    paymentMeta?: { upiApp?: 'GPay' | 'PhonePe' | 'Paytm' | 'CRED'; upiId?: string; cardLast4?: string }
  ) => Promise<Order>;
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  currentView: 'customer' | 'tracking' | 'restaurant_admin' | 'rider_console' | 'login' | 'signup';
  setCurrentView: (view: 'customer' | 'tracking' | 'restaurant_admin' | 'rider_console' | 'login' | 'signup') => void;
  activeRole: 'customer' | 'restaurant_partner' | 'rider';
  setActiveRole: (role: 'customer' | 'restaurant_partner' | 'rider') => void;
  
  // Navigation Tabs (Dining Out, Delivery, Nightlife) matching screenshot
  activeMainTab: MainExploreTab;
  setActiveMainTab: (tab: MainExploreTab) => void;
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // User Authentication & Roles
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  loginUser: (role: UserRole, phoneOrEmail?: string) => void;
  signupUser: (name: string, email: string, phone: string) => void;
  logoutUser: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: AuthPageMode;
  setAuthModalTab: (tab: AuthPageMode) => void;

  // Live Location Tracking
  userLocation: UserLocation;
  isDetectingLocation: boolean;
  detectLocation: () => Promise<void>;
  selectCity: (cityName: string) => void;
  liveLocationInfoModalOpen: boolean;
  setLiveLocationInfoModalOpen: (open: boolean) => void;

  // Restaurant Partner / Admin controls
  selectedAdminRestaurantId: string;
  setSelectedAdminRestaurantId: (id: string) => void;
  addMenuItem: (dish: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  advanceRiderStep: (orderId: string) => void;
}

const FoodDeliveryContext = createContext<FoodDeliveryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ORDERS: 'tomato_in_orders_v4',
  MENU_ITEMS: 'tomato_in_menu_v4',
  ACTIVE_ORDER_ID: 'tomato_in_active_order_id_v4',
  USER: 'tomato_in_user_v4',
  LOCATION: 'tomato_in_location_v4'
};

export const FoodDeliveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [collections] = useState<FoodCollection[]>(MUMBAI_COLLECTIONS);
  const [selectedAdminRestaurantId, setSelectedAdminRestaurantId] = useState<string>('rest-1');

  // Navigation tab matching screenshot: 'Dining Out' (active by default), 'Delivery', 'Nightlife'
  const [activeMainTab, setActiveMainTab] = useState<MainExploreTab>('dining');
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  
  // Authentication state - start as unauthenticated so 'Log in' and 'Sign up' buttons are prominent as in screenshot
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthPageMode>('login');
  const [liveLocationInfoModalOpen, setLiveLocationInfoModalOpen] = useState(false);

  // Live Location State (Default: Mumbai)
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    try {
      const savedLoc = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (savedLoc) return JSON.parse(savedLoc);
    } catch {}
    return DEFAULT_USER_LOCATION;
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MENU_ITEMS;
  });

  // Active restaurant in customer view
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);

  // Customization modal
  const [selectedDishForCustomization, setSelectedDishForCustomization] = useState<MenuItem | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Role and View navigation
  const [activeRole, setActiveRole] = useState<'customer' | 'restaurant_partner' | 'rider'>('customer');
  const [currentView, setCurrentView] = useState<'customer' | 'tracking' | 'restaurant_admin' | 'rider_console' | 'login' | 'signup'>('customer');

  // Simulation speed
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [INITIAL_DEMO_ORDER];
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ORDER_ID);
      if (savedId) return savedId;
    } catch {}
    return INITIAL_DEMO_ORDER.id;
  });

  // Save auth user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  // Save location
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(userLocation));
    } catch {}
  }, [userLocation]);

  // Sync menu items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  // Sync orders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Auth helpers
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  const isPartner = currentUser?.role === 'partner' || currentUser?.role === 'admin';

  const loginUser = (role: UserRole, phoneOrEmail?: string) => {
    if (role === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
      sound.playAddToCartChime();
    } else if (role === 'partner') {
      setCurrentUser(DEMO_USERS.partner);
      sound.playAddToCartChime();
    } else {
      const user = {
        ...DEMO_USERS.customer,
        phone: phoneOrEmail && phoneOrEmail.includes('@') ? DEMO_USERS.customer.phone : (phoneOrEmail || DEMO_USERS.customer.phone)
      };
      setCurrentUser(user);
      sound.playAddToCartChime();
    }
    setAuthModalOpen(false);
    if (currentView === 'login' || currentView === 'signup') {
      setCurrentView('customer');
    }
  };

  const signupUser = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      role: 'customer',
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          type: 'Home',
          flatNo: 'Flat 101, Palm Court',
          building: 'Carter Road',
          locality: userLocation.locality,
          city: userLocation.city,
          pincode: '400050'
        }
      ]
    };
    setCurrentUser(newUser);
    sound.playAddToCartChime();
    setAuthModalOpen(false);
    if (currentView === 'login' || currentView === 'signup') {
      setCurrentView('customer');
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentView('customer');
  };

  // Location helpers
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    sound.playAddToCartChime();
    try {
      const result = await detectBrowserLocation();
      setUserLocation(result.location);
    } catch {
      // Keep existing location
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const selectCity = (cityName: string) => {
    const found = INDIAN_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setUserLocation({
        city: found.name,
        locality: found.defaultLocality,
        addressName: `${found.defaultLocality}, ${found.name}, ${found.state}`,
        lat: found.lat,
        lng: found.lng,
        isRealGps: false
      });
      sound.playAddToCartChime();
    }
  };

  // Active tracking order derived
  const activeTrackingOrder = useMemo(() => {
    return orders.find(o => o.id === activeTrackingOrderId) || orders[0] || null;
  }, [orders, activeTrackingOrderId]);

  const setActiveTrackingOrder = (order: Order | null) => {
    if (order) {
      setActiveTrackingOrderId(order.id);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER_ID, order.id);
    }
  };

  // Cart calculations in INR (₹)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartDeliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    const firstItemRestId = cart[0].menuItem.restaurantId;
    const rest = restaurants.find(r => r.id === firstItemRestId);
    return rest ? rest.deliveryFee : 35;
  }, [cart, restaurants]);

  const cartPlatformFee = cart.length > 0 ? 5 : 0;

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'TOMATO50') {
      return Math.min(cartSubtotal * 0.5, 100);
    }
    if (appliedPromo === 'SWADINDIA') {
      return Math.min(75, cartSubtotal);
    }
    if (appliedPromo === 'FREEDELIVERY') {
      return cartDeliveryFee;
    }
    return 0;
  }, [appliedPromo, cartSubtotal, cartDeliveryFee]);

  const applyPromoCode = (rawCode: string): PromoValidationResult => {
    const code = rawCode.trim().toUpperCase();
    if (code === 'TOMATO50') {
      if (cartSubtotal < 199) {
        return { success: false, message: 'Minimum order for TOMATO50 is ₹199' };
      }
      setAppliedPromo('TOMATO50');
      sound.playAddToCartChime();
      return { success: true, message: '50% discount applied! (Max ₹100 saved)' };
    }
    if (code === 'SWADINDIA') {
      if (cartSubtotal < 299) {
        return { success: false, message: 'Minimum order for SWADINDIA is ₹299' };
      }
      setAppliedPromo('SWADINDIA');
      sound.playAddToCartChime();
      return { success: true, message: '₹75 instant festive discount applied!' };
    }
    if (code === 'FREEDELIVERY') {
      if (cartSubtotal < 149) {
        return { success: false, message: 'Minimum order for free delivery is ₹149' };
      }
      setAppliedPromo('FREEDELIVERY');
      sound.playAddToCartChime();
      return { success: true, message: 'Free delivery applied on your order!' };
    }
    return { success: false, message: 'Invalid promo code. Try TOMATO50, SWADINDIA, or FREEDELIVERY.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Cart actions
  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedOptions: Record<string, string> = {},
    instructions?: string
  ) => {
    sound.playAddToCartChime();
    
    let optionsExtra = 0;
    if (item.customizationGroups) {
      item.customizationGroups.forEach(grp => {
        const choice = selectedOptions[grp.name];
        if (choice) {
          const opt = grp.options.find(o => o.name === choice);
          if (opt) optionsExtra += opt.price;
        }
      });
    }

    const unitPrice = item.price + optionsExtra;
    const cartItemId = `${item.id}-${JSON.stringify(selectedOptions)}`;

    setCart(prev => {
      if (prev.length > 0 && prev[0].menuItem.restaurantId !== item.restaurantId) {
        return [
          {
            cartItemId,
            menuItem: item,
            quantity,
            selectedOptions,
            unitPrice,
            itemTotal: unitPrice * quantity,
            specialInstructions: instructions
          }
        ];
      }

      const existingIndex = prev.findIndex(ci => ci.cartItemId === cartItemId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: updated[existingIndex].unitPrice * newQty,
          specialInstructions: instructions || updated[existingIndex].specialInstructions
        };
        return updated;
      }

      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity,
          selectedOptions,
          unitPrice,
          itemTotal: unitPrice * quantity,
          specialInstructions: instructions
        }
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(ci => ci.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(ci => {
        if (ci.cartItemId === cartItemId) {
          return {
            ...ci,
            quantity: newQty,
            itemTotal: ci.unitPrice * newQty
          };
        }
        return ci;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Place order
  const placeOrder = async (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod,
    tip: number,
    paymentMeta?: { upiApp?: 'GPay' | 'PhonePe' | 'Paytm' | 'CRED'; upiId?: string; cardLast4?: string }
  ): Promise<Order> => {
    const restId = cart[0]?.menuItem.restaurantId || 'rest-1';
    const rest = restaurants.find(r => r.id === restId) || restaurants[0];

    const finalSubtotal = cartSubtotal;
    const finalDeliveryFee = appliedPromo === 'FREEDELIVERY' ? 0 : cartDeliveryFee;
    const finalTotal = Math.max(0, finalSubtotal - discountAmount + finalDeliveryFee + cartPlatformFee + tip);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const orderNum = `TOMATO-${userLocation.city.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const initialTimeline: StatusTimelineStep[] = [
      {
        status: 'PLACED',
        timestamp: timeStr,
        title: paymentMethod === 'UPI' ? 'Order Placed & Verified via UPI' : 'Order Placed & Paid',
        description: `Payment settled via ${paymentMethod === 'UPI' ? (paymentMeta?.upiApp || 'UPI') : paymentMethod}. Sent to ${rest.name}.`,
        completed: true,
        current: false
      },
      {
        status: 'CONFIRMED',
        timestamp: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 2).padStart(2, '0')}`,
        title: 'Restaurant Accepted Ticket',
        description: `${rest.name} kitchen confirmed and assigned chef station.`,
        completed: true,
        current: false
      },
      {
        status: 'PREPARING',
        timestamp: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 5).padStart(2, '0')}`,
        title: 'Master Chef Preparing',
        description: 'Chefs are packing freshly prepared dishes in food-grade thermal containers.',
        completed: false,
        current: true
      },
      {
        status: 'READY_FOR_PICKUP',
        timestamp: `Est ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 18).padStart(2, '0')}`,
        title: 'Ready for Pickup',
        description: 'Order sealed with tamper-proof security tape.',
        completed: false,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        timestamp: `Est ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 20).padStart(2, '0')}`,
        title: 'Out for Delivery',
        description: 'Delivery partner Ramesh Kumar is en route with live GPS.',
        completed: false,
        current: false
      },
      {
        status: 'DELIVERED',
        timestamp: `Est ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 30).padStart(2, '0')}`,
        title: 'Delivered',
        description: 'Order handed over safely at doorstep.',
        completed: false,
        current: false
      }
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customer,
      restaurant: {
        id: rest.id,
        name: rest.name,
        address: rest.address,
        phone: '+91 22 4123 9081'
      },
      items: [...cart],
      subtotal: finalSubtotal,
      discount: discountAmount,
      deliveryFee: finalDeliveryFee,
      platformFee: cartPlatformFee,
      tip,
      total: Number(finalTotal.toFixed(0)),
      promoCode: appliedPromo || undefined,
      payment: {
        method: paymentMethod,
        status: 'PAID',
        transactionId: `UPI_TOMATO_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        timestamp: now.toISOString(),
        upiApp: paymentMeta?.upiApp || (paymentMethod === 'UPI' ? 'GPay' : undefined),
        upiId: paymentMeta?.upiId || (paymentMethod === 'UPI' ? 'dewank@okhdfcbank' : undefined),
        cardLast4: paymentMeta?.cardLast4 || (paymentMethod === 'CARD' ? '4242' : undefined)
      },
      status: 'PREPARING',
      timeline: initialTimeline,
      estimatedDeliveryMinutes: 24,
      placedAt: `Today at ${timeStr}`,
      driver: {
        name: 'Ramesh Kumar',
        phone: '+91 97412 88921',
        vehicle: 'Ather 450X Electric Scooter',
        vehicleNumber: 'MH-02-EQ-4281',
        rating: 4.94,
        totalDeliveries: 2310,
        avatar: '',
        currentLat: rest.coordinates.lat + 0.002,
        currentLng: rest.coordinates.lng - 0.002
      },
      routeProgress: 18
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER_ID, newOrder.id);

    sound.playOrderPlacedChime();

    clearCart();
    setIsCheckoutOpen(false);
    setCurrentView('tracking');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    sound.playStatusUpdateChime();
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const updatedTimeline = ord.timeline.map(step => {
          if (step.status === newStatus) {
            return { ...step, completed: true, current: true };
          }
          const statusOrder: OrderStatus[] = [
            'PLACED',
            'CONFIRMED',
            'PREPARING',
            'READY_FOR_PICKUP',
            'OUT_FOR_DELIVERY',
            'ARRIVED',
            'DELIVERED'
          ];
          const currentIndex = statusOrder.indexOf(newStatus);
          const stepIndex = statusOrder.indexOf(step.status);

          if (stepIndex < currentIndex) {
            return { ...step, completed: true, current: false };
          } else if (stepIndex > currentIndex) {
            return { ...step, completed: false, current: false };
          }
          return step;
        });

        let updatedProgress = ord.routeProgress;
        if (newStatus === 'OUT_FOR_DELIVERY' && updatedProgress < 30) {
          updatedProgress = 35;
        } else if (newStatus === 'ARRIVED') {
          updatedProgress = 95;
        } else if (newStatus === 'DELIVERED') {
          updatedProgress = 100;
        }

        return {
          ...ord,
          status: newStatus,
          timeline: updatedTimeline,
          routeProgress: updatedProgress
        };
      })
    );
  };

  const advanceRiderStep = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        if (ord.status !== 'OUT_FOR_DELIVERY' && ord.status !== 'READY_FOR_PICKUP') return ord;

        const newProg = Math.min(100, (ord.routeProgress || 0) + 15);
        if (newProg >= 95 && ord.status === 'OUT_FOR_DELIVERY') {
          return {
            ...ord,
            status: 'ARRIVED',
            routeProgress: 95
          };
        }
        return {
          ...ord,
          routeProgress: newProg
        };
      })
    );
  };

  // Real-time automatic order lifecycle and live courier GPS progression
  useEffect(() => {
    if (!activeTrackingOrder) return;
    const currentStatus = activeTrackingOrder.status;

    if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') return;

    // Progression timer for kitchen & pickup stages
    if (currentStatus === 'PLACED') {
      const timeout = setTimeout(() => {
        updateOrderStatus(activeTrackingOrder.id, 'CONFIRMED');
      }, 5000);
      return () => clearTimeout(timeout);
    }

    if (currentStatus === 'CONFIRMED') {
      const timeout = setTimeout(() => {
        updateOrderStatus(activeTrackingOrder.id, 'PREPARING');
      }, 6000);
      return () => clearTimeout(timeout);
    }

    if (currentStatus === 'PREPARING') {
      const timeout = setTimeout(() => {
        updateOrderStatus(activeTrackingOrder.id, 'READY_FOR_PICKUP');
      }, 12000);
      return () => clearTimeout(timeout);
    }

    if (currentStatus === 'READY_FOR_PICKUP') {
      const timeout = setTimeout(() => {
        updateOrderStatus(activeTrackingOrder.id, 'OUT_FOR_DELIVERY');
      }, 7000);
      return () => clearTimeout(timeout);
    }

    if (currentStatus === 'ARRIVED') {
      const timeout = setTimeout(() => {
        updateOrderStatus(activeTrackingOrder.id, 'DELIVERED');
      }, 12000);
      return () => clearTimeout(timeout);
    }

    // Continuous real-time courier streaming when OUT_FOR_DELIVERY
    if (currentStatus === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setOrders(prev =>
          prev.map(ord => {
            if (ord.id !== activeTrackingOrder.id || ord.status !== 'OUT_FOR_DELIVERY') return ord;
            const nextProg = Math.min(100, ord.routeProgress + 1.0 * simulationSpeed);
            if (nextProg >= 96) {
              sound.playStatusUpdateChime();
              return {
                ...ord,
                status: 'ARRIVED',
                routeProgress: 96,
                estimatedDeliveryMinutes: 1
              };
            }
            return {
              ...ord,
              routeProgress: nextProg,
              estimatedDeliveryMinutes: Math.max(1, Math.round((100 - nextProg) * 0.2))
            };
          })
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeTrackingOrder?.id, activeTrackingOrder?.status, simulationSpeed]);

  const addMenuItem = (dish: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...dish,
      id: `item-${Date.now()}`
    };
    setMenuItems(prev => [newItem, ...prev]);
    sound.playAddToCartChime();
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  return (
    <FoodDeliveryContext.Provider
      value={{
        restaurants,
        menuItems,
        collections,
        activeRestaurant,
        setActiveRestaurant,
        selectedDishForCustomization,
        setSelectedDishForCustomization,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        cartDeliveryFee,
        cartPlatformFee,
        appliedPromo,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeOrder,
        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        updateOrderStatus,
        currentView,
        setCurrentView,
        activeRole,
        setActiveRole,
        activeMainTab,
        setActiveMainTab,
        activeCollectionId,
        setActiveCollectionId,
        globalSearchQuery,
        setGlobalSearchQuery,
        currentUser,
        isAuthenticated,
        isAdmin,
        isPartner,
        loginUser,
        signupUser,
        logoutUser,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        userLocation,
        isDetectingLocation,
        detectLocation,
        selectCity,
        liveLocationInfoModalOpen,
        setLiveLocationInfoModalOpen,
        selectedAdminRestaurantId,
        setSelectedAdminRestaurantId,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        simulationSpeed,
        setSimulationSpeed,
        advanceRiderStep
      }}
    >
      {children}
    </FoodDeliveryContext.Provider>
  );
};

export const useFoodDelivery = () => {
  const context = useContext(FoodDeliveryContext);
  if (!context) {
    throw new Error('useFoodDelivery must be used within a FoodDeliveryProvider');
  }
  return context;
};
