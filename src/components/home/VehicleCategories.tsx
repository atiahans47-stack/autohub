'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Car, Truck, Users, Package, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const categories = [
  {
    id: 1,
    name: 'SUVs',
    icon: Truck,
    description: 'Spacious and versatile',
    color: 'bg-blue-500',
    type: 'SUVs',
  },
  {
    id: 2,
    name: 'Sedans',
    icon: Car,
    description: 'Comfortable and efficient',
    color: 'bg-green-500',
    type: 'Sedans',
  },
  {
    id: 3,
    name: 'Luxury Cars',
    icon: Shield,
    description: 'Premium experience',
    color: 'bg-purple-500',
    type: 'Luxury cars',
  },
  {
    id: 4,
    name: 'Trucks',
    icon: Package,
    description: 'Heavy duty capability',
    color: 'bg-orange-500',
    type: 'trucks',
  },
  {
    id: 5,
    name: 'Vans',
    icon: Users,
    description: 'Group transportation',
    color: 'bg-red-500',
    type: 'Vans',
  },
];

export default function VehicleCategories() {
  const router = useRouter();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        
        if (data.cars) {
          const counts: Record<string, number> = {};
          data.cars.forEach((car: any) => {
            const brand = car.brand || 'Other';
            // Normalize to match category types
            const normalizedBrand = brand.toLowerCase();
            counts[normalizedBrand] = (counts[normalizedBrand] || 0) + 1;
          });
          setCategoryCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (category: typeof categories[0]) => {
    // Navigate to rent-cars page with category filter
    // TODO: Backend API Endpoint: GET /api/cars?category={category.type}&type=rental
    router.push(`/rent-cars?category=${category.type}`);
  };

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vehicle Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of vehicle categories to find your perfect ride
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>

                  {/* Count */}
                  <div className="text-sm font-semibold text-blue-600">
                    {loading ? '...' : `${categoryCounts[category.type] || categoryCounts[category.type.toLowerCase()] || categoryCounts[category.type.toUpperCase()] || 0} vehicles`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Browse All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => router.push('/rent-cars')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Browse All Categories
          </button>
        </motion.div>
      </div>
    </section>
  );
}
