'use client';

import { useState, useMemo, useEffect } from 'react';
import BuySearchBar from '@/components/buy/BuySearchBar';
import CarCard from '@/components/rental/CarCard';
import VehicleDetails from '@/components/rental/VehicleDetails';
import BookingModal from '@/components/rental/BookingModal';
import RentalInformation from '@/components/rental/RentalInformation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { SelectInput } from "@/components/ui/FormFields";
import { supabase } from '@/lib/supabase';

interface Car {
  _id: string;
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  transmission: string;
  fuelType: string;
  seats: number;
  airConditioning: boolean;
  availability: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  images: string[];
  engine: string;
  horsepower: number;
  fuelConsumption: string;
  deposit: number;
  mileageLimit: number;
  fuelPolicy: string;
  returnCondition: string;
  features: string;
}

interface DisplayCar {
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  transmission: string;
  fuelType: string;
  seats: number;
  airConditioning: boolean;
  availability: 'Available' | 'Booked' | 'Limited';
  rating: number;
  reviews: number;
  location: string;
  image: string;
  images: string[];
  engine: string;
  horsepower: number;
  fuelConsumption: string;
  deposit: number;
  mileageLimit: number;
  fuelPolicy: string;
  returnCondition: string;
  features: string[];
}

interface RentCarsClientProps {
  categoryParam: string | null;
}

