import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Search, Filter, Phone, Mail, Calendar, Activity, ChevronLeft, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "ذكر" | "أنثى";
  phone: string;
  email: string;
  illness: string;
  diagnosis: string;
  lastVisit: string;
  nextAppointment: string;
  status: "مستقر" | "تحت المراقبة" | "حرج" | "متعافي";
  bloodType: string;
  visits: number;
}

const patientsData: Patient[] = [
  {
    id: 1,
    name: "محمد سعيد أحمد",
    age: 45,
    gender: "ذكر",
    phone: "+966 55 123 4567",
    email: "mohammed@email.com",
    illness: "ارتفاع ضغط الدم",
    diagnosis: "ضغط دم مرتفع - المرحلة الثانية",
    lastVisit: "2025-05-10",
    nextAppointment: "2025-05-24",
    status: "تحت المراقبة",
    bloodType: "A+",
    visits: 12,
  },
  {
    id: 2,
    name: "أمل الرشيد",
    age: 32,
    gender: "أنثى",
    phone: "+966 50 987 6543",
    email: "amal@email.com",
    illness: "سكري النوع الثاني",
    diagnosis: "سكري نوع 2 - منتظم بالأدوية",
    lastVisit: "2025-05-12",
    nextAppointment: "2025-05-26",
    status: "مستقر",
    bloodType: "O+",
    visits: 8,
  },
  {
    id: 3,
    name: "يوسف أحمد خالد",
    age: 28,
    gender: "ذكر",
    phone: "+966 54 456 7890",
    email: "yousef@email.com",
    illness: "حساسية موسمية",
    diagnosis: "حساسية أنفية مزمنة",
    lastVisit: "2025-05-14",
    nextAppointment: "2025-06-01",
    status: "متعافي",
    bloodType: "B+",
    visits: 3,
  },
  {
    id: 4,
    name: "سارة خالد العمري",
    age: 55,
    gender: "أنثى",
    phone: "+966 56 321 0987",
    email: "sara@email.com",
    illness: "أمراض القلب",
    diagnosis: "قصور في الشريان التاجي",
    lastVisit: "2025-05-15",
    nextAppointment: "2025-05-20",
    status: "حرج",
    bloodType: "AB+",
    visits: 20,
  },
  {
    id: 5,
    name: "خالد محمد الفهد",
    age: 38,
    gender: "ذكر",
    phone: "+966 55 654 3210",
    email: "khaled@email.com",
    illness: "آلام الظهر المزمنة",
    diagnosis: "انزلاق غضروفي - L4/L5",
    lastVisit: "2025-05-08",
    nextAppointment: "2025-05-22",
    status: "تحت المراقبة",
    bloodType: "O-",
    visits: 6,
  },
  {
    id: 6,
    name: "نورة العلي",
    age: 42,
    gender: "أنثى",
    phone: "+966 50 111 2222",
    email: "noura@email.com",
    illness: "الغدة الدرقية",
    diagnosis: "قصور الغدة الدرقية",
    lastVisit: "2025-05-11",
    nextAppointment: "2025-06-05",
    status: "مستقر",
    bloodType: "A-",
    visits: 10,
  },
  {
    id: 7,
    name: "فهد العتيبي",
    age: 60,
    gender: "ذكر",
    phone: "+966 54 333 4444",
    email: "fahad@email.com",
    illness: "التهاب المفاصل",
    diagnosis: "التهاب مفاصل روماتويدي",
    lastVisit: "2025-05-13",
    nextAppointment: "2025-05-27",
    status: "تحت المراقبة",
    bloodType: "B-",
    visits: 15,
  },
  {
    id: 8,
    name: "ليلى حسن",
    age: 25,
    gender: "أنثى",
    phone: "+966 56 555 6666",
    email: "layla@email.com",
    illness: "فقر الدم",
    diagnosis: "فقر دم بسبب نقص الحديد",
    lastVisit: "2025-05-16",
    nextAppointment: "2025-05-30",
    status: "متعافي",
    bloodType: "O+",
    visits: 4,
  },
];

const statusColors: Record<string, string> = {
  "مستقر": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  "تحت المراقبة": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  "حرج": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  "متعافي": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
};

const DoctorPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch = patient.name.includes(searchQuery) || patient.illness.includes(searchQuery) || patient.phone.includes(searchQuery);
    const matchesFilter = filterStatus === "الكل" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout title="المرضى" items={sidebarItems} role="doctor">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">إجمالي المرضى</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{patientsData.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">تحت المراقبة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{patientsData.filter(p => p.status === "تحت المراقبة").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">حالات حرجة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{patientsData.filter(p => p.status === "حرج").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">متعافين</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{patientsData.filter(p => p.status === "متعافي").length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن مريض (الاسم، المرض، الهاتف)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["الكل", "مستقر", "تحت المراقبة", "حرج", "متعافي"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg text-[10px] sm:text-xs whitespace-nowrap px-3 ${
                filterStatus === status
                  ? "bg-primary text-white"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {status === "الكل" && <Filter className="w-3 h-3 ml-1" />}
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Patient Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900 flex items-center justify-center shadow-md">
                  <span className="text-lg font-bold text-primary">{selectedPatient.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{selectedPatient.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{selectedPatient.age} سنة • {selectedPatient.gender}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[selectedPatient.status]}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Patient Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">فصيلة الدم</p>
                <p className="text-sm font-bold text-foreground">{selectedPatient.bloodType}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">عدد الزيارات</p>
                <p className="text-sm font-bold text-foreground">{selectedPatient.visits} زيارة</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">آخر زيارة</p>
                <p className="text-sm font-bold text-foreground">{selectedPatient.lastVisit}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">الموعد القادم</p>
                <p className="text-sm font-bold text-primary">{selectedPatient.nextAppointment}</p>
              </div>
            </div>

            {/* Illness & Diagnosis */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 mb-4">
              <p className="text-[10px] text-red-600 dark:text-red-400 font-medium mb-1">المرض / التشخيص</p>
              <p className="text-sm font-bold text-foreground mb-1">{selectedPatient.illness}</p>
              <p className="text-xs text-muted-foreground">{selectedPatient.diagnosis}</p>
            </div>

            {/* Contact */}
            <div className="flex gap-2">
              <a href={`tel:${selectedPatient.phone}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl gap-2 text-xs h-10">
                  <Phone className="w-3.5 h-3.5" />
                  اتصال
                </Button>
              </a>
              <a href={`mailto:${selectedPatient.email}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl gap-2 text-xs h-10">
                  <Mail className="w-3.5 h-3.5" />
                  بريد إلكتروني
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Patients List */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا يوجد مرضى مطابقين للبحث</p>
          </div>
        ) : (
          filteredPatients.map((patient, i) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm sm:text-base font-bold text-primary">{patient.name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{patient.name}</p>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[patient.status]}`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                      <span>{patient.age} سنة</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-red-500 dark:text-red-400 font-medium">{patient.illness}</span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="hidden sm:inline">{patient.bloodType}</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>الموعد القادم</span>
                    </div>
                    <p className="text-xs font-medium text-primary">{patient.nextAppointment}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatients;
