'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Calendar, Users, Fuel, Settings, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import BookingModal from '@/components/rental/BookingModal';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ReviewsList from '@/components/reviews/ReviewsList';
import ReviewSubmission from '@/components/reviews/ReviewSubmission';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}`);
        const data = await response.json();

        if (!response.ok) {
          console.error('Error loading car:', data.error);
          return;
        }

        setCar({
          ...data.car,
          features: Array.isArray(data.car.features)
            ? data.car.features
            : data.car.features
              ? data.car.features.split(',').map((f: string) => f.trim()).filter(Boolean)
              : [],
        });
      } catch (error) {
        console.error('Error loading car:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vehicle details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
              <button
                onClick={() => router.push('/rent-cars')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Rentals
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const handleBookVehicle = (bookingData: { carId: string; pickupDate: string; returnDate: string; pickupLocation: string; totalPrice: number; insurance: boolean }) => {
    console.log('Booking data:', bookingData);
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/rent-cars')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Rentals</span>
          </button>

          {/* Vehicle Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{car.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">{renderStars(car.rating)}</div>
              <span className="text-gray-600">{car.rating} ({car.reviews} reviews)</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{car.location}</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {images.length > 0 ? (
                  <>
                    <div className="relative h-96 rounded-xl overflow-hidden mb-4">
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
                        {images.map((image: string, index: number) => (
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
                  <div className="h-96 rounded-xl bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Transmission</div>
                    <div className="font-semibold text-gray-900">{car.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Fuel Type</div>
                    <div className="font-semibold text-gray-900">{car.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Seats</div>
                    <div className="font-semibold text-gray-900">{car.seats}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900">{car.location}</div>
                  </div>
                </div>
              </motion.div>

              {/* Full Specifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow"
              >
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
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Rental Policies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Policies</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Deposit Required</div>
                      <div className="text-sm text-gray-600">{car.deposit.toLocaleString()}XAF refundable deposit</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Mileage Limit</div>
                      <div className="text-sm text-gray-600">{car.mileageLimit} km per day included</div>
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
              </motion.div>

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-6"
              >
                <ReviewsList carId={carId} />
                <ReviewSubmission carId={carId} carName={car.name} onSuccess={() => {/* Reload reviews */}} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow sticky top-24"
              >
                <div className="mb-6">
                  <div className="text-3xl font-bold text-blue-600">{car.price.toLocaleString()}XAF</div>
                  <div className="text-gray-600">/day</div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Availability</div>
                  <div
                    className={`font-semibold ${
                      car.availability === 'Available' ? 'text-green-600' : 
                      car.availability === 'Booked' ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  >
                    {car.availability}
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  disabled={car.availability === 'Booked'}
                  className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors duration-300 mb-4 ${
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

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600 mb-2">Need help?</div>
                  <button
                    onClick={() => router.push('/support')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Contact our support team
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        car={car}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookVehicle}
      />
    </div>
  );
}
