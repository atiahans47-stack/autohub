'use client';

import { useState, useMemo, useEffect } from 'react';
import BuySearchBar from '@/components/buy/BuySearchBar';
import BuyCarCard from '@/components/buy/BuyCarCard';
import BuyInformation from '@/components/buy/BuyInformation';
import BuyModal from '@/components/buy/BuyModal';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

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
  features: string;
  mileage: number;
  year: number;
  condition: string;
}

interface BuyCarsClientProps {
  categoryParam: string | null;
}

export default function BuyCarsClient({ categoryParam }: BuyCarsClientProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const response = await fetch('/api/cars?type=sale');
      const data = await response.json();
      setCars(data.cars || []);
      setFilteredCars(data.cars || []);
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
      filtered = filtered.filter(car => car.brand === searchParams.brand);
    }

    // Filter by price range
    if (searchParams.priceRange && searchParams.priceRange !== 'All Prices') {
      const [min, max] = searchParams.priceRange.split('-').map(Number);
      filtered = filtered.filter(car => car.price >= min && car.price <= max);
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

    // Filter by year
    if (searchParams.year && searchParams.year !== 'All Years') {
      filtered = filtered.filter(car => car.year === parseInt(searchParams.year));
    }

    // Filter by transmission
    if (searchParams.transmission && searchParams.transmission !== 'All') {
      filtered = filtered.filter(car => car.transmission === searchParams.transmission);
    }

    setFilteredCars(filtered);
  };

  const handleViewDetails = (carId: string) => {
    const car = cars.find((c) => c._id === carId || c.id === carId);
    if (car) {
      setSelectedCar(car);
      window.location.href = `/buy-cars/${carId}`;
    }
  };

  const handleBuyNow = (carId: string) => {
    const car = cars.find((c) => c._id === carId || c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsBuyModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Buy Cars</h1>
            <p className="text-xl text-blue-100">
              Find your perfect vehicle from our extensive collection
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <BuySearchBar onSearch={handleSearch} />

          {/* Cars Grid */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Available Vehicles</h2>
              <span className="text-gray-600">{displayCars.length} vehicles</span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading vehicles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCars.map((car) => (
                  <BuyCarCard
                    key={car._id || car.id}
                    car={{
                      ...car,
                      id: car._id || car.id,
                      deposit: 0,
                      mileageLimit: 0,
                      fuelPolicy: 'Full to Full',
                      returnCondition: 'Same condition',
                      features: car.features 
                        ? (Array.isArray(car.features) ? car.features : car.features.split(',').map(f => f.trim()))
                        : [],
                      availability: car.availability as 'Available' | 'Sold' | 'Reserved',
                    }}
                    onViewDetails={handleViewDetails}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Buy Information Section */}
          <div className="mt-12">
            <BuyInformation />
          </div>
        </div>
      </main>
      <Footer />

      {/* Buy Modal */}
      {selectedCar && (
        <BuyModal
          car={selectedCar}
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
        />
      )}
    </div>
  );
}
