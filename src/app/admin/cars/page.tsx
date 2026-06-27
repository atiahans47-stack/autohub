'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { SearchInput, SelectInput } from "@/components/ui/FormFields";

interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  type: 'rental' | 'sale';
  transmission: string;
  fuelType: string;
  seats: number;
  availability: 'Available' | 'Booked' | 'Sold';
  location: string;
}

export default function CarManagement() {
  const router = useRouter();
  const hasLoadedData = useRef(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'rental' | 'sale'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);

  const loadCars = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch('/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error loading cars:', data.error);
        return;
      }
      
      const carsData = (data.cars || []).map((car: { id: string; name: string; image: string; price: number; type: 'rental' | 'sale'; transmission: string; fuel_type: string; seats: number; availability: 'Available' | 'Booked' | 'Sold'; location: string }) => ({
        id: car.id,
        name: car.name,
        image: car.image,
        price: car.price,
        type: car.type,
        transmission: car.transmission,
        fuelType: car.fuel_type,
        seats: car.seats,
        availability: car.availability,
        location: car.location,
      }));
      
      setCars(carsData);
    } catch (error) {
      console.error('Error loading cars:', error);
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    // Load cars from API
    if (!hasLoadedData.current) {
      hasLoadedData.current = true;
      loadCars();
    }
  }, [router]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || car.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (carId: string) => {
    setCarToDelete(carId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (carToDelete) {
      try {
        const token = localStorage.getItem('adminSession');
        const response = await fetch(`/api/cars/${carToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setCars(cars.filter(car => car.id !== carToDelete));
          setIsDeleteModalOpen(false);
          setCarToDelete(null);
        } else {
          alert('Failed to delete car');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete car');
      }
    }
  };

  const formatPrice = (price: number, type: 'rental' | 'sale') => {
    if (type === 'rental') {
      return `${price.toLocaleString()} XAF/day`;
    }
    return `${price.toLocaleString()} XAF`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
                <p className="text-sm text-gray-600">Manage your vehicle inventory</p>
              </div>
            </div>
            <Link
              href="/admin/cars/add"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Car
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <SelectInput
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'rental' | 'sale')}
                options={[
                  { label: "All Cars", value: "all" },
                  { label: "Rental Cars", value: "rental" },
                  { label: "Cars for Sale", value: "sale" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory ({filteredCars.length} cars)
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Car</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{car.name}</p>
                            <p className="text-sm text-gray-600">{car.transmission} • {car.fuelType} • {car.seats} seats</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          car.type === 'rental' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {car.type === 'rental' ? 'Rental' : 'Sale'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {formatPrice(car.price, car.type)}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{car.location}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          car.availability === 'Available' ? 'bg-green-100 text-green-800' :
                          car.availability === 'Booked' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {car.availability}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/cars/edit/${car.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No cars found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this car? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
