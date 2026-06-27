'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FiltersSidebarProps {
  onFilterChange: (filters: FilterParams) => void;
}

interface FilterParams {
  priceRange: [number, number];
  brands: string[];
  transmission: string[];
  fuelType: string[];
  seatingCapacity: string[];
}

const brands = ['Toyota', 'BMW', 'Mercedes', 'Honda', 'Ford', 'Audi', 'Volkswagen', 'Nissan'];
const transmissionOptions = ['Automatic', 'Manual'];
const fuelTypeOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const seatingOptions = ['2 seats', '4 seats', '5 seats', '7 seats', '8 seats'];

export default function FiltersSidebar({ onFilterChange }: FiltersSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({
    priceRange: [20, 300],
    brands: [],
    transmission: [],
    fuelType: [],
    seatingCapacity: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    transmission: true,
    fuel: true,
    seats: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    setFilters({ ...filters, priceRange: newPriceRange });
    onFilterChange({ ...filters, priceRange: newPriceRange });
  };

  const handleCheckboxChange = (
    category: keyof FilterParams,
    value: string
  ) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    setFilters({ ...filters, [category]: newValues });
    onFilterChange({ ...filters, [category]: newValues });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [20, 300],
      brands: [],
      transmission: [],
      fuelType: [],
      seatingCapacity: [],
    });
    onFilterChange({
      priceRange: [20, 300],
      brands: [],
      transmission: [],
      fuelType: [],
      seatingCapacity: [],
    });
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Price Range */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-semibold text-gray-900">Price Range</h3>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      ${filters.priceRange[0]}/day — ${filters.priceRange[1]}/day
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('brand')}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-semibold text-gray-900">Brand</h3>
                {expandedSections.brand ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.brand && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleCheckboxChange('brands', brand)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transmission */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('transmission')}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-semibold text-gray-900">Transmission</h3>
                {expandedSections.transmission ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.transmission && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {transmissionOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.transmission.includes(option)}
                          onChange={() => handleCheckboxChange('transmission', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fuel Type */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('fuel')}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-semibold text-gray-900">Fuel Type</h3>
                {expandedSections.fuel ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.fuel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {fuelTypeOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fuelType.includes(option)}
                          onChange={() => handleCheckboxChange('fuelType', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Seating Capacity */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('seats')}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-semibold text-gray-900">Seating Capacity</h3>
                {expandedSections.seats ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.seats && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {seatingOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.seatingCapacity.includes(option)}
                          onChange={() => handleCheckboxChange('seatingCapacity', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
