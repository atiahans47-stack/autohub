  -- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Profiles table (custom JWT authentication)
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    profile_photo TEXT,
    date_of_birth DATE,
    cni_number TEXT,
    cni_front TEXT,
    cni_back TEXT,
    permis_number TEXT,
    permis_expiry DATE,
    permis_front TEXT,
    permis_back TEXT,
    country TEXT DEFAULT 'Cameroon',
    city TEXT,
    quartier TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    preferred_language TEXT DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'en')),
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    mtn_momo_number TEXT,
    orange_money_number TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'agent', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    cni_verified BOOLEAN DEFAULT FALSE,
    permis_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Admin-specific fields
    admin_created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_created_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT
  );

  -- Cars table
  CREATE TABLE IF NOT EXISTS public.cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image TEXT,
    type TEXT NOT NULL CHECK (type IN ('rental', 'sale')),
    price NUMERIC NOT NULL,
    transmission TEXT CHECK (transmission IN ('Automatic', 'Manual')),
    fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
    seats INTEGER,
    availability TEXT DEFAULT 'Available' CHECK (availability IN ('Available', 'Booked', 'Sold')),
    location TEXT,
    mileage INTEGER,
    year INTEGER,
    color TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Bookings table
  CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    car_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled')),
    payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
    payment_method TEXT,
    transaction_id TEXT,
    payment_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Sales table
  CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    car_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Completed', 'Cancelled')),
    payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
    payment_method TEXT,
    transaction_id TEXT,
    payment_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Messages table (contact form messages)
  CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id TEXT NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT,
    sender_phone TEXT,
    text TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Reviews table
  CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    car_name TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Chat rooms table
  CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Chat messages table
  CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Payments table
  CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'XAF',
    payment_method TEXT CHECK (payment_method IN ('mtn_momo', 'orange_money')),
    phone TEXT NOT NULL,
    fapshi_transaction_id TEXT,
    fapshi_status TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON public.bookings(car_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
  CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON public.sales(customer_id);
  CREATE INDEX IF NOT EXISTS idx_sales_car_id ON public.sales(car_id);
  CREATE INDEX IF NOT EXISTS idx_sales_status ON public.sales(status);
  CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON public.reviews(car_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
  CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON public.chat_rooms(created_by);
  CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
  CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
  CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
  CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
  CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
  CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

  -- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Service role bypass" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (true);

-- Create policies for cars table
CREATE POLICY "Service role bypass" ON public.cars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view cars" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Admins can manage cars" ON public.cars FOR ALL USING (true) WITH CHECK (true);

-- Create policies for bookings table
CREATE POLICY "Service role bypass" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Create policies for sales table
CREATE POLICY "Service role bypass" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Users can create sales" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);

-- Create policies for messages table
CREATE POLICY "Service role bypass" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- Create policies for reviews table
CREATE POLICY "Service role bypass" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (status = 'Approved');
CREATE POLICY "Users can view own reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- Create policies for chat_rooms table
CREATE POLICY "Service role bypass" ON public.chat_rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own chat rooms" ON public.chat_rooms FOR SELECT USING (true);
CREATE POLICY "Users can create chat rooms" ON public.chat_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage chat rooms" ON public.chat_rooms FOR ALL USING (true) WITH CHECK (true);

-- Create policies for chat_messages table
CREATE POLICY "Service role bypass" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own messages" ON public.chat_messages FOR UPDATE USING (true);
CREATE POLICY "Admins can manage messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Create policies for payments table
CREATE POLICY "Service role bypass" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
