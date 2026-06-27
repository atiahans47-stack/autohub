'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: number;
  salePrice: number;
  rating: number;
  image: string;
  available: boolean;
  features: string[];
  isForSale: boolean;
}

export default function FeaturedVehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/cars?limit=6');
        const data = await response.json();
        
        if (data.cars) {
          const formattedVehicles = data.cars.map((car: any) => ({
            id: car.id,
            name: car.name,
            type: car.type,
            price: car.daily_price || car.price,
            salePrice: car.sale_price || car.price,
            rating: car.rating || 4.5,
            image: car.image_url || car.image || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=400&q=80',
            available: car.availability === 'Available',
            features: car.features || ['Automatic'],
            isForSale: car.for_sale || false,
          }));
          setVehicles(formattedVehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleRentNow = () => {
    router.push('/rent-cars');
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    if (vehicle.isForSale) {
      router.push(`/buy-cars/${vehicle.id}`);
    } else {
      router.push(`/rent-cars/${vehicle.id}`);
    }
  };

  const handleBuyNow = (vehicle: Vehicle) => {
    router.push(`/buy-cars/${vehicle.id}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular vehicles available for rent and purchase
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Vehicle Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!vehicle.available && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Unavailable
                  </div>
                )}
                {vehicle.isForSale && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    For Sale
                  </div>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <p className="text-gray-600">{vehicle.type}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{vehicle.rating}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {vehicle.isForSale ? (
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {vehicle.salePrice.toLocaleString()}XAF
                          </p>
                          <p className="text-sm text-gray-600">Purchase Price</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {vehicle.price.toLocaleString()}XAF/day
                          </p>
                          <p className="text-sm text-gray-600">Rental Price</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {vehicle.isForSale ? (
                    <>
                      <button
                        onClick={() => handleBuyNow(vehicle)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleViewDetails(vehicle)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                      >
                        View Details
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleRentNow}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-300 font-medium ${
                          vehicle.available
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!vehicle.available}
                      >
                        Rent Now
                      </button>
                      <button
                        onClick={() => handleViewDetails(vehicle)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                      >
                        View Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
