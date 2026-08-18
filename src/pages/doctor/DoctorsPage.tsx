import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import DoctorsMap from "@/components/DoctorsMap";
import {
  Star,
  MapPin,
  Search,
  Map,
  Grid3X3,
  Heart,
  Baby,
  Users,
  Stethoscope,
  Eye,
  Brain,
  Scissors,
  UserRound,
  CalendarCheck,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, Doctor } from "@/services/api";

const specialtyIcons: Record<string, React.ReactNode> = {
  "طب القلب": <Heart className="w-5 h-5" />,
  "طب الأطفال": <Baby className="w-5 h-5" />,
  "طب الأسرة": <Users className="w-5 h-5" />,
  "الأمراض الجلدية": <Stethoscope className="w-5 h-5" />,
  "طب العيون": <Eye className="w-5 h-5" />,
  "طب الأعصاب": <Brain className="w-5 h-5" />,
  "جراحة عامة": <Scissors className="w-5 h-5" />,
  "أمراض نساء": <UserRound className="w-5 h-5" />,
};

const DoctorsPage = () => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [locationNames, setLocationNames] = useState<Record<number, string>>({});
  const [doctorAvailability, setDoctorAvailability] = useState<Record<number, boolean>>({});

  const fetchLocationName = async (lat: number, lng: number, doctorId: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'ar'
          }
        }
      );
      const data = await response.json();

      if (data.address) {
        const addr = data.address;
        const country = addr.country || "";
        const city = addr.city || addr.town || addr.village || addr.state || "";
        const street = addr.road || addr.street || "";

        const locationParts = [country, city, street].filter(Boolean);
        const formattedLocation = locationParts.join(' - ');

        if (formattedLocation) {
          setLocationNames(prev => ({ ...prev, [doctorId]: formattedLocation }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch location name:", err);
    }
  };

  const checkDoctorAvailability = async (doctorId: number) => {
    try {
      const response = await apiService.getDoctorBookingInfo(doctorId);
      if (response.success && response.data) {
        const days = response.data;
        // Check if any day is open and has available slots
        const hasAvailableSlots = days.some((day: any) => {
          if (day.is_open === 1 && day.slots && day.slots.length > 0) {
            return day.slots.some((slot: any) => slot.is_available === true);
          }
          return false;
        });
        setDoctorAvailability(prev => ({ ...prev, [doctorId]: hasAvailableSlots }));
      }
    } catch (err) {
      console.error("Failed to check doctor availability:", err);
    }
  };

  const specialties = Array.isArray(allDoctors) ? [...new Set(allDoctors.map((d) => d.specialty))] : [];

  const filtered = Array.isArray(allDoctors) ? allDoctors.filter((d) => {
    const matchesSearch =
      d.name.includes(search) || d.specialty.includes(search) || d.location.includes(search);
    const matchesSpecialty = !selectedSpecialty || d.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  }) : [];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiService.getDoctors();
        if (response.success && Array.isArray(response.data)) {
          setAllDoctors(response.data);

          // Fetch location names and check availability for doctors with coordinates
          response.data.forEach((doctor) => {
            if (doctor.lat && doctor.lng) {
              fetchLocationName(doctor.lat, doctor.lng, doctor.id);
            }
            // Check availability based on schedule
            checkDoctorAvailability(doctor.id);
          });
        } else {
          setAllDoctors([]);
        }
      } catch (err: any) {
        setError(err.message || "فشل تحميل الأطباء");
        console.error("Failed to fetch doctors:", err);
        setAllDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">أطباؤنا المتخصصون</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
              اعثر على <span className="text-gradient-primary">طبيبك المناسب</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ابحث عن أفضل الأطباء حسب التخصص أو الموقع واحجز موعدك بسهولة
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-10 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن طبيب، تخصص، أو مدينة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-12 h-12 rounded-xl text-base border-border/60 bg-card shadow-sm focus:shadow-md transition-shadow"
                />
              </div>
              <div className="flex gap-1 bg-card border border-border/60 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    view === "grid"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`p-2.5 rounded-lg transition-all ${
                    view === "map"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Specialty filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setSelectedSpecialty(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedSpecialty
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                الكل
              </button>
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec === selectedSpecialty ? null : spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedSpecialty === spec
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="w-4 h-4">{specialtyIcons[spec] || <Stethoscope className="w-4 h-4" />}</span>
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            {isLoading ? (
              <div className="h-6 bg-muted rounded w-32 animate-pulse" />
            ) : (
              <p className="text-sm text-muted-foreground">
                عرض <span className="font-bold text-foreground">{filtered.length}</span> طبيب
              </p>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-card p-6 space-y-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-10 bg-muted rounded-xl" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-1/4" />
                  </div>
                  <div className="h-10 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Map View */}
          {!isLoading && view === "map" && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-border/60 shadow-card animate-fade-in">
              <DoctorsMap doctors={filtered} />
            </div>
          )}

          {/* Doctor Grid */}
          {!isLoading && view === "grid" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filtered.map((doc, i) => (
                <div
                  key={doc.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-gradient-primary" />

                  <div className="p-6 space-y-4">
                    {/* Avatar & name */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-medical-blue/20 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors shrink-0">
                        <span className="text-xl font-bold text-primary">
                          {doc.name.charAt(3)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-foreground truncate">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                          {/* <span className="text-sm font-semibold text-foreground">{doc.rating}</span> */}
                          {/* <span className="text-xs text-muted-foreground">({doc.reviews} تقييم)</span> */}
                        </div>
                      </div>
                    </div>

                    {/* Specialty with icon */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="text-primary">
                        {specialtyIcons[doc.specialty] || <Stethoscope className="w-5 h-5" />}
                      </div>
                      <span className="text-sm font-medium text-primary">{doc.specialty}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-muted-foreground/70" />
                      <span className="line-clamp-1">
                        {locationNames[doc.id] || doc.location}
                      </span>
                    </div>

                    {/* Price & availability */}
                    <div className="flex items-center justify-between">
                      {/* <span className="text-sm font-bold text-foreground">{doc.price} د.ج</span> */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          doctorAvailability[doc.id] !== false
                            ? "bg-medical-green/10 text-medical-green border border-medical-green/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {doctorAvailability[doc.id] !== false ? "متاح" : "غير متاح"}
                      </span>
                    </div>

                    {/* Book button */}
                    <Link to={`/reservation?doctor=${doc.id}`} className="block">
                      <Button
                        className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
                        disabled={doctorAvailability[doc.id] === false}
                      >
                        <CalendarCheck className="w-4 h-4" />
                        حجز موعد
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-xl">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرّب البحث بكلمات مختلفة أو تغيير الفلتر</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorsPage;
