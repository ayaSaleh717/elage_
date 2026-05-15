import { Star, MapPin, Heart, Baby, Users, Stethoscope, Eye, Brain, Scissors, UserRound, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import doctorsData from "./../data/doctor.json";

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

const DoctorsSection = () => {
  const doctors = doctorsData.doctors;
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          doctors.forEach((_, i) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, i]);
            }, i * 400);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [doctors]);

  return (
    <section id="doctors" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">فريقنا الطبي</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            أطباؤنا <span className="text-gradient-primary">المتميزون</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            نخبة من الأطباء المعتمدين في مختلف التخصصات جاهزون لخدمتك
          </p>
        </div>

        {/* Doctors grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc, i) => (
            <div
              key={doc.id}
              className={`group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-card hover:shadow-elevated transition-all duration-700 hover:-translate-y-2 ${
                visibleCards.includes(i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-primary" />

              <div className="p-6 space-y-4">
                {/* Avatar & name */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-medical-blue/20 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
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
                      <span className="text-sm font-semibold text-foreground">{doc.rating}</span>
                      <span className="text-xs text-muted-foreground">({doc.reviews})</span>
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
                  <span>{doc.location}</span>
                </div>

                {/* Price & availability */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{doc.price} د.ج</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      doc.available
                        ? "bg-medical-green/10 text-medical-green border border-medical-green/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {doc.available ? "متاح" : "غير متاح"}
                  </span>
                </div>

                {/* Book button */}
                <Link to={`/reservation?doctor=${doc.id}`} className="block">
                  <Button
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
                    disabled={!doc.available}
                  >
                    <CalendarCheck className="w-4 h-4" />
                    حجز موعد
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Link to="/doctors">
            <Button size="lg" variant="outline" className="px-10 gap-2 hover:-translate-y-0.5 transition-all">
              عرض جميع الأطباء
              <Stethoscope className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
