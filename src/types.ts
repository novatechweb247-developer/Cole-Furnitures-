export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  images: string[];
  isFeatured: boolean;
  availability: 'In Stock' | 'Made to Order' | 'Out of Stock';
  sortOrder: number;
  createdAt: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  comment: string;
  rating: number;
}

export interface PromoSection {
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export interface StoreContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  interiorDesignTitle: string;
  interiorDesignText: string;
  whyChooseUs: WhyChooseUsItem[];
  promo: PromoSection;
  testimonials: Testimonial[];
}

export interface StoreBusiness {
  name?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  phoneInternational?: string;
  whatsappUrl?: string;
  mapUrl?: string;
  description?: string;
  logoUrl?: string;
  editorialImageUrl?: string;
}

export interface StoreData {
  business?: StoreBusiness;
  gallery?: Array<{ id: string; title: string; category: string; image: string; description: string; sortOrder: number }>;
  categories: Category[];
  products: Product[];
  content: StoreContent;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  favorites: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  total: number;
  paymentMethod: 'whatsapp' | 'paystack';
  paymentStatus: 'pending' | 'success' | 'failed';
  paystackReference?: string;
  createdAt: string;
}

