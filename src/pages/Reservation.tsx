import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Star,
  Heart,
  Baby,
  Users,
  Stethoscope,
  Eye,
  Brain,
  Scissors,
  UserRound,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import doctors from "./../components/data/doctor.json";

const allDoctors = doctors.doctors;

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

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctor");
  const doctor = allDoctors.find((d) => d.id === Number(doctorId));

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-6 animate-fade-in-up max-w-md mx-auto px-4">
            <div className="w-24 h-24 rounded-full bg-medical-green/10 border-2 border-medical-green/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-medical-green" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              تم تأكيد الحجز بنجاح!
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              تم حجز موعدك مع <span className="font-bold text-foreground">{doctor?.name}</span> بتاريخ{" "}
              <span className="font-bold text-foreground">{selectedDate}</span> الساعة{" "}
              <span className="font-bold text-foreground">{selectedTime}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to="/doctors">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="w-4 h-4" />
                  العودة للأطباء
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-primary text-primary-foreground gap-2">
                  الصفحة الرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <CalendarCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">حجز موعد</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              احجز موعدك <span className="text-gradient-primary">الآن</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              اختر الوقت المناسب لك وأكمل بيانات الحجز
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Doctor info card */}
            {doctor && (
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden sticky top-24">
                  <div className="h-2 bg-gradient-primary" />
                  <div className="p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-medical-blue/20 flex items-center justify-center border-3 border-primary/20">
                        <span className="text-3xl font-bold text-primary">
                          {doctor.name.charAt(3)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground">
                          {doctor.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="text-sm font-semibold">{doctor.rating}</span>
                          <span className="text-xs text-muted-foreground">({doctor.reviews} تقييم)</span>
                        </div>
                      </div>
                    </div>

                    {/* Specialty */}
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="text-primary">
                        {specialtyIcons[doctor.specialty] || <Stethoscope className="w-5 h-5" />}
                      </div>
                      <span className="text-sm font-medium text-primary">{doctor.specialty}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">سعر الاستشارة</span>
                        <span className="font-bold text-foreground">{doctor.price} د.ج</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reservation form */}
            <div className={doctor ? "lg:col-span-2" : "lg:col-span-3"}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date selection */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 space-y-4">
                  <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    اختر التاريخ
                  </h3>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="h-12 rounded-xl text-base"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time selection */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 space-y-4">
                  <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    اختر الوقت
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === time
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-muted/50 border border-border/60 text-foreground hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient info */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 space-y-4">
                  <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                    <UserRound className="w-5 h-5 text-primary" />
                    بيانات المريض
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
                      <Input
                        placeholder="أدخل اسمك الكامل"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
                      <Input
                        placeholder="أدخل رقم هاتفك"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">ملاحظات (اختياري)</label>
                    <Textarea
                      placeholder="أضف أي ملاحظات أو أعراض تريد إخبار الطبيب بها..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-xl min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                {/* Summary & Submit */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 space-y-4">
                  <h3 className="font-display font-bold text-foreground">ملخص الحجز</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {doctor && (
                      <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">الطبيب</span>
                        <span className="font-medium text-foreground">{doctor.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">التاريخ</span>
                      <span className="font-medium text-foreground">{selectedDate || "—"}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">الوقت</span>
                      <span className="font-medium text-foreground">{selectedTime || "—"}</span>
                    </div>
                    {doctor && (
                      <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">السعر</span>
                        <span className="font-medium text-foreground">{doctor.price} د.ج</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2 text-base h-14 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                    disabled={!selectedDate || !selectedTime || !patientName || !patientPhone}
                  >
                    <CalendarCheck className="w-5 h-5" />
                    تأكيد الحجز
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reservation;
