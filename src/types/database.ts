export interface UserProfile {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
  city?: string;
  address?: string;
  quartier?: string;
  country?: string;
  cni_number?: string;
  cni_front?: string;
  cni_back?: string;
  cni_verified?: boolean;
  permis_number?: string;
  permis_expiry?: string;
  permis_front?: string;
  permis_back?: string;
  permis_verified?: boolean;
  profile_photo?: string;
  date_of_birth?: string;
  password_hash?: string;
  mtn_momo_number?: string;
  orange_money_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  is_verified?: boolean;
  total_bookings?: number;
  total_purchases?: number;
  joined_date?: string;
  last_active?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  nationality?: string;
  country_of_residence?: string;
  phone_country_code?: string;
  id_type?: string;
  id_number?: string;
  arrival_date?: string;
  local_cameroon_address?: string;
  identity_document_url?: string;
  profile_completed?: boolean;
}

export interface Car {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  image2?: string;
  image3?: string;
  type: string;
  price: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  availability?: string;
  location?: string;
  engine?: string;
  horsepower?: number;
  fuelConsumption?: string;
  deposit?: number;
  mileageLimit?: number;
  fuelPolicy?: string;
  returnCondition?: string;
  features?: string | string[];
  mileage?: number;
  year?: number;
  condition?: string;
  color?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  customer_id?: string;
  car_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  car_name: string;
  start_date: string;
  end_date: string;
  location?: string;
  amount: number;
  total_price?: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  transaction_id?: string;
  payment_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  customer_id?: string;
  car_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  car_name: string;
  amount: number;
  total_price?: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  transaction_id?: string;
  payment_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceLog {
  id: string;
  car_id?: string;
  type?: string;
  description?: string;
  cost?: number;
  status?: string;
  performed_by?: string;
  performed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  booking_id?: string;
  user_id?: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  phone?: string;
  fapshi_transaction_id?: string;
  fapshi_status?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  created_by?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id?: string;
  sender_type?: string;
  message: string;
  read?: boolean;
  is_read?: boolean;
  created_at?: string;
}

export interface Message {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  user_id?: string;
  user_name: string;
  user_email?: string;
  car_id?: string;
  car_name?: string;
  rating: number;
  comment?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface SalesLead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  car_id?: string;
  car_name?: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  rating: number;
  testimonial: string;
  verified?: boolean;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContent {
  id: string;
  section: string;
  content: Record<string, unknown>;
  updated_at?: string;
  updated_by?: string;
}

// Helper type for Supabase single() queries
export type SingleResult<T> = { data: T | null; error: unknown };
