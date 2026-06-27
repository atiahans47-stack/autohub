# AUTOHub Backend API Endpoints

This document outlines all the backend API endpoints that the frontend expects for future development.

## Authentication

### POST /api/auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+237 6XX XXX XXX",
  "password": "password123",
  "address": "Buea, Cameroon"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Cars (Rental)

### GET /api/cars/rental
Get all rental cars with optional filters.

**Query Parameters:**
- `search`: Search by car name
- `brand`: Filter by brand (e.g., "Toyota", "BMW")
- `priceRange`: Price range (e.g., "30000-50000")
- `vehicleType`: Vehicle type (e.g., "suv", "sedan", "luxury", "truck", "van", "electric")
- `year`: Filter by year (e.g., "2024")
- `transmission`: Filter by transmission (e.g., "Automatic", "Manual")
- `category`: Category filter from homepage (e.g., "suv", "sedan", "luxury", "truck", "van", "electric")
- `sortBy`: Sort by (e.g., "price-low", "price-high", "rating", "newest")

**Response:**
```json
{
  "cars": [
    {
      "id": "1",
      "name": "Toyota Prado 2024",
      "image": "https://...",
      "price": 45000,
      "transmission": "Automatic",
      "fuelType": "Diesel",
      "seats": 7,
      "airConditioning": true,
      "availability": "Available",
      "rating": 4.8,
      "reviews": 124,
      "location": "Yaoundé",
      "engine": "2.8L 4-Cylinder",
      "horsepower": 180,
      "fuelConsumption": "8.5L/100km",
      "deposit": 300000,
      "mileageLimit": 200,
      "fuelPolicy": "Full to Full",
      "returnCondition": "Same condition as pickup",
      "images": ["https://...", "https://..."],
      "features": ["GPS Navigation", "Bluetooth", "USB Charging"]
    }
  ]
}
```

### GET /api/cars/rental/:id
Get details of a specific rental car.

**Response:**
```json
{
  "id": "1",
  "name": "Toyota Prado 2024",
  "image": "https://...",
  "price": 45000,
  "transmission": "Automatic",
  "fuelType": "Diesel",
  "seats": 7,
  "airConditioning": true,
  "availability": "Available",
  "rating": 4.8,
  "reviews": 124,
  "location": "Yaoundé",
  "engine": "2.8L 4-Cylinder",
  "horsepower": 180,
  "fuelConsumption": "8.5L/100km",
  "deposit": 300000,
  "mileageLimit": 200,
  "fuelPolicy": "Full to Full",
  "returnCondition": "Same condition as pickup",
  "images": ["https://...", "https://..."],
  "features": ["GPS Navigation", "Bluetooth", "USB Charging"]
}
```

### POST /api/bookings/rental
Create a rental booking.

**Request Body:**
```json
{
  "carId": "1",
  "pickupDate": "2024-06-01",
  "returnDate": "2024-06-07",
  "pickupLocation": "Buea",
  "totalPrice": 315000,
  "insurance": true
}
```

**Response:**
```json
{
  "bookingId": "booking_123",
  "status": "confirmed",
  "message": "Booking confirmed successfully"
}
```

## Cars (Purchase)

### GET /api/cars/sale
Get all cars for sale with optional filters.

**Query Parameters:**
- `search`: Search by car name
- `brand`: Filter by brand (e.g., "Toyota", "BMW")
- `priceRange`: Price range (e.g., "30000000-50000000")
- `vehicleType`: Vehicle type (e.g., "suv", "sedan", "luxury", "truck", "van", "electric")
- `year`: Filter by year (e.g., "2024")
- `transmission`: Filter by transmission (e.g., "Automatic", "Manual")
- `fuelType`: Filter by fuel type (e.g., "Petrol", "Diesel", "Hybrid")
- `condition`: Filter by condition (e.g., "New", "Used")
- `mileage`: Filter by max mileage (e.g., "50000")
- `category`: Category filter from homepage (e.g., "suv", "sedan", "luxury", "truck", "van", "electric")

