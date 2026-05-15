import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import NewsSection from "@/components/landing/NewsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import DoctorsSection from "@/components/landing/DoctorsSection";
import Footer from "@/components/landing/Footer";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <NewsSection />
      <FeaturesSection />
      <HowItWorks />
      <DoctorsSection />
      <Footer />
    </div>
  );
};

export default Homepage;
