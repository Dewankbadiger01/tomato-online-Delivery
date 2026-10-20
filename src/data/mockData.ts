import { Restaurant, MenuItem, Order, User, UserLocation, FoodCollection } from '../types';

import heroFoodSpread from '../assets/images/hero_food_spread_1792427465061.jpg';
import foodArtisanPizza from '../assets/images/food_artisan_pizza_1792427465120.jpg';
import foodCraftBurger from '../assets/images/food_craft_burger_1792427466016.jpg';
import foodSushiPlatter from '../assets/images/food_sushi_platter_1792427466255.jpg';
import foodSpiceBowl from '../assets/images/food_spice_bowl_1792427466638.jpg';
import foodBiryani from '../assets/images/food_hyderabadi_biryani_1792428547138.jpg';
import foodDosa from '../assets/images/food_masala_dosa_1792428548105.jpg';

export const HERO_IMAGE = heroFoodSpread;

export const INDIAN_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', defaultLocality: 'Bandra West (Pali Hill)', lat: 19.0596, lng: 72.8295 },
  { name: 'Bengaluru', state: 'Karnataka', defaultLocality: 'Koramangala 5th Block', lat: 12.9352, lng: 77.6245 },
  { name: 'Delhi NCR', state: 'Delhi', defaultLocality: 'Connaught Place & South Ex', lat: 28.6315, lng: 77.2167 },
  { name: 'Hyderabad', state: 'Telangana', defaultLocality: 'Banjara Hills & Jubilee Hills', lat: 17.4123, lng: 78.4354 },
  { name: 'Pune', state: 'Maharashtra', defaultLocality: 'Koregaon Park', lat: 18.5362, lng: 73.8940 }
];

export const DEFAULT_USER_LOCATION: UserLocation = {
  city: 'Mumbai',
  locality: 'Bandra West',
  addressName: 'Hill Road, Bandra West, Mumbai, Maharashtra 400050',
  lat: 19.0596,
  lng: 72.8295,
  isRealGps: false
};

export const MUMBAI_COLLECTIONS: FoodCollection[] = [
  {
    id: 'col-sports',
    title: 'Live Sports Screenings',
    placesCount: 8,
    coverImage: foodCraftBurger,
    description: 'Catch IPL, Premier League & F1 on giant stadium screens with chilled craft beer and pub bites.',
    tag: 'Sports & Beer'
  },
  {
    id: 'col-bars',
    title: 'Bar & Pubs',
    placesCount: 12,
    coverImage: heroFoodSpread,
    description: 'Artisanal cocktails, speakeasies, taprooms, and late night energetic DJ sets in Mumbai.',
    tag: 'Craft Drinks'
  },
  {
    id: 'col-new',
    title: 'Newly Opened',
    placesCount: 15,
    coverImage: foodArtisanPizza,
    description: 'The hottest new culinary openings, aesthetic brunch spots, and chef-curated tasting menus.',
    tag: 'Trending'
  },
  {
    id: 'col-seaview',
    title: 'Sea View Dining',
    placesCount: 10,
    coverImage: foodSushiPlatter,
    description: 'Panoramic Arabian Sea sunset tables, breezy Marine Drive terraces, and coastal seafood feasts.',
    tag: 'Scenic & Romantic'
  }
];

