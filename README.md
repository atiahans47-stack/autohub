# AUTOHub - Online Car Rentals & Sales Management System

A comprehensive car rental and sales platform built with Next.js, featuring user authentication, real-time booking management, payment integration, and admin dashboard.

## Features

### For Customers
- **Car Browsing**: Browse and filter cars by category, price, and availability
- **Car Booking**: Book cars for rental with date selection and insurance options
- **Car Purchasing**: Buy cars directly from the platform
- **Payment Integration**: Secure payments via Fapshi (MTN Mobile Money, Orange Money)
- **User Dashboard**: View booking history, manage profile
- **Live Chat**: Real-time support chat with admin team
- **Real-time Updates**: See car availability changes instantly

### For Admins
- **Dashboard**: Overview of total cars, users, bookings, revenue, and unread chats
- **Car Management**: Add, edit, delete cars with images and specifications
- **Booking Management**: View, confirm, cancel, and manage bookings
- **Sales Management**: Track and manage car sales
- **User Management**: View users, booking counts, and account status
- **Content Management**: Manage hero section, footer, and site settings (logo, site name)
- **Live Chat**: WhatsApp-style chat interface for customer support
- **Analytics**: View business performance metrics
- **Early Returns**: Mark cars as returned early and set back to available
- **Auto-expiry**: Automatic car availability reset when bookings expire

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Styling**: TailwindCSS, Framer Motion (animations)
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT-based auth with Supabase
- **Real-time**: Supabase Realtime Subscriptions
- **Payment**: Fapshi Payment Gateway
- **Storage**: Supabase Storage (images, documents)

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account
- Fapshi account (for payments)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/atiahans47-stack/autohub.git
cd autohub
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Fapshi Payment Gateway
FAPSHI_API_KEY=your-fapshi-api-key
FAPSHI_MERCHANT_NAME=AUTOHub

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cron Job Secret (optional, for automated booking expiry checks)
CRON_SECRET=your-cron-secret
```

### 4. Set up Supabase Database

Run the SQL migrations in Supabase SQL Editor to create the required tables:

- `profiles` - User accounts
- `cars` - Vehicle inventory
- `bookings` - Rental bookings
- `sales` - Car sales
- `chat_rooms` - Chat session rooms
- `chat_messages` - Chat messages
- `site_content` - CMS content (hero, footer, settings)
- `documents` - File storage (images, logos)

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── cars/          # Car management
│   │   ├── bookings/      # Booking management
│   │   ├── sales/         # Sales management
│   │   ├── users/         # User management
│   │   ├── chat/          # Live chat
│   │   ├── content/       # Content management
│   │   └── analytics/     # Analytics
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── bookings/      # Booking endpoints
│   │   ├── cars/          # Car endpoints
│   │   ├── payments/      # Payment integration
│   │   ├── chat/          # Chat endpoints
│   │   ├── content/       # CMS endpoints
│   │   ├── dashboard/     # Dashboard stats
│   │   └── stats/         # Public statistics
│   ├── auth/              # Authentication pages
│   ├── booking/           # Booking confirmation
│   ├── dashboard/         # User dashboard
│   ├── rent-cars/         # Car rental pages
│   ├── buy-cars/          # Car purchase pages
│   └── page.tsx           # Homepage
├── components/
│   ├── home/              # Homepage components
│   ├── rental/            # Rental-related components
│   ├── auth/              # Authentication components
│   └── ui/                # UI components
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Auth utilities
│   └── fapshi.ts          # Fapshi integration
├── contexts/
│   └── AuthContext.tsx    # Auth context
└── hooks/
    └── useChatInit.ts     # Chat initialization hook
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/[id]` - Get single car
- `POST /api/cars` - Add car (admin)
- `PUT /api/cars/[id]` - Update car (admin)
- `DELETE /api/cars/[id]` - Delete car (admin)

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/[id]` - Update booking status (admin)
- `POST /api/bookings/[id]/return-early` - Return car early (admin)
- `POST /api/bookings/check-expired` - Check and update expired bookings

### Payments
- `POST /api/payments/initiate` - Initiate Fapshi payment

### Chat
- `GET /api/admin/chat` - Get all chat sessions (admin)
- `POST /api/admin/chat/[id]/messages` - Send message (admin)
- `POST /api/admin/chat/[id]/messages/seen` - Mark messages as seen (admin)

### Content Management
- `GET /api/content/[section]` - Get content section
- `PUT /api/content/[section]` - Update content section (admin)
- `POST /api/upload/logo` - Upload logo (admin)
- `POST /api/upload/hero` - Upload hero image (admin)

### Statistics
- `GET /api/stats/users` - Get satisfied customers count
- `GET /api/stats/completed-transactions` - Get completed transactions count
- `GET /api/dashboard/stats` - Get dashboard statistics (admin)

## Database Schema

### profiles
- `id` (UUID, primary key)
- `email` (text, unique)
- `full_name` (text)
- `phone` (text)
- `role` (text: 'customer' | 'admin')
- `is_verified` (boolean)
- `created_at` (timestamp)
- `last_login` (timestamp)

### cars
- `id` (UUID, primary key)
- `name` (text)
- `category` (text)
- `price` (number)
- `deposit` (number)
- `availability` (text: 'Available' | 'Booked' | 'Limited')
- `location` (text)
- `image` (text)
- `description` (text)
- `features` (jsonb)
- `created_at` (timestamp)

### bookings
- `id` (UUID, primary key)
- `customer_id` (UUID, references profiles)
- `car_id` (UUID, references cars)
- `customer_name` (text)
- `customer_email` (text)
- `customer_phone` (text)
- `car_name` (text)
- `start_date` (date)
- `end_date` (date)
- `location` (text)
- `amount` (number)
- `status` (text: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled')
- `payment_status` (text: 'Pending' | 'Paid')
- `created_at` (timestamp)

### chat_rooms
- `id` (UUID, primary key)
- `user_id` (UUID, references profiles)
- `status` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### chat_messages
- `id` (UUID, primary key)
- `room_id` (UUID, references chat_rooms)
- `sender` (text: 'admin' | 'client')
- `message` (text)
- `admin_seen_at` (timestamp)
- `client_seen_at` (timestamp)
- `created_at` (timestamp)

## Key Features Implementation

### Real-time Updates
- Car availability updates via Supabase realtime subscriptions
- Chat messages update in real-time
- Admin dashboard stats refresh automatically

### Payment Flow
1. User selects dates and confirms booking
2. Booking created with status 'Pending'
3. Payment initiated via Fapshi
4. User redirected to Fapshi payment page (new tab)
5. After successful payment, redirected to `/booking/confirmed`
6. Booking status updated to 'Confirmed' and payment_status to 'Paid'
7. Car availability set to 'Booked'

### Booking Expiry
- Cron job or manual check via `/api/bookings/check-expired`
- Expired bookings (past end_date) marked as 'Completed'
- Car availability set back to 'Available'

### Early Returns
- Admin can mark car as returned early via `/api/bookings/[id]/return-early`
- Booking marked as 'Completed'
- Car availability set to 'Available'

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Cron Jobs (Vercel)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/check-expired-bookings",
    "schedule": "0 * * * *"
  }]
}
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Fapshi Documentation](https://fapshi.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## License

This project is proprietary software.