export default function RentCarsClient({ categoryParam }: RentCarsClientProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isVehicleDetailsOpen, setIsVehicleDetailsOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [sortBy, setSortBy] = useState('price-low');

  useEffect(() => {
    loadCars();
  }, []);

  // Realtime subscription for car availability changes
  useEffect(() => {
    const channel = supabase
      .channel('cars-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cars',
        },
        (payload) => {
          // Update the specific car in the list
          setCars(prevCars => 
            prevCars.map(car => 
              car.id === payload.new.id 
                ? { ...car, availability: payload.new.availability }
                : car
            )
          );
          setFilteredCars(prevFiltered => 
            prevFiltered.map(car => 
              car.id === payload.new.id 
                ? { ...car, availability: payload.new.availability }
                : car
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      // Filter for rental cars on client side (cars with daily pricing)
      const rentalCars = (data.cars || []).filter((car: any) => {
        // Assume rental cars have prices under 500K XAF (daily rates)
        // or have specific rental-related fields
        return car.price < 500000 || car.type === 'rent';
      });
      setCars(rentalCars);
      setFilteredCars(rentalCars);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply category filter from URL on mount
  const filteredByCategory = useMemo(() => {
    if (categoryParam && categoryParam !== 'all') {
      let filtered = [...cars];
      filtered = filtered.filter(car => {
        const carBrand = (car.brand || '').toLowerCase();
        const categoryType = categoryParam.toLowerCase();
        
        // Match by brand field (case-insensitive)
        if (carBrand === categoryType) return true;
        
        // Fallback logic for backward compatibility
        if (categoryType === 'suvs') return carBrand === 'suvs' || car.seats >= 7;
        if (categoryType === 'sedans') return carBrand === 'sedans' || car.seats === 5;
        if (categoryType === 'luxury cars') return carBrand === 'luxury cars' || car.price > 100000;
        if (categoryType === 'trucks') return carBrand === 'trucks' || car.name.toLowerCase().includes('truck');
        if (categoryType === 'vans') return carBrand === 'vans' || car.seats >= 7;
        
        return false;
      });
      return filtered;
    }
    return cars;
  }, [categoryParam, cars]);

  // Use filteredByCategory if category is set, otherwise use filteredCars from search/filter
  const displayCars = categoryParam ? filteredByCategory : filteredCars;

  const handleSearch = (searchParams: {
    search: string;
    brand: string;
    priceRange: string;
    vehicleType: string;
    year: string;
    transmission: string;
  }) => {
    let filtered = [...cars];

    // Filter by search term
    if (searchParams.search) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchParams.search.toLowerCase())
      );
    }

    // Filter by brand
    if (searchParams.brand && searchParams.brand !== 'All Brands') {
      filtered = filtered.filter(car =>
        car.brand === searchParams.brand
      );
    }

    // Filter by price range
    if (searchParams.priceRange && searchParams.priceRange !== 'All Prices') {
      const rangeStr = searchParams.priceRange.replace(' XAF', '');
      if (rangeStr.includes('+')) {
        const min = parseInt(rangeStr.replace('K', '000').replace('M', '000000'));
        filtered = filtered.filter(car => car.price >= min);
      } else {
        const [minStr, maxStr] = rangeStr.split('-');
        const min = parseInt(minStr.replace('K', '000').replace('M', '000000'));
        const max = parseInt(maxStr.replace('K', '000').replace('M', '000000'));
        filtered = filtered.filter(car => car.price >= min && car.price <= max);
      }
    }

    // Filter by vehicle type
    if (searchParams.vehicleType && searchParams.vehicleType !== 'All Types') {
      filtered = filtered.filter(car => {
        const type = searchParams.vehicleType.toLowerCase();
        if (type === 'suv') return car.seats >= 7;
        if (type === 'sedan') return car.seats === 5;
        if (type === 'luxury') return car.brand === 'Luxury';
        if (type === 'economy') return car.brand === 'Economy';
        if (type === 'premium') return car.brand === 'Premium';
        if (type === 'sports') return car.brand === 'Sports';
        if (type === 'compact') return car.brand === 'Compact';
        if (type === 'truck') return car.name.toLowerCase().includes('truck') || car.name.toLowerCase().includes('f-150');
        return true;
      });
    }

    // Filter by transmission
    if (searchParams.transmission && searchParams.transmission !== 'All') {
      filtered = filtered.filter(car =>
        car.transmission.toLowerCase() === searchParams.transmission.toLowerCase()
      );
    }

    setFilteredCars(filtered);
  };

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    const sorted = [...filteredCars];

    switch (sortValue) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    setFilteredCars(sorted);
  };

  const handleViewDetails = (carId: string) => {
    const car = cars.find((c) => c._id === carId || c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsVehicleDetailsOpen(true);
    }
  };

  const handleRentNow = (carId: string) => {
    const car = cars.find((c) => c._id === carId || c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsBookingModalOpen(true);
    }
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
          {/* Search Bar */}
          <BuySearchBar onSearch={handleSearch} isRentals={true} />

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cars */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cars
                </h2>
                <SelectInput
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  options={[
                    { label: "Sort by: Price (Low to High)", value: "price-low" },
                    { label: "Sort by: Price (High to Low)", value: "price-high" },
                    { label: "Sort by: Rating", value: "rating" },
                    { label: "Sort by: Newest", value: "newest" }
                  ]}
                />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading cars...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayCars.map((car) => (
                      <CarCard
                        key={car._id || car.id}
                        car={{
                          ...car,
                          id: car._id || car.id,
                          availability: car.availability as 'Available' | 'Booked' | 'Limited',
                          features: Array.isArray(car.features)
                            ? car.features
                            : car.features
                              ? car.features.split(',').map((f: string) => f.trim()).filter(Boolean)
                              : [],
                        } as DisplayCar}
                        onViewDetails={handleViewDetails}
                        onRentNow={handleRentNow}
                      />
                    ))}
                  </div>

                  {displayCars.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No cars found matching your criteria.</p>
                      <button
                        onClick={() => setFilteredCars(cars)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Rental Information Section */}
          <RentalInformation />
        </div>
      </main>

      <Footer />

      {/* Vehicle Details Modal */}
      {selectedCar && (
        <VehicleDetails
          car={{
            ...selectedCar,
            id: selectedCar._id || selectedCar.id,
            availability: selectedCar.availability as 'Available' | 'Booked' | 'Limited',
            features: Array.isArray(selectedCar.features)
              ? selectedCar.features
              : selectedCar.features
                ? selectedCar.features.split(',').map((f: string) => f.trim()).filter(Boolean)
                : [],
          }}
          isOpen={isVehicleDetailsOpen}
          onClose={() => setIsVehicleDetailsOpen(false)}
          onBook={handleRentNow}
        />
      )}

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          car={{
            ...selectedCar,
            id: selectedCar._id || selectedCar.id,
            availability: selectedCar.availability as 'Available' | 'Booked' | 'Limited',
            features: Array.isArray(selectedCar.features)
              ? selectedCar.features
              : selectedCar.features
                ? selectedCar.features.split(',').map((f: string) => f.trim()).filter(Boolean)
                : [],
          } as DisplayCar}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookVehicle}
        />
      )}
    </div>
  );
}