**Response:**
```json
{
  "cars": [
    {
      "id": "1",
      "name": "Toyota Prado 2024",
      "image": "https://...",
      "price": 35000000,
      "transmission": "Automatic",
      "fuelType": "Diesel",
      "seats": 7,
      "airConditioning": true,
      "availability": "Available",
      "rating": 4.8,
      "reviews": 124,
      "location": "Yaoundé",
      "engine": "2.8L 4-Cylinder",
      "horsepower": 180,
      "fuelConsumption": "8.5L/100km",
      "mileage": 15000,
      "year": 2024,
      "condition": "New",
      "images": ["https://...", "https://..."],
      "features": ["GPS Navigation", "Bluetooth", "USB Charging"]
    }
  ]
}
```

### GET /api/cars/sale/:id
Get details of a specific car for sale.

**Response:**
```json
{
  "id": "1",
  "name": "Toyota Prado 2024",
  "image": "https://...",
  "price": 35000000,
  "transmission": "Automatic",
  "fuelType": "Diesel",
  "seats": 7,
  "airConditioning": true,
  "availability": "Available",
  "rating": 4.8,
  "reviews": 124,
  "location": "Yaoundé",
  "engine": "2.8L 4-Cylinder",
  "horsepower": 180,
  "fuelConsumption": "8.5L/100km",
  "mileage": 15000,
  "year": 2024,
  "condition": "New",
  "images": ["https://...", "https://..."],
  "features": ["GPS Navigation", "Bluetooth", "USB Charging"]
}
```

### POST /api/bookings/purchase
Create a purchase inquiry.

**Request Body:**
```json
{
  "carId": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+237 6XX XXX XXX",
  "message": "I'm interested in this car"
}
```

**Response:**
```json
{
  "inquiryId": "inquiry_123",
  "status": "pending",
  "message": "Inquiry submitted successfully"
}
```

## Contact & Support

### POST /api/contact
Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+237 6XX XXX XXX",
  "subject": "rental",
  "message": "I have a question about..."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Message sent successfully"
}
```

## Categories

### GET /api/categories
Get all vehicle categories.

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "SUVs",
      "type": "suv",
      "description": "Spacious and versatile",
      "count": 45,
      "color": "bg-blue-500"
    },
    {
      "id": 2,
      "name": "Sedans",
      "type": "sedan",
      "description": "Comfortable and efficient",
      "count": 38,
      "color": "bg-green-500"
    },
    {
      "id": 3,
      "name": "Luxury Cars",
      "type": "luxury",
      "description": "Premium experience",
      "count": 22,
      "color": "bg-purple-500"
    },
    {
      "id": 4,
      "name": "Trucks",
      "type": "truck",
      "description": "Heavy duty capability",
      "count": 18,
      "color": "bg-orange-500"
    },
    {
      "id": 5,
      "name": "Vans",
      "type": "van",
      "description": "Group transportation",
      "count": 15,
      "color": "bg-red-500"
    },
    {
      "id": 6,
      "name": "Electric Vehicles",
      "type": "electric",
      "description": "Eco-friendly driving",
      "count": 12,
      "color": "bg-yellow-500"
    }
  ]
}
```

### GET /api/cars?category=:category&type=:type
Get cars by category and type.

**Query Parameters:**
- `category`: Category type (e.g., "suv", "sedan", "luxury", "truck", "van", "electric")
- `type`: Car type (e.g., "rental", "sale")

**Response:**
```json
{
  "cars": [
    {
      "id": "1",
      "name": "Toyota Prado 2024",
      "price": 45000,
      "availability": "Available"
    }
  ]
}
```

## Notes

- All prices are in XAF (Central African Francs)
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Authentication required for booking and purchase endpoints
- Use JWT tokens for authentication
- Include appropriate error handling and validation
- Implement rate limiting for API endpoints
