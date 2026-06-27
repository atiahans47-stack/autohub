'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Filter, DollarSign, Car } from 'lucide-react';
import { TextInput, SelectInput } from "@/components/ui/FormFields";

export default function SearchBookingSection() {
  const [searchType, setSearchType] = useState<'rental' | 'sales'>('rental');

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Vehicle
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search from our extensive collection of vehicles for rent or purchase
          </p>
        </motion.div>

        {/* Search Type Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-full p-1 shadow-lg inline-flex">
            <button
              onClick={() => setSearchType('rental')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                searchType === 'rental'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rent a Car
            </button>
            <button
              onClick={() => setSearchType('sales')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                searchType === 'sales'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Buy a Car
            </button>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {searchType === 'rental' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pickup Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <TextInput
                  placeholder="Pickup Location"
                  className="pl-10"
                />
              </div>

              {/* Pickup Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              {/* Return Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              {/* Vehicle Type */}
              <div className="relative">
                <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <SelectInput
                  placeholder="Vehicle Type"
                  className="pl-10"
                  options={[
                    { label: "Sedan", value: "sedan" },
                    { label: "SUV", value: "suv" },
                    { label: "Luxury", value: "luxury" },
                    { label: "Truck", value: "truck" },
                    { label: "Van", value: "van" },
                    { label: "Electric", value: "electric" }
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Brand */}
              <div className="relative">
                <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <SelectInput
                  placeholder="Brand"
                  className="pl-10"
                  options={[
                    { label: "Toyota", value: "toyota" },
                    { label: "BMW", value: "bmw" },
                    { label: "Mercedes", value: "mercedes" },
                    { label: "Audi", value: "audi" },
                    { label: "Tesla", value: "tesla" },
                    { label: "Honda", value: "honda" }
                  ]}
                />
              </div>

              {/* Min Price */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min Price"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              {/* Max Price */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <SelectInput
                  placeholder="Category"
                  className="pl-10"
                  options={[
                    { label: "Sedan", value: "sedan" },
                    { label: "SUV", value: "suv" },
                    { label: "Luxury", value: "luxury" },
                    { label: "Truck", value: "truck" },
                    { label: "Van", value: "van" },
                    { label: "Electric", value: "electric" }
                  ]}
                />
              </div>
            </div>
          )}

          {/* Search Button */}
          <motion.div className="mt-8 text-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl inline-flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>{searchType === 'rental' ? 'Search Rentals' : 'Search Vehicles for Sale'}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
