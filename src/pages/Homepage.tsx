import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import NewsSection from "@/components/landing/NewsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import DoctorsSection from "@/components/landing/DoctorsSection";
import Footer from "@/components/landing/Footer";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const Homepage = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    if (currentUser) {
      setUserRole(currentUser.role);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection userRole={userRole} />
      <NewsSection />
      <FeaturesSection />
      <HowItWorks />
      {userRole !== 'doctor' && <DoctorsSection />}
      <Footer />
    </div>
  );
};

export default Homepage;
