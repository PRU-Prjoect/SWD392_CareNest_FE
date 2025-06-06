export interface Service {
  id: string;
  name: string;
  images: string[];
  rating: number;
  reviewCount: number;
  bookingCount: number;
  category: string;
  originalPrice: number;
  currentPrice: number;
  discount?: number;
  petTypes: string[];
  duration: number; // phút
  description?: string;
}
