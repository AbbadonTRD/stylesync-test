import { Employee, Package, SalonInfo, Product, Service } from '@/types';

export const services: Service[] = [
  {
    id: 'cut-style',
    name: 'Haarschnitt & Styling',
    description: 'Professioneller Haarschnitt mit Styling',
    duration: 60,
    price: 80,
    category: 'hair',
  },
  {
    id: 'color',
    name: 'Färben',
    description: 'Premium Haarfarbe mit Pflege',
    duration: 120,
    price: 120,
    category: 'hair',
  },
  {
    id: 'treatment',
    name: 'Luxus-Behandlung',
    description: 'Intensive Haarpflege mit hochwertigen Produkten',
    duration: 45,
    price: 60,
    category: 'hair',
  },
];

export const packages: Package[] = [
  {
    id: 'platinum',
    name: 'Paket Platinum',
    description: 'Das ultimative Verwöhnprogramm für höchste Ansprüche',
    services: [services[0], services[1], services[2]],
    price: 260,
    discountPercentage: 15,
  },
  {
    id: 'gold',
    name: 'Paket Gold',
    description: 'Perfekte Kombination aus Pflege und Styling',
    services: [services[0], services[1]],
    price: 180,
    discountPercentage: 10,
  },
  {
    id: 'silver',
    name: 'Paket Silber',
    description: 'Klassische Behandlung für den gepflegten Look',
    services: [services[0]],
    price: 80,
    discountPercentage: 0,
  },
];

export const employees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Weber',
    role: 'Senior Stylist',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800',
    bio: 'Über 10 Jahre Erfahrung in hochklassigen Salons',
    specialties: ['Colorierung', 'Hochsteckfrisuren', 'Schnitt'],
    availability: {
      'Montag': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
      'Dienstag': [
        { time: '09:00', available: true },
        { time: '10:00', available: false },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
      'Mittwoch': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: false },
        { time: '15:00', available: true },
      ],
      'Donnerstag': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: false },
      ],
      'Freitag': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
    },
  },
  {
    id: '2',
    name: 'Michael Schmidt',
    role: 'Master Stylist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800',
    bio: 'Spezialist für moderne Schnitte und Styling-Techniken',
    specialties: ['Herrenschnitte', 'Trending Styles', 'Bartpflege'],
    availability: {
      'Montag': [
        { time: '09:00', available: true },
        { time: '10:00', available: false },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
      'Dienstag': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: false },
        { time: '15:00', available: true },
      ],
      'Mittwoch': [
        { time: '09:00', available: false },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
      'Donnerstag': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
      'Freitag': [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
      ],
    },
  },
];

export const products: Product[] = [
  {
    id: 'cantu-curling-cream-1',
    name: 'Cantu Curling Cream',
    description: 'Sheabutter Coconut Curling Cream für natürliche Locken',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1597354984706-fac992d9306f?w=800',
    category: 'Styling',
    brand: 'Cantu',
    inStock: true,
  },
  {
    id: 'cantu-moisturizing-cream-1',
    name: 'Cantu Moisturizing Cream',
    description: 'Feuchtigkeitsspendende Styling-Creme für lockiges Haar',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
    category: 'Styling',
    brand: 'Cantu',
    inStock: true,
  },
  {
    id: 'cantu-twist-lock-gel-1',
    name: 'Cantu Twist & Lock Gel',
    description: 'Definierendes Gel für Twists und Locks',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?w=800',
    category: 'Styling',
    brand: 'Cantu',
    inStock: true,
  },
];

export const salonInfo: SalonInfo = {
  name: 'Meliyah afro-shop',
  description: 'Ihr Spezialist für Afro-Haarpflege in Frauenfeld',
  address: 'Rheinstrasse 21, 8500 Frauenfeld',
  phone: '0774471179',
  email: 'info@meliyah-afroshop.ch',
  openingHours: {
    'Montag': { open: 'Geschlossen', close: 'Geschlossen' },
    'Dienstag': { open: '10:30', close: '18:30' },
    'Mittwoch': { open: '10:30', close: '18:30' },
    'Donnerstag': { open: '10:30', close: '18:30' },
    'Freitag': { open: '10:30', close: '18:30' },
    'Samstag': { open: '10:30', close: '17:00' },
    'Sonntag': { open: 'Geschlossen', close: 'Geschlossen' },
  },
  images: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=800',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800',
  ],
};