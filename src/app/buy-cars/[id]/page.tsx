'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BuyVehicleDetails from '@/components/buy/BuyVehicleDetails';
import BuyModal from '@/components/buy/BuyModal';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const carId = params.id as string;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}`);
        const data = await response.json();

        if (!response.ok) {
          console.error('Error loading car:', data.error);
          return;
        }

        setCar(data.car);
      } catch (error) {
        console.error('Error loading car:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
          <button
            onClick={() => router.push('/buy-cars')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push('/buy-cars');
  };

  const handleBuyNow = () => {
    setIsBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <BuyVehicleDetails
        car={car}
        onBack={handleBack}
        onBuyNow={handleBuyNow}
      />
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        car={car}
      />
      <Footer />
    </div>
  );
}
