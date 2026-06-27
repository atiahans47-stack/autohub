'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Star, MapPin, Calendar, Users, Fuel, Settings, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import ReviewsList from '@/components/reviews/ReviewsList';
import ReviewSubmission from '@/components/reviews/ReviewSubmission';

interface VehicleDetailsProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onBook: (carId: string) => void;
}

interface Car {
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
  availability: 'Available' | 'Booked' | 'Limited';
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
}

export default function VehicleDetails({ car, isOpen, onClose, onBook }: VehicleDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen) return null;

  // Create images array from individual image fields
  const images = [car.image, car.image2, car.image3].filter(Boolean) as string[];

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">{car.name}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Gallery */}
              <div className="mb-6">
                {images.length > 0 ? (
                  <>
                    <div className="relative h-80 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={images[selectedImage]}
                        alt={car.name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative h-20 w-32 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
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
                  </>
                ) : (
                  <div className="h-80 rounded-xl bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Transmission</div>
                    <div className="font-semibold text-gray-900">{car.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Fuel Type</div>
                    <div className="font-semibold text-gray-900">{car.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Seats</div>
                    <div className="font-semibold text-gray-900">{car.seats}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900">{car.location}</div>
                  </div>
                </div>
              </div>

              {/* Full Specifications */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Engine</div>
                    <div className="font-semibold text-gray-900">{car.engine}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Horsepower</div>
                    <div className="font-semibold text-gray-900">{car.horsepower} HP</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Fuel Consumption</div>
                    <div className="font-semibold text-gray-900">{car.fuelConsumption}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Air Conditioning</div>
                    <div className="font-semibold text-gray-900">
                      {car.airConditioning ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Policies */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Policies</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Deposit Required</div>
                      <div className="text-sm text-gray-600">{car.deposit ? `${car.deposit.toLocaleString()}XAF refundable deposit` : 'No deposit required'}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Mileage Limit</div>
                      <div className="text-sm text-gray-600">{car.mileageLimit ? `${car.mileageLimit} km per day included` : 'Unlimited mileage'}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Fuel Policy</div>
                      <div className="text-sm text-gray-600">{car.fuelPolicy}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Return Condition</div>
                      <div className="text-sm text-gray-600">{car.returnCondition}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-6">
                <ReviewsList carId={car.id} key={`reviews-${car.id}`} />
              </div>

              {/* Review Submission */}
              <div className="mb-6">
                <ReviewSubmission 
                  carId={car.id} 
                  carName={car.name}
                  onSuccess={() => {
                    // Force re-render of reviews by updating the key
                    window.location.reload();
                  }}
                />
              </div>

              {/* Price and Booking */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">{car.price.toLocaleString()}XAF</span>
                    <span className="text-gray-600">/day</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Availability</div>
                    <div className={`font-semibold ${
                      car.availability === 'Available' ? 'text-green-600' : 
                      car.availability === 'Booked' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {car.availability}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onBook(car.id)}
                  disabled={car.availability === 'Booked'}
                  className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors duration-300 ${
                    car.availability === 'Booked'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {car.availability === 'Booked' ? 'Currently Booked' : (
                    <>
                      <span>Rent This Car</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
