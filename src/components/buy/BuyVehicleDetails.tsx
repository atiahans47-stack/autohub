'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Star, MapPin, Calendar, Users, Fuel, Settings, Shield, Clock, CheckCircle, Heart, Share2 } from 'lucide-react';
import ReviewsList from '@/components/reviews/ReviewsList';
import ReviewSubmission from '@/components/reviews/ReviewSubmission';

interface BuyVehicleDetailsProps {
  car: {
    id: string;
    name: string;
    image?: string;
    image2?: string;
    image3?: string;
    price: number;
    transmission: string;
    fuelType: string;
    seats: number;
    airConditioning: boolean;
    availability: 'Available' | 'Sold' | 'Reserved';
    rating: number;
    reviews: number;
    location: string;
    engine: string;
    horsepower: number;
    fuelConsumption: string;
    deposit: number;
    mileageLimit: number;
    fuelPolicy: string;
    returnCondition: string;
    features: string[];
    mileage: number;
    year: number;
    condition: string;
    description?: string;
  };
  onBack: () => void;
  onBuyNow: () => void;
}

export default function BuyVehicleDetails({ car, onBack, onBuyNow }: BuyVehicleDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Create images array from individual image fields
  const images = [car.image, car.image2, car.image3].filter(Boolean) as string[];

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: car.name,
        text: `Check out this ${car.name} for ${car.price.toLocaleString()}XAF`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Cars</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavoriteClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <Heart
                  className={`h-6 w-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
              <button
                onClick={handleShareClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <Share2 className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-200">
                {images.length > 0 ? (
                  <Image
                    src={images[selectedImage]}
                    alt={car.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No images available</div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      car.availability === 'Available'
                        ? 'bg-green-500 text-white'
                        : car.availability === 'Sold'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {car.availability}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${car.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Vehicle Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold">{car.rating}</span>
                  <span className="text-gray-600">({car.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{car.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Year</span>
                  </div>
                  <div className="font-semibold text-gray-900">{car.year}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Transmission</span>
                  </div>
                  <div className="font-semibold text-gray-900">{car.transmission}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Fuel className="h-4 w-4" />
                    <span className="text-sm">Fuel Type</span>
                  </div>
                  <div className="font-semibold text-gray-900">{car.fuelType}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Seats</span>
                  </div>
                  <div className="font-semibold text-gray-900">{car.seats}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Engine</div>
                  <div className="font-semibold text-gray-900">{car.engine}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Horsepower</div>
                  <div className="font-semibold text-gray-900">{car.horsepower} HP</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Mileage</div>
                  <div className="font-semibold text-gray-900">{car.mileage.toLocaleString()} km</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Fuel Consumption</div>
                  <div className="font-semibold text-gray-900">{car.fuelConsumption}</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </div>
              )}
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow"
            >
              <ReviewsList carId={car.id} key={`reviews-${car.id}`} />
            </motion.div>

            {/* Review Submission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow"
            >
              <ReviewSubmission 
                carId={car.id} 
                carName={car.name}
                onSuccess={() => {
                  window.location.reload();
                }}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow sticky top-24"
            >
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600">{car.price.toLocaleString()}XAF</div>
                <div className="text-gray-600">Purchase Price</div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Availability</div>
                <div
                  className={`font-semibold ${
                    car.availability === 'Available' ? 'text-green-600' : 
                    car.availability === 'Sold' ? 'text-red-600' : 'text-yellow-600'
                  }`}
                >
                  {car.availability}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={onBuyNow}
                  disabled={car.availability !== 'Available'}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Purchase Policies */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Purchase Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Vehicle Inspection</div>
                      <div className="text-sm text-gray-600">Comprehensive inspection report available</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Warranty</div>
                      <div className="text-sm text-gray-600">3-month warranty included</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Documentation</div>
                      <div className="text-sm text-gray-600">All paperwork handled by us</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
