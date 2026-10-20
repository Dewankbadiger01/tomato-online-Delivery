export type DietaryTag = 'veg' | 'non-veg' | 'vegan' | 'jain' | 'egg';

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelection?: number;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // in INR (₹)
  category: string;
  image: string;
  dietary: DietaryTag;
  isSpicy?: boolean;
  isPopular?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  calories?: number;
  customizationGroups?: CustomizationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMinutes: string;
  deliveryFee: number; // in INR (₹)
  minOrder: number; // in INR (₹)
  address: string;
  locality: string;
  city: string;
  fssaiLicense: string;
  isOpen: boolean;
  featured?: boolean;
  isPureVeg?: boolean;
  approxCostForTwo?: number;
  hasOutdoorSeating?: boolean;
  servesAlcohol?: boolean;
  collectionIds?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FoodCollection {
  id: string;
  title: string;
  placesCount: number;
  coverImage: string;
  description: string;
  tag: string;
}

export type MainExploreTab = 'dining' | 'delivery' | 'nightlife';
export type AuthPageMode = 'login' | 'signup' | 'admin';

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: { [groupName: string]: string };
  unitPrice: number;
  itemTotal: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'PAID' | 'PENDING' | 'FAILED';
  transactionId: string;
  timestamp: string;
  cardLast4?: string;
  upiApp?: 'GPay' | 'PhonePe' | 'Paytm' | 'CRED' | 'BHIM';
  upiId?: string;
  bankName?: string;
}

export interface StatusTimelineStep {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface DriverDetails {
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  avatar: string;
  currentLat: number;
  currentLng: number;
}

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  flatNo: string;
  building: string;
  locality: string;
  landmark?: string;
  city: string;
  pincode: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  flatNo: string;
  building: string;
  locality: string;
  city: string;
  pincode: string;
  landmark?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  restaurant: {
    id: string;
    name: string;
    address: string;
    phone: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  tip: number;
  total: number;
  promoCode?: string;
  payment: PaymentDetails;
  status: OrderStatus;
  timeline: StatusTimelineStep[];
  estimatedDeliveryMinutes: number;
  placedAt: string;
  driver?: DriverDetails;
  routeProgress: number; // 0 to 100 percent
}

export interface UserLocation {
  city: string;
  locality: string;
  addressName: string;
  lat: number;
  lng: number;
  isRealGps: boolean;
  accuracy?: number;
}

export type UserRole = 'customer' | 'admin' | 'partner' | 'rider';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  savedAddresses: SavedAddress[];
  defaultAddressId?: string;
}
