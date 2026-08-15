import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Search, Phone, Mail, Calendar, ChevronLeft, AlertCircle } from "lucide-react";
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

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  age: number;
  gender: string | null;
  blood_type: string | null;
  visits_count: number;
  last_visit_date: string;
  last_visit_time: string;
  last_visit_duration: number;
  last_symptoms: string;
  last_diagnosis: string;
  last_prescription: string;
  next_appointment: string | null | { date: string; time: string };
  visit_history?: Array<{
    id: number;
    date: string;
    time: string;
    duration: number;
    status: string;
    symptoms: string;
    diagnosis: string;
    prescription: string;
  }>;
}




const DoctorPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiService.getDoctorPatients();
        if (response.success && Array.isArray(response.data)) {
          setPatients(response.data);
        } else {
          setPatients([]);
        }
      } catch (err: any) {
        setError(err.message || "فشل تحميل المرضى");
        console.error("Failed to fetch patients:", err);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = async (patient: Patient) => {
    try {
      setIsLoadingDetails(true);
      const response = await apiService.getPatientDetails(patient.id);
      if (response.success && response.data) {
        setSelectedPatient(response.data);
      } else {
        setSelectedPatient(patient);
      }
    } catch (err: any) {
      console.error("Failed to fetch patient details:", err);
      setSelectedPatient(patient);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const patientName = `${patient.first_name} ${patient.last_name}`;
    const matchesSearch = patientName.includes(searchQuery) || 
                          patient.last_symptoms.includes(searchQuery) || 
                          (patient.phone && patient.phone.includes(searchQuery));
    return matchesSearch;
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
          <p className="text-lg sm:text-2xl font-bold text-foreground">{patients.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن مريض (الاسم، الأعراض، الهاتف)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {isLoadingDetails ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">جاري تحميل تفاصيل المريض...</p>
              </div>
            ) : (
              <>
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900 flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-primary">{selectedPatient.first_name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">{selectedPatient.first_name} {selectedPatient.last_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{selectedPatient.age} سنة • {selectedPatient.gender || 'غير محدد'}</span>
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
                    <p className="text-sm font-bold text-foreground">{selectedPatient.blood_type || 'غير محدد'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] text-muted-foreground mb-1">عدد الزيارات</p>
                    <p className="text-sm font-bold text-foreground">{selectedPatient.visits_count} زيارة</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] text-muted-foreground mb-1">آخر زيارة</p>
                    <p className="text-sm font-bold text-foreground">{selectedPatient.last_visit_date}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] text-muted-foreground mb-1">الموعد القادم</p>
                    <p className="text-sm font-bold text-primary">
                      {typeof selectedPatient.next_appointment === 'string' 
                        ? (selectedPatient.next_appointment || 'غير محدد')
                        : (selectedPatient.next_appointment?.date 
                          ? `${selectedPatient.next_appointment.date} ${selectedPatient.next_appointment.time}`
                          : 'غير محدد')
                      }
                    </p>
                  </div>
                </div>

                {/* Symptoms & Diagnosis */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 mb-4">
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-medium mb-1">الأعراض / التشخيص</p>
                  <p className="text-sm font-bold text-foreground mb-1">{selectedPatient.last_symptoms}</p>
                  <p className="text-xs text-muted-foreground">{selectedPatient.last_diagnosis}</p>
                </div>

                {/* Prescription */}
                {selectedPatient.last_prescription && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 mb-4">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mb-1">الوصفة الطبية</p>
                    <p className="text-xs text-muted-foreground">{selectedPatient.last_prescription}</p>
                  </div>
                )}

                {/* Visit History */}
                {selectedPatient.visit_history && selectedPatient.visit_history.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] text-muted-foreground font-medium mb-2">سجل الزيارات</p>
                    <div className="space-y-2">
                      {selectedPatient.visit_history.map((visit) => (
                        <div key={visit.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs font-medium text-foreground">{visit.date}</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              visit.status === 'completed' 
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}>
                              {visit.status === 'completed' ? 'مكتملة' : visit.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mb-1">
                            <span>{visit.time} • {visit.duration} دقيقة</span>
                          </div>
                          <div className="text-xs text-foreground mb-1">
                            <span className="font-medium">الأعراض:</span> {visit.symptoms}
                          </div>
                          <div className="text-xs text-foreground mb-1">
                            <span className="font-medium">التشخيص:</span> {visit.diagnosis}
                          </div>
                          {visit.prescription && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">الوصفة:</span> {visit.prescription}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="flex gap-2">
                  {selectedPatient.phone && (
                    <a href={`tel:${selectedPatient.phone}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl gap-2 text-xs h-10">
                        <Phone className="w-3.5 h-3.5" />
                        اتصال
                      </Button>
                    </a>
                  )}
                  <a href={`mailto:${selectedPatient.email}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl gap-2 text-xs h-10">
                      <Mail className="w-3.5 h-3.5" />
                      بريد إلكتروني
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Patients List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">جاري تحميل المرضى...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا يوجد مرضى مطابقين للبحث</p>
          </div>
        ) : (
          filteredPatients.map((patient, i) => (
            <div
              key={patient.id}
              onClick={() => handlePatientClick(patient)}
              className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm sm:text-base font-bold text-primary">{patient.first_name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{patient.first_name} {patient.last_name}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                      <span>{patient.age} سنة</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-red-500 dark:text-red-400 font-medium">{patient.last_symptoms}</span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="hidden sm:inline">{patient.blood_type || 'غير محدد'}</span>
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
                    <p className="text-xs font-medium text-primary">
                      {typeof patient.next_appointment === 'string' 
                        ? (patient.next_appointment || 'غير محدد')
                        : (patient.next_appointment?.date 
                          ? `${patient.next_appointment.date} ${patient.next_appointment.time}`
                          : 'غير محدد')
                      }
                    </p>
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
