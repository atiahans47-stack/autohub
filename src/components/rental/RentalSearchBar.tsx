'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Search, Filter } from 'lucide-react';
import { SelectInput } from "@/components/ui/FormFields";

interface RentalSearchBarProps {
  onSearch: (searchParams: SearchParams) => void;
}

interface SearchParams {
  location: string;
  pickupDate: string;
  returnDate: string;
  carType: string;
}

const locations = ['Yaoundé', 'Douala', 'Buea', 'Bamenda', 'Garoua', 'Kribi'];
const carTypes = ['All Types', 'SUV', 'Sedan', 'Luxury', 'Truck', 'Van'];

export default function RentalSearchBar({ onSearch }: RentalSearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: 'All Types',
  });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <SelectInput
            value={searchParams.location}
            onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            placeholder="Pickup Location"
            className="pl-10"
            options={locations.map((loc) => ({ label: loc, value: loc }))}
          />
        </div>

        {/* Pickup Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={searchParams.pickupDate}
            onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Return Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={searchParams.returnDate}
            onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            min={searchParams.pickupDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Car Type */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <SelectInput
            value={searchParams.carType}
            onChange={(e) => setSearchParams({ ...searchParams, carType: e.target.value })}
            className="pl-10"
            options={carTypes.map((type) => ({ label: type, value: type }))}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 font-semibold"
        >
          <Search className="h-5 w-5" />
          <span>Search Cars</span>
        </button>
      </div>
    </motion.div>
  );
}
