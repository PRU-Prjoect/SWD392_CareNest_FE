// types/hotel.ts
export interface Hotel {
  id: number;
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: number;
  sub_address_id: number;
  is_active: boolean;
  star: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  room_type: 'VIP' | 'Standard' | 'Economy' | 'Suite';
  max_capability: number;
  daily_price: number;
  is_available: boolean;
  amenities: string;
  star: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface HotelWithRooms extends Hotel {
  rooms: Room[];
}