export const DEMO_USERS: Record<string, User> = {
  customer: {
    id: 'usr-customer-01',
    name: 'Dewank Badiger',
    phone: '+91 98452 31092',
    email: 'dewankbadiger628@gmail.com',
    role: 'customer',
    savedAddresses: [
      {
        id: 'addr-1',
        type: 'Home',
        flatNo: 'Flat 12B, Sea Breeze Apartments',
        building: 'Pali Hill Road',
        locality: 'Bandra West',
        landmark: 'Near Carter Road Promenade',
        city: 'Mumbai',
        pincode: '400050'
      },
      {
        id: 'addr-2',
        type: 'Work',
        flatNo: 'One International Centre, 9th Floor',
        building: 'Senapati Bapat Marg',
        locality: 'Lower Parel',
        landmark: 'Opposite Kamala Mills',
        city: 'Mumbai',
        pincode: '400013'
      }
    ],
    defaultAddressId: 'addr-1'
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Rajesh Sharma (Admin)',
    phone: '+91 98110 54321',
    email: 'admin@tomato.in',
    role: 'admin',
    savedAddresses: []
  },
  partner: {
    id: 'usr-partner-01',
    name: 'Chef Sanjeev (Partner)',
    phone: '+91 98220 89100',
    email: 'partner@meghanafoods.in',
    role: 'partner',
    savedAddresses: []
  }
};

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Bastian & Sea View Kitchen',
    tagline: 'Coastal Seafood Platters, Lobster Rolls & Sunset Cocktails',
    coverImage: foodSushiPlatter,
    cuisines: ['Seafood', 'Continental', 'Cocktails', 'Sushi'],
    rating: 4.8,
    reviewCount: 3420,
    deliveryTimeMinutes: '30-40',
    deliveryFee: 49,
    minOrder: 299,
    address: 'Linking Road, Bandra West',
    locality: 'Bandra West',
    city: 'Mumbai',
    fssaiLicense: '11519004000842',
    isOpen: true,
    featured: true,
    isPureVeg: false,
    approxCostForTwo: 1800,
    hasOutdoorSeating: true,
    servesAlcohol: true,
    collectionIds: ['col-seaview', 'col-bars'],
    coordinates: { lat: 19.0596, lng: 72.8295 }
  },
  {
    id: 'rest-2',
    name: 'The Stadium Sports Pub & Grill',
    tagline: 'Gigantic Screen Matches, Sizzlers, Craft Brews & Buffalo Wings',
    coverImage: foodCraftBurger,
    cuisines: ['Finger Food', 'Burgers', 'American', 'Brewery'],
    rating: 4.7,
    reviewCount: 2190,
    deliveryTimeMinutes: '25-35',
    deliveryFee: 39,
    minOrder: 199,
    address: 'Kamala Mills Compound, Lower Parel',
    locality: 'Lower Parel',
    city: 'Mumbai',
    fssaiLicense: '11520004001923',
    isOpen: true,
    featured: true,
    isPureVeg: false,
    approxCostForTwo: 1400,
    hasOutdoorSeating: true,
    servesAlcohol: true,
    collectionIds: ['col-sports', 'col-bars'],
    coordinates: { lat: 18.9986, lng: 72.8318 }
  },
  {
    id: 'rest-3',
    name: 'Meghana Foods & Paradise Biryani',
    tagline: 'Authentic Royal Hyderabadi Dum Biryani, Andhra Chicken 65 & Paneer Sholay',
    coverImage: foodBiryani,
    cuisines: ['Biryani', 'Andhra', 'North Indian', 'Kebabs'],
    rating: 4.9,
    reviewCount: 4580,
    deliveryTimeMinutes: '20-30',
    deliveryFee: 35,
    minOrder: 199,
    address: 'Hill Road, Near Mehboob Studio, Bandra West',
    locality: 'Bandra West',
    city: 'Mumbai',
    fssaiLicense: '11521004000312',
    isOpen: true,
    featured: true,
    isPureVeg: false,
    approxCostForTwo: 700,
    hasOutdoorSeating: false,
    servesAlcohol: false,
    collectionIds: ['col-new'],
    coordinates: { lat: 19.0544, lng: 72.8280 }
  },
  {
    id: 'rest-4',
    name: 'Pizza By The Bay & Trattoria',
    tagline: 'Iconic Marine Drive Sea Facing Italian Sourdough Pizzas',
    coverImage: foodArtisanPizza,
    cuisines: ['Italian', 'Pizza', 'Pasta', 'Desserts'],
    rating: 4.8,
    reviewCount: 3120,
    deliveryTimeMinutes: '30-45',
    deliveryFee: 45,
    minOrder: 250,
    address: '143 Marine Drive, Churchgate',
    locality: 'Marine Drive',
    city: 'Mumbai',
    fssaiLicense: '11518004000451',
    isOpen: true,
    featured: true,
    isPureVeg: false,
    approxCostForTwo: 1600,
    hasOutdoorSeating: true,
    servesAlcohol: true,
    collectionIds: ['col-seaview', 'col-new'],
    coordinates: { lat: 18.9322, lng: 72.8264 }
  },
  {
    id: 'rest-5',
    name: 'Rameshwaram Pure Veg Cafe',
    tagline: 'Pure Desi Ghee Podi Roast Dosa, Thatte Idli & Filter Kaapi',
    coverImage: foodDosa,
    cuisines: ['South Indian', 'Breakfast', 'Dosa', 'Filter Coffee'],
    rating: 4.9,
    reviewCount: 3820,
    deliveryTimeMinutes: '20-30',
    deliveryFee: 29,
    minOrder: 120,
    address: 'Bhandarkar Road, Matunga Central',
    locality: 'Matunga',
    city: 'Mumbai',
    fssaiLicense: '11522004001923',
    isOpen: true,
    featured: false,
    isPureVeg: true,
    approxCostForTwo: 350,
    hasOutdoorSeating: false,
    servesAlcohol: false,
    collectionIds: [],
    coordinates: { lat: 19.0269, lng: 72.8553 }
  },
  {
    id: 'rest-6',
    name: 'Punjab Grill & Karim’s Delhi 6',
    tagline: 'Old Delhi Butter Chicken, Dal Makhani, Dum Biryani & Amritsari Kulcha',
    coverImage: foodSpiceBowl,
    cuisines: ['North Indian', 'Mughlai', 'Tandoor', 'Curries'],
    rating: 4.7,
    reviewCount: 1540,
    deliveryTimeMinutes: '30-40',
    deliveryFee: 49,
    minOrder: 249,
    address: 'Palladium Mall, High Street Phoenix, Lower Parel',
    locality: 'Lower Parel',
    city: 'Mumbai',
    fssaiLicense: '11519004000451',
    isOpen: true,
    featured: false,
    isPureVeg: false,
    approxCostForTwo: 1500,
    hasOutdoorSeating: false,
    servesAlcohol: true,
    collectionIds: ['col-bars'],
    coordinates: { lat: 18.9950, lng: 72.8250 }
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Meghana Foods Items
  {
    id: 'item-101',
    restaurantId: 'rest-3',
    name: 'Meghana Special Chicken Dum Biryani',
    description: 'Aromatic long-grain basmati rice cooked with boneless tender chicken pieces, layered in spicy secret Andhra masala, served with mirchi ka salan and onion raita.',
    price: 349,
    category: 'Dum Biryani',
    image: foodBiryani,
    dietary: 'non-veg',
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 780,
    customizationGroups: [
      {
        id: 'portion',
        name: 'Portion Size',
        required: true,
        options: [
          { name: 'Regular Handi (Serves 1-2)', price: 0 },
          { name: 'Jumbo Family Pack (Serves 3-4)', price: 320 }
        ]
      },
      {
        id: 'salan-raita',
        name: 'Extra Salan & Raita',
        required: false,
        options: [
          { name: 'Extra Mirchi Ka Salan Handi', price: 40 },
          { name: 'Extra Boondi Raita Bowl', price: 35 }
        ]
      }
    ]
  },
  {
    id: 'item-102',
    restaurantId: 'rest-3',
    name: 'Paneer Sholay Kebab',
    description: 'Cottage cheese cubes tossed in spicy curd marinade with curry leaves, crushed black pepper, and green chilies.',
    price: 279,
    category: 'Starters & Kebabs',
    image: foodBiryani,
    dietary: 'veg',
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 490
  },
  {
    id: 'item-103',
    restaurantId: 'rest-3',
    name: 'Andhra Chicken 65',
    description: 'Deep-fried marinated chicken bites tossed with roasted cumin, curry leaves, and green chillies.',
    price: 310,
    category: 'Starters & Kebabs',
    image: foodBiryani,
    dietary: 'non-veg',
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 14,
    calories: 560
  },

  // Rameshwaram Cafe Items
  {
    id: 'item-201',
    restaurantId: 'rest-5',
    name: 'Ghee Podi Roast Masala Dosa',
    description: 'Crisp golden crepe smeared with generous melted pure cow ghee, fiery gun powder (chutney podi), and spiced potato bhaji, served with 3 chutneys & sambar.',
    price: 165,
    category: 'South Indian Dosas',
    image: foodDosa,
    dietary: 'veg',
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 8,
    calories: 480,
    customizationGroups: [
      {
        id: 'ghee-level',
        name: 'Ghee Preference',
        required: true,
        options: [
          { name: 'Signature Pure Cow Ghee', price: 0 },
          { name: 'Double Ghee Extra Crispy', price: 30 },
          { name: 'Less Ghee', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'item-202',
    restaurantId: 'rest-5',
    name: 'Ghee Thatte Idli with Podi (2 pcs)',
    description: 'Fluffy steamed plate idlis drenched in piping hot spiced ghee and gun powder.',
    price: 95,
    category: 'Idli & Vada',
    image: foodDosa,
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 320
  },
  {
    id: 'item-203',
    restaurantId: 'rest-5',
    name: 'Authentic Degree Filter Coffee (Hot)',
    description: 'Freshly brewed chicory-coffee decoction frothed in pure buffalo milk, served in traditional brass dabarah and tumbler.',
    price: 55,
    category: 'Beverages',
    image: foodDosa,
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 120
  },

  // Bastian Seafood & Drinks
  {
    id: 'item-301',
    restaurantId: 'rest-1',
    name: 'Bastian Lobster Roll & Truffle Fries',
    description: 'Butter-poached Arabian sea lobster chunks in a toasted brioche bun with chive aioli and parmesan truffle fries.',
    price: 650,
    category: 'Seafood Platters',
    image: foodSushiPlatter,
    dietary: 'non-veg',
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 18,
    calories: 640
  },
  {
    id: 'item-302',
    restaurantId: 'rest-1',
    name: 'Spicy Salmon & Avocado Maki (8 pcs)',
    description: 'Fresh Atlantic salmon, ripe avocado, spicy sriracha tobiko mayo, rolled in toasted nori.',
    price: 520,
    category: 'Sushi Bar',
    image: foodSushiPlatter,
    dietary: 'non-veg',
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 420
  },

  // Stadium Sports Pub
  {
    id: 'item-401',
    restaurantId: 'rest-2',
    name: 'Stadium Grand Double Smash Burger',
    description: 'Two smashed tender patties, sharp cheddar melt, smoky caramelized onions, bacon jam and stadium brew glaze on brioche.',
    price: 360,
    category: 'Pub Grub',
    image: foodCraftBurger,
    dietary: 'non-veg',
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 14,
    calories: 890
  },
  {
    id: 'item-402',
    restaurantId: 'rest-2',
    name: 'Peri Peri Crispy Chicken Wings (6 pcs)',
    description: 'Crispy fried wings tossed in fiery peri peri glaze served with blue cheese ranch.',
    price: 290,
    category: 'Pub Grub',
    image: foodCraftBurger,
    dietary: 'non-veg',
    isSpicy: true,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 520
  },

  // Pizza by the Bay
  {
    id: 'item-501',
    restaurantId: 'rest-4',
    name: 'Margherita Verace D.O.P.',
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant wild basil, and extra virgin olive oil drizzle on a 48h cold fermented crust.',
    price: 490,
    category: 'Artisan Pizzas',
    image: foodArtisanPizza,
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 780
  }
];

export const INITIAL_DEMO_ORDER: Order = {
  id: 'ord-mum-9481',
  orderNumber: 'TOMATO-BOM-842',
  customer: {
    name: 'Dewank Badiger',
    phone: '+91 98452 31092',
    email: 'dewankbadiger628@gmail.com',
    flatNo: 'Flat 12B, Sea Breeze Apartments',
    building: 'Pali Hill Road',
    locality: 'Bandra West',
    city: 'Mumbai',
    pincode: '400050',
    landmark: 'Near Carter Road Promenade',
    deliveryNotes: 'Leave with security guard, please do not ring bell.'
  },
  restaurant: {
    id: 'rest-3',
    name: 'Meghana Foods & Paradise Biryani',
    address: 'Hill Road, Near Mehboob Studio, Bandra West',
    phone: '+91 22 4123 9081'
  },
  items: [
    {
      cartItemId: 'c-101',
      menuItem: INITIAL_MENU_ITEMS[0],
      quantity: 1,
      selectedOptions: {
        'Portion Size': 'Regular Handi (Serves 1-2)',
        'Extra Salan & Raita': 'Extra Mirchi Ka Salan Handi'
      },
      unitPrice: 389,
      itemTotal: 389
    },
    {
      cartItemId: 'c-102',
      menuItem: INITIAL_MENU_ITEMS[1],
      quantity: 1,
      selectedOptions: {},
      unitPrice: 279,
      itemTotal: 279
    }
  ],
  subtotal: 668,
  discount: 100,
  deliveryFee: 35,
  platformFee: 5,
  tip: 30,
  total: 638,
  promoCode: 'TOMATO50',
  payment: {
    method: 'UPI',
    status: 'PAID',
    transactionId: 'UPI_TOMATO_984102941',
    timestamp: '2026-10-20 12:30:00',
    upiApp: 'GPay',
    upiId: 'dewank@okhdfcbank'
  },
  status: 'OUT_FOR_DELIVERY',
  timeline: [
    {
      status: 'PLACED',
      timestamp: '12:30',
      title: 'Order Placed & Paid via UPI',
      description: 'Transaction ID UPI_TOMATO_984102941 verified instantly via NPCI gateway.',
      completed: true,
      current: false
    },
    {
      status: 'CONFIRMED',
      timestamp: '12:32',
      title: 'Meghana Foods Accepted Ticket',
      description: 'Bandra West kitchen confirmed the order ticket.',
      completed: true,
      current: false
    },
    {
      status: 'PREPARING',
      timestamp: '12:35',
      title: 'Chef is Packing Fresh Handi',
      description: 'Piping hot dum biryani and freshly roasted paneer sholay packaged in tamper-proof thermal containers.',
      completed: true,
      current: false
    },
    {
      status: 'READY_FOR_PICKUP',
      timestamp: '12:48',
      title: 'Sealed & Handed to Rider',
      description: 'Order bagged and handed over to Ather 450X delivery partner.',
      completed: true,
      current: false
    },
    {
      status: 'OUT_FOR_DELIVERY',
      timestamp: '12:51',
      title: 'Ramesh is on the way (Ather 450X)',
      description: 'Rider Ramesh Kumar is crossing Hill Road toward Pali Hill.',
      completed: false,
      current: true
    },
    {
      status: 'DELIVERED',
      timestamp: 'Est 13:05',
      title: 'Delivered at Doorstep',
      description: 'Handed over safely with contactless delivery.',
      completed: false,
      current: false
    }
  ],
  estimatedDeliveryMinutes: 14,
  placedAt: 'Today at 12:30',
  driver: {
    name: 'Ramesh Kumar',
    phone: '+91 97412 88921',
    vehicle: 'Ather 450X Electric Scooter',
    vehicleNumber: 'MH-02-EQ-4281',
    rating: 4.94,
    totalDeliveries: 2310,
    avatar: '',
    currentLat: 19.0560,
    currentLng: 72.8290
  },
  routeProgress: 60
};
