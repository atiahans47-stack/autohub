'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { TextInput, SelectInput, TextArea } from "@/components/ui/FormFields";

export default function EditCar() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;
  const hasLoadedData = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'SUVs' as 'SUVs' | 'Sedans' | 'Luxury cars' | 'trucks' | 'Vans',
    type: 'rental' as 'rental' | 'sale',
    price: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: '5',
    availability: 'Available' as 'Available' | 'Booked' | 'Sold',
    location: 'Yaoundé',
    imageFile: null as File | null,
    image: '',
    image2File: null as File | null,
    image2: '',
    image3File: null as File | null,
    image3: '',
    engine: '',
    horsepower: '',
    fuelConsumption: '',
    deposit: '',
    mileageLimit: '',
    fuelPolicy: 'Full to Full',
    returnCondition: 'Same condition as pickup',
    features: '',
    mileage: '',
    year: '',
    condition: 'New' as 'New' | 'Used',
  });

  const loadCarData = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch(`/api/cars/${carId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.error('Error loading car:', data.error);
        return;
      }

      const car = data.car;
      setFormData({
        name: car.name,
        brand: car.brand || 'SUVs',
        type: car.type,
        price: car.price.toString(),
        transmission: car.transmission || 'Automatic',
        fuelType: car.fuel_type || 'Petrol',
        seats: car.seats?.toString() || '5',
        availability: car.availability || 'Available',
        location: car.location || 'Yaoundé',
        imageFile: null,
        image: car.image || '',
        image2File: null,
        image2: car.image2 || '',
        image3File: null,
        image3: car.image3 || '',
        engine: car.engine || '',
        horsepower: car.horsepower?.toString() || '',
        fuelConsumption: car.fuel_consumption || '',
        deposit: car.deposit?.toString() || '',
        mileageLimit: car.mileage_limit?.toString() || '',
        fuelPolicy: car.fuel_policy || 'Full to Full',
        returnCondition: car.return_condition || 'Same condition as pickup',
        features: car.features || '',
        mileage: car.mileage?.toString() || '',
        year: car.year?.toString() || '',
        condition: car.condition || 'New',
      });
    } catch (error) {
      console.error('Error loading car:', error);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    // Load car data from API
    if (!hasLoadedData.current) {
      hasLoadedData.current = true;
      loadCarData();
    }
  }, [router, carId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send data to an API
    console.log('Updating car:', formData);
    alert('Car updated successfully!');
    router.push('/admin/cars');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/cars" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
                <p className="text-sm text-gray-600">Edit vehicle information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Name *</label>
                <TextInput
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Toyota Prado 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand/Category *</label>
                <SelectInput
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  options={[
                    { label: "SUVs", value: "SUVs" },
                    { label: "Sedans", value: "Sedans" },
                    { label: "Luxury cars", value: "Luxury cars" },
                    { label: "trucks", value: "trucks" },
                    { label: "Vans", value: "Vans" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <SelectInput
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { label: "Rental", value: "rental" },
                    { label: "For Sale", value: "sale" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ({formData.type === 'rental' ? 'per day' : 'total'}) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder={formData.type === 'rental' ? 'e.g., 45000' : 'e.g., 35000000'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Images (up to 3)</label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="file"
                      name="imageFile"
                      onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, imageFile: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, image: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview 1" className="w-32 h-24 object-cover rounded" />
                  </div>
                )}
                  </div>
                  <div>
                    <input
                      type="file"
                      name="image2File"
                      onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, image2File: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, image2: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
                {formData.image2 && (
                  <div className="mt-2">
                    <img src={formData.image2} alt="Preview 2" className="w-32 h-24 object-cover rounded" />
                  </div>
                )}
                  </div>
                  <div>
                    <input
                      type="file"
                      name="image3File"
                      onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, image3File: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, image3: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
                {formData.image3 && (
                  <div className="mt-2">
                    <img src={formData.image3} alt="Preview 3" className="w-32 h-24 object-cover rounded" />
                  </div>
                )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <SelectInput
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  options={[
                    { label: "Yaoundé", value: "Yaoundé" },
                    { label: "Douala", value: "Douala" },
                    { label: "Buea", value: "Buea" },
                    { label: "Bamenda", value: "Bamenda" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                <SelectInput
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  options={[
                    { label: "Available", value: "Available" },
                    { label: "Booked", value: "Booked" },
                    { label: "Sold", value: "Sold" }
                  ]}
                />
              </div>
            </div>

            {/* Vehicle Specifications */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Vehicle Specifications</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <SelectInput
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  options={[
                    { label: "Automatic", value: "Automatic" },
                    { label: "Manual", value: "Manual" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <SelectInput
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  options={[
                    { label: "Petrol", value: "Petrol" },
                    { label: "Diesel", value: "Diesel" },
                    { label: "Hybrid", value: "Hybrid" },
                    { label: "Electric", value: "Electric" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engine</label>
                <TextInput
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="e.g., 2.8L 4-Cylinder"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horsepower</label>
                <input
                  type="number"
                  name="horsepower"
                  value={formData.horsepower}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="e.g., 180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Consumption</label>
                <TextInput
                  name="fuelConsumption"
                  value={formData.fuelConsumption}
                  onChange={handleChange}
                  placeholder="e.g., 8.5L/100km"
                />
              </div>
            </div>

            {/* Rental/Sale Specific */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {formData.type === 'rental' ? 'Rental Details' : 'Sale Details'}
              </h2>
              
              {formData.type === 'rental' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deposit (XAF)</label>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g., 300000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage Limit (km)</label>
                    <input
                      type="number"
                      name="mileageLimit"
                      value={formData.mileageLimit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g., 200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Policy</label>
                    <SelectInput
                      name="fuelPolicy"
                      value={formData.fuelPolicy}
                      onChange={handleChange}
                      options={[
                        { label: "Full to Full", value: "Full to Full" },
                        { label: "Same Level", value: "Same Level" }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Condition</label>
                    <TextInput
                      name="returnCondition"
                      value={formData.returnCondition}
                      onChange={handleChange}
                      placeholder="e.g., Same condition as pickup"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km)</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g., 15000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g., 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <SelectInput
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      options={[
                        { label: "New", value: "New" },
                        { label: "Used", value: "Used" }
                      ]}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Features</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                <TextArea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., GPS Navigation, Bluetooth, USB Charging, Backup Camera"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/admin/cars"
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Update Car
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
