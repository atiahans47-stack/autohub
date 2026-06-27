import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import VehicleCategories from '@/components/home/VehicleCategories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Statistics from '@/components/home/Statistics';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <VehicleCategories />
        <WhyChooseUs />
        <HowItWorks />
        <Testimonials />
        <Statistics />
      </main>
      <Footer />
    </div>
  );
}
