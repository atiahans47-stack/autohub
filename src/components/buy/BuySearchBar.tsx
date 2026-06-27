'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Search, Filter } from 'lucide-react';
import { SearchInput, SelectInput } from "@/components/ui/FormFields";

interface BuySearchBarProps {
  onSearch: (searchParams: SearchParams) => void;
  priceRanges?: string[];
  isRentals?: boolean;
}

interface SearchParams {
  search: string;
  brand: string;
  priceRange: string;
  vehicleType: string;
  year: string;
  transmission: string;
}

const brands = ['All Brands', 'Toyota', 'BMW', 'Mercedes', 'Honda', 'Ford', 'Audi', 'Porsche'];
const vehicleTypes = ['All Types', 'SUVs', 'Sedans', 'Luxury cars', 'trucks', 'Vans'];
const buyPriceRanges = ['All Prices', '0-10M XAF', '10M-20M XAF', '20M-50M XAF', '50M+ XAF'];
const rentPriceRanges = ['All Prices', '0-50K XAF', '50K-100K XAF', '100K-200K XAF', '200K+ XAF'];
const years = ['All Years', '2024', '2023', '2022', '2021', '2020', '2019'];
const transmissions = ['All', 'Automatic', 'Manual'];

export default function BuySearchBar({ onSearch, priceRanges, isRentals }: BuySearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    search: '',
    brand: 'All Brands',
    priceRange: 'All Prices',
    vehicleType: 'All Types',
    year: 'All Years',
    transmission: 'All',
  });

  const displayPriceRanges = priceRanges || (isRentals ? rentPriceRanges : buyPriceRanges);

  const handleSearch = () => {
    onSearch(searchParams);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Vehicle</label>
          <SearchInput
            placeholder="Search by name or model..."
            value={searchParams.search}
            onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <SelectInput
            value={searchParams.brand}
            onChange={(e) => setSearchParams({ ...searchParams, brand: e.target.value })}
            options={brands.map((brand) => ({ label: brand, value: brand }))}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <SelectInput
            value={searchParams.priceRange}
            onChange={(e) => setSearchParams({ ...searchParams, priceRange: e.target.value })}
            options={displayPriceRanges.map((range) => ({ label: range, value: range }))}
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <SelectInput
            value={searchParams.vehicleType}
            onChange={(e) => setSearchParams({ ...searchParams, vehicleType: e.target.value })}
            options={vehicleTypes.map((type) => ({ label: type, value: type }))}
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <SelectInput
            value={searchParams.year}
            onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
            options={years.map((year) => ({ label: year, value: year }))}
          />
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
          <SelectInput
            value={searchParams.transmission}
            onChange={(e) => setSearchParams({ ...searchParams, transmission: e.target.value })}
            options={transmissions.map((trans) => ({ label: trans, value: trans }))}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center space-x-2 shadow-lg"
        >
          <Search className="h-5 w-5" />
          <span>Find Cars</span>
        </button>
      </div>
    </motion.div>
  );
}
