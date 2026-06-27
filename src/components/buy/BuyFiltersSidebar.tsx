'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { SelectInput } from "@/components/ui/FormFields";

interface BuyFiltersSidebarProps {
  onFilterChange: (filters: Filters) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface Filters {
  priceRange: string;
  brand: string;
  fuelType: string;
  transmission: string;
  condition: string;
  vehicleType: string;
  mileage: string;
  year: string;
}

const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: '0 - 10M XAF', value: '0-10000000' },
  { label: '10M - 20M XAF', value: '10000000-20000000' },
  { label: '20M - 50M XAF', value: '20000000-50000000' },
  { label: '50M+ XAF', value: '50000000+' },
];

const brands = ['All Brands', 'Toyota', 'BMW', 'Mercedes', 'Honda', 'Ford', 'Audi', 'Porsche', 'Lexus', 'Nissan'];
const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
const transmissions = ['All', 'Automatic', 'Manual'];
const conditions = ['All', 'New', 'Used', 'Certified Pre-Owned'];
const vehicleTypes = ['All Types', 'SUV', 'Sedan', 'Luxury', 'Sports', 'Truck', 'Van'];
const mileageRanges = ['All', '0-10000 km', '10000-50000 km', '50000-100000 km', '100000+ km'];
const years = ['All Years', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export default function BuyFiltersSidebar({ onFilterChange, isOpen = false, onClose }: BuyFiltersSidebarProps) {
  const [filters, setFilters] = useState<Filters>({
    priceRange: 'all',
    brand: 'All Brands',
    fuelType: 'All',
    transmission: 'All',
    condition: 'All',
    vehicleType: 'All Types',
    mileage: 'All',
    year: 'All Years',
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: 'all',
      brand: 'All Brands',
      fuelType: 'All',
      transmission: 'All',
      condition: 'All',
      vehicleType: 'All Types',
      mileage: 'All',
      year: 'All Years',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <motion.div
        initial={isOpen ? { x: '-100%' } : false}
        animate={isOpen ? { x: 0 } : false}
        transition={{ duration: 0.3 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl lg:shadow-none overflow-y-auto ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </h2>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={filters.priceRange === range.value}
                    onChange={() => handleFilterChange('priceRange', range.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
            <SelectInput
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              options={brands.map((brand) => ({ label: brand, value: brand }))}
            />
          </div>

          {/* Fuel Type */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Fuel Type</h3>
            <div className="space-y-2">
              {fuelTypes.map((fuel) => (
                <label key={fuel} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="fuelType"
                    value={fuel}
                    checked={filters.fuelType === fuel}
                    onChange={() => handleFilterChange('fuelType', fuel)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Transmission</h3>
            <div className="space-y-2">
              {transmissions.map((trans) => (
                <label key={trans} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="transmission"
                    value={trans}
                    checked={filters.transmission === trans}
                    onChange={() => handleFilterChange('transmission', trans)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{trans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    checked={filters.condition === condition}
                    onChange={() => handleFilterChange('condition', condition)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Vehicle Type</h3>
            <div className="space-y-2">
              {vehicleTypes.map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="vehicleType"
                    value={type}
                    checked={filters.vehicleType === type}
                    onChange={() => handleFilterChange('vehicleType', type)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mileage */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Mileage</h3>
            <SelectInput
              value={filters.mileage}
              onChange={(e) => handleFilterChange('mileage', e.target.value)}
              options={mileageRanges.map((range) => ({ label: range, value: range }))}
            />
          </div>

          {/* Year */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Year</h3>
            <SelectInput
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              options={years.map((year) => ({ label: year, value: year }))}
            />
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      </motion.div>
    </>
  );
}
