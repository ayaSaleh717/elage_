import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Search, Filter, MessageCircle, MapPin, Calendar, CheckCircle2, XCircle, Clock3, Eye, AlertCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  // { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  // { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

interface Consultation {
  id: number;
  patient_first_name: string;
  patient_last_name: string;
  status: "مكتملة" | "قادمة" | "ملغاة" | "جارية";
  date: string;
  start_time: string;
  duration: number;
  patient_id?: number;
}





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
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPatientDataModal, setShowPatientDataModal] = useState(false);
  const [selectedConsultationForData, setSelectedConsultationForData] = useState<Consultation | null>(null);
  const [patientDataForm, setPatientDataForm] = useState({
    blood_type: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
    notes: ""
  });
  const [isSavingPatientData, setIsSavingPatientData] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await apiService.getDoctorConsultations();
        if (response.success && Array.isArray(response.data)) {
          setConsultations(response.data);
        } else {
          setConsultations([]);
        }
      } catch (err: any) {
        setError(err.message || "فشل تحميل الاستشارات");
        console.error("Failed to fetch consultations:", err);
        setConsultations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const filteredConsultations = consultations.filter((c) => {
    const patientName = `${c.patient_first_name} ${c.patient_last_name}`;
    const matchesSearch = patientName.includes(searchQuery);
    const matchesStatus = filterStatus === "الكل" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const isConsultationEnded = (consultation: Consultation) => {
    const consultationDateTime = new Date(`${consultation.date}T${consultation.start_time}`);
    const endTime = new Date(consultationDateTime.getTime() + consultation.duration * 60000);
    return new Date() > endTime;
  };

  const handleEnterPatientData = (consultation: Consultation) => {
    setSelectedConsultationForData(consultation);
    setPatientDataForm({
      blood_type: "",
      symptoms: "",
      diagnosis: "",
      prescription: "",
      notes: ""
    });
    setShowPatientDataModal(true);
  };

  const handleSavePatientData = async () => {
    if (!selectedConsultationForData) return;

    try {
      setIsSavingPatientData(true);

      const response = await apiService.completeConsultation(selectedConsultationForData.id, {
        symptoms: patientDataForm.symptoms,
        diagnosis: patientDataForm.diagnosis,
        prescription: patientDataForm.prescription,
        notes: patientDataForm.notes
      });

      if (response.success) {
        // Update consultation status to "مكتملة"
        setConsultations(prev => prev.map(c => 
          c.id === selectedConsultationForData.id 
            ? { ...c, status: "مكتملة" } 
            : c
        ));

        setShowPatientDataModal(false);
        setSelectedConsultationForData(null);
      }
    } catch (error) {
      console.error("Failed to save patient data:", error);
    } finally {
      setIsSavingPatientData(false);
    }
  };

  return (
    <DashboardLayout title="الاستشارات" items={sidebarItems} role="doctor">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">جارية الآن</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultations.filter(c => c.status === "جارية").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock3 className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">قادمة اليوم</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultations.filter(c => c.status === "قادمة").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">مكتملة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultations.filter(c => c.status === "مكتملة").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">ملغاة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{consultations.filter(c => c.status === "ملغاة").length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث (اسم المريض)..."
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
        </div>
      </div>

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedConsultation(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900/30 flex items-center justify-center shadow-md">
                  <span className="text-base sm:text-lg font-bold text-primary">{selectedConsultation.patient_first_name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{selectedConsultation.patient_first_name} {selectedConsultation.patient_last_name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">التاريخ</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedConsultation.date}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">الوقت</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedConsultation.start_time}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center col-span-2">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">المدة</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedConsultation.duration} دقيقة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Data Entry Modal */}
      {showPatientDataModal && selectedConsultationForData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setShowPatientDataModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-2xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div>
                <h3 className="font-bold text-foreground text-base sm:text-lg">إدخال بيانات المريض</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedConsultationForData.patient_first_name} {selectedConsultationForData.patient_last_name} - {selectedConsultationForData.date}
                </p>
              </div>
              <button onClick={() => setShowPatientDataModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-muted-foreground text-lg">✕</button>
            </div>

            {/* Patient Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">فصيلة الدم</p>
                <Input
                  value={patientDataForm.blood_type}
                  onChange={(e) => setPatientDataForm(prev => ({ ...prev, blood_type: e.target.value }))}
                  placeholder="غير محدد"
                  className="h-8 text-xs"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">عدد الزيارات</p>
                <p className="text-sm font-bold text-foreground">1 زيارة</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">آخر زيارة</p>
                <p className="text-sm font-bold text-foreground">{selectedConsultationForData.date}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[10px] text-muted-foreground mb-1">الموعد القادم</p>
                <p className="text-sm font-bold text-primary">غير محدد</p>
              </div>
            </div>

            {/* Symptoms & Diagnosis */}
            <div className="mb-4">
              <p className="text-[10px] text-red-600 dark:text-red-400 font-medium mb-2">الأعراض / التشخيص</p>
              <div className="space-y-2">
                <Input
                  value={patientDataForm.symptoms}
                  onChange={(e) => setPatientDataForm(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="الأعراض"
                  className="text-xs"
                />
                <Input
                  value={patientDataForm.diagnosis}
                  onChange={(e) => setPatientDataForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="التشخيص"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Prescription */}
            <div className="mb-4">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mb-2">الوصفة الطبية</p>
              <Input
                value={patientDataForm.prescription}
                onChange={(e) => setPatientDataForm(prev => ({ ...prev, prescription: e.target.value }))}
                placeholder="الوصفة الطبية"
                className="text-xs"
              />
            </div>

            {/* Notes */}
            <div className="mb-5">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-2">ملاحظات</p>
              <Input
                value={patientDataForm.notes}
                onChange={(e) => setPatientDataForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات إضافية"
                className="text-xs"
              />
            </div>

            {/* Visit History Preview */}
            <div className="mb-5">
              <p className="text-[10px] text-muted-foreground font-medium mb-2">سجل الزيارات</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{selectedConsultationForData.date}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    مكتملة
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-1">
                  <span>{selectedConsultationForData.start_time} • {selectedConsultationForData.duration} دقيقة</span>
                </div>
                {patientDataForm.symptoms && (
                  <div className="text-xs text-foreground mb-1">
                    <span className="font-medium">الأعراض:</span> {patientDataForm.symptoms}
                  </div>
                )}
                {patientDataForm.diagnosis && (
                  <div className="text-xs text-foreground mb-1">
                    <span className="font-medium">التشخيص:</span> {patientDataForm.diagnosis}
                  </div>
                )}
                {patientDataForm.prescription && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">الوصفة:</span> {patientDataForm.prescription}
                  </div>
                )}
                {patientDataForm.notes && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">ملاحظات:</span> {patientDataForm.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSavePatientData}
                disabled={isSavingPatientData}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {isSavingPatientData ? "جاري الحفظ..." : "حفظ وتغيير الحالة إلى مكتملة"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPatientDataModal(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Consultations List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">جاري تحميل الاستشارات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Stethoscope className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا توجد استشارات مطابقة</p>
          </div>
        ) : (
          filteredConsultations.map((consultation, i) => (
            <div
              key={consultation.id}
              className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up ${
                consultation.status === "جارية"
                  ? "border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-900/5"
                  : "border-slate-100 dark:border-slate-700 hover:border-primary/30"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => setSelectedConsultation(consultation)}
                  className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm font-bold text-primary">{consultation.patient_first_name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{consultation.patient_first_name} {consultation.patient_last_name}</p>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5 shrink-0 ${statusColors[consultation.status]}`}>
                        {statusIcons[consultation.status]}
                        {consultation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {consultation.date}
                      </span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {consultation.start_time}
                      </span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="hidden sm:inline">{consultation.duration} دقيقة</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 mr-2 flex gap-2">
                  {isConsultationEnded(consultation) && consultation.status !== "مكتملة" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterPatientData(consultation);
                      }}
                      className="rounded-lg gap-1.5 text-[10px] sm:text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <FileText className="w-3 h-3" />
                      إدخال بيانات
                    </Button>
                  )}
                  <div
                    onClick={() => setSelectedConsultation(consultation)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors cursor-pointer"
                  >
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
