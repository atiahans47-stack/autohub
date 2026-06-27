'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MapPin, Users, Fuel, Settings } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onViewDetails: (carId: string) => void;
  onRentNow: (carId: string) => void;
}

interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  transmission: string;
  fuelType: string;
  seats: number;
  airConditioning: boolean;
  availability: 'Available' | 'Booked' | 'Limited';
  rating: number;
  reviews: number;
  location: string;
}

export default function CarCard({ car, onViewDetails, onRentNow }: CarCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Booked':
        return 'bg-red-100 text-red-800';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Vehicle Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(car.availability)}`}>
            {car.availability}
          </span>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="p-5">
        {/* Vehicle Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{car.name}</h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{car.location}</span>
        </div>

        {/* Vehicle Specifications */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{car.seats} Seats</span>
          </div>
          {car.airConditioning && (
            <div className="flex items-center">
              <span>❄️ AC</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">{renderStars(car.rating)}</div>
          <span className="text-sm text-gray-600">
            {car.rating} ({car.reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()}XAF</span>
            <span className="text-gray-600">/day</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(car.id)}
            className="flex-1 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => onRentNow(car.id)}
            disabled={car.availability === 'Booked'}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors duration-300 ${
              car.availability === 'Booked'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {car.availability === 'Booked' ? 'Booked' : 'Rent Now'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
