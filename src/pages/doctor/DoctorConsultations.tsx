import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Search, Filter, Video, MessageCircle, MapPin, Calendar, CheckCircle2, XCircle, Clock3, Eye } from "lucide-react";
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

interface Consultation {
  id: number;
  patient: string;
  age: number;
  type: "فيديو" | "دردشة" | "زيارة";
  date: string;
  time: string;
  duration: string;
  status: "مكتملة" | "قادمة" | "ملغاة" | "جارية";
  symptoms: string;
  diagnosis: string;
  notes: string;
  prescription: string[];
}

const consultationsData: Consultation[] = [
  {
    id: 1,
    patient: "محمد سعيد",
    age: 45,
    type: "فيديو",
    date: "2025-05-17",
    time: "10:00 ص",
    duration: "25 دقيقة",
    status: "جارية",
    symptoms: "صداع مستمر، دوخة، ارتفاع ضغط الدم",
    diagnosis: "ارتفاع ضغط الدم - المرحلة الثانية",
    notes: "يحتاج متابعة أسبوعية وتعديل الجرعة",
    prescription: ["أملوديبين 5mg", "أسبرين 81mg"],
  },
  {
    id: 2,
    patient: "أمل الرشيد",
    age: 32,
    type: "فيديو",
    date: "2025-05-17",
    time: "11:30 ص",
    duration: "20 دقيقة",
    status: "قادمة",
    symptoms: "عطش شديد، تبول متكرر",
    diagnosis: "سكري النوع الثاني",
    notes: "فحص السكر التراكمي بعد شهر",
    prescription: ["ميتفورمين 500mg"],
  },
  {
    id: 3,
    patient: "يوسف أحمد",
    age: 28,
    type: "دردشة",
    date: "2025-05-17",
    time: "2:00 م",
    duration: "15 دقيقة",
    status: "قادمة",
    symptoms: "عطاس متكرر، حكة في الأنف",
    diagnosis: "حساسية موسمية",
    notes: "تجنب الغبار والأتربة",
    prescription: ["لوراتادين 10mg", "بخاخ أنفي"],
  },
  {
    id: 4,
    patient: "سارة خالد",
    age: 55,
    type: "زيارة",
    date: "2025-05-17",
    time: "3:30 م",
    duration: "30 دقيقة",
    status: "قادمة",
    symptoms: "ألم في الصدر، ضيق تنفس",
    diagnosis: "قصور الشريان التاجي",
    notes: "تخطيط قلب + إيكو عاجل",
    prescription: ["نيتروغليسرين", "كلوبيدوغريل 75mg"],
  },
  {
    id: 5,
    patient: "خالد الفهد",
    age: 38,
    type: "فيديو",
    date: "2025-05-16",
    time: "9:00 ص",
    duration: "20 دقيقة",
    status: "مكتملة",
    symptoms: "ألم أسفل الظهر، تنميل في الرجل",
    diagnosis: "انزلاق غضروفي L4/L5",
    notes: "علاج طبيعي 3 مرات أسبوعياً",
    prescription: ["إيبوبروفين 400mg", "باسط عضلات"],
  },
  {
    id: 6,
    patient: "نورة العلي",
    age: 42,
    type: "دردشة",
    date: "2025-05-16",
    time: "11:00 ص",
    duration: "10 دقائق",
    status: "مكتملة",
    symptoms: "تعب عام، زيادة وزن",
    diagnosis: "قصور الغدة الدرقية",
    notes: "فحص TSH بعد 6 أسابيع",
    prescription: ["ليفوثيروكسين 50mcg"],
  },
  {
    id: 7,
    patient: "فهد العتيبي",
    age: 60,
    type: "زيارة",
    date: "2025-05-15",
    time: "10:30 ص",
    duration: "35 دقيقة",
    status: "مكتملة",
    symptoms: "تورم وألم في المفاصل",
    diagnosis: "التهاب مفاصل روماتويدي",
    notes: "بدء العلاج البيولوجي",
    prescription: ["ميثوتريكسات 15mg أسبوعياً", "فوليك أسيد"],
  },
  {
    id: 8,
    patient: "ليلى حسن",
    age: 25,
    type: "فيديو",
    date: "2025-05-15",
    time: "2:00 م",
    duration: "15 دقيقة",
    status: "ملغاة",
    symptoms: "شحوب، تعب",
    diagnosis: "",
    notes: "المريضة ألغت الموعد",
    prescription: [],
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  "فيديو": <Video className="w-3.5 h-3.5" />,
  "دردشة": <MessageCircle className="w-3.5 h-3.5" />,
  "زيارة": <MapPin className="w-3.5 h-3.5" />,
};

const typeColors: Record<string, string> = {
  "فيديو": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "دردشة": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  "زيارة": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

const statusColors: Record<string, string> = {
  "مكتملة": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  "قادمة": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "ملغاة": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  "جارية": "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400",
};

const statusIcons: Record<string, React.ReactNode> = {
  "مكتملة": <CheckCircle2 className="w-3 h-3" />,
  "قادمة": <Clock3 className="w-3 h-3" />,
  "ملغاة": <XCircle className="w-3 h-3" />,
  "جارية": <Stethoscope className="w-3 h-3" />,
};

const DoctorConsultations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [filterType, setFilterType] = useState<string>("الكل");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const filteredConsultations = consultationsData.filter((c) => {
    const matchesSearch = c.patient.includes(searchQuery) || c.symptoms.includes(searchQuery) || c.diagnosis.includes(searchQuery);
    const matchesStatus = filterStatus === "الكل" || c.status === filterStatus;
    const matchesType = filterType === "الكل" || c.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout title="الاستشارات" items={sidebarItems} role="doctor">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">جارية الآن</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultationsData.filter(c => c.status === "جارية").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock3 className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">قادمة اليوم</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultationsData.filter(c => c.status === "قادمة").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">مكتملة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultationsData.filter(c => c.status === "مكتملة").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">ملغاة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultationsData.filter(c => c.status === "ملغاة").length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث (اسم المريض، الأعراض، التشخيص)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Status Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["الكل", "جارية", "قادمة", "مكتملة", "ملغاة"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg text-[10px] sm:text-xs whitespace-nowrap px-2.5 sm:px-3 h-8 ${
                  filterStatus === status ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {status === "الكل" && <Filter className="w-3 h-3 ml-1" />}
                {status}
              </Button>
            ))}
          </div>
          {/* Type Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["الكل", "فيديو", "دردشة", "زيارة"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={`rounded-lg text-[10px] sm:text-xs whitespace-nowrap px-2.5 sm:px-3 h-8 gap-1 ${
                  filterType === type ? "bg-teal-600 text-white hover:bg-teal-700" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {type !== "الكل" && typeIcons[type]}
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedConsultation(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900 flex items-center justify-center shadow-md">
                  <span className="text-base sm:text-lg font-bold text-primary">{selectedConsultation.patient.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{selectedConsultation.patient}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{selectedConsultation.age} سنة</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusColors[selectedConsultation.status]}`}>
                      {statusIcons[selectedConsultation.status]}
                      {selectedConsultation.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedConsultation(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-muted-foreground text-lg">✕</button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">النوع</p>
                <div className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[selectedConsultation.type]}`}>
                  {typeIcons[selectedConsultation.type]}
                  {selectedConsultation.type}
                </div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">التاريخ</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedConsultation.date}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">المدة</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedConsultation.duration}</p>
              </div>
            </div>

            {/* Symptoms */}
            <div className="p-3 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 mb-3">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mb-1">الأعراض</p>
              <p className="text-xs sm:text-sm text-foreground">{selectedConsultation.symptoms}</p>
            </div>

            {/* Diagnosis */}
            {selectedConsultation.diagnosis && (
              <div className="p-3 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-3">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-1">التشخيص</p>
                <p className="text-xs sm:text-sm font-semibold text-foreground">{selectedConsultation.diagnosis}</p>
              </div>
            )}

            {/* Notes */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
              <p className="text-[10px] text-muted-foreground font-medium mb-1">ملاحظات الطبيب</p>
              <p className="text-xs sm:text-sm text-foreground">{selectedConsultation.notes}</p>
            </div>

            {/* Prescription */}
            {selectedConsultation.prescription.length > 0 && (
              <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mb-2">الوصفة الطبية</p>
                <div className="space-y-1.5">
                  {selectedConsultation.prescription.map((med, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {med}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consultations List */}
      <div className="space-y-3">
        {filteredConsultations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Stethoscope className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا توجد استشارات مطابقة</p>
          </div>
        ) : (
          filteredConsultations.map((consultation, i) => (
            <div
              key={consultation.id}
              onClick={() => setSelectedConsultation(consultation)}
              className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group animate-fade-in-up ${
                consultation.status === "جارية"
                  ? "border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-900/5"
                  : "border-slate-100 dark:border-slate-700 hover:border-primary/30"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm font-bold text-primary">{consultation.patient.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{consultation.patient}</p>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5 shrink-0 ${statusColors[consultation.status]}`}>
                        {statusIcons[consultation.status]}
                        {consultation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${typeColors[consultation.type]}`}>
                        {typeIcons[consultation.type]}
                        {consultation.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {consultation.time}
                      </span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="hidden sm:inline">{consultation.duration}</span>
                    </div>
                    {consultation.diagnosis && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                        <span className="font-medium text-foreground/70">التشخيص:</span> {consultation.diagnosis}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 mr-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                    <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorConsultations;
