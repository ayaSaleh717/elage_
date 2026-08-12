import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare, Search, Filter, Check, X, Clock, FileText, MapPin, Star, Phone, Mail, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/admin" },
  { icon: <Users className="w-4 h-4" />, label: "المستخدمون", path: "/admin/users" },
  // { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/admin/consultations" },
  { icon: <UserPlus className="w-4 h-4" />, label: "طلبات الانضمام", path: "/admin/requests" },
  { icon: <CreditCard className="w-4 h-4" />, label: "المدفوعات", path: "/admin/payments" },
  { icon: <Settings className="w-4 h-4" />, label: "الإعدادات", path: "/admin/settings" },
];

interface JoinRequest {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  documents: string[];
}

const requestsData: JoinRequest[] = [
  {
    id: 1,
    name: "د. عمر السعيد",
    specialty: "طب العيون",
    email: "dr.omar@email.com",
    phone: "+963 944 123 456",
    location: "دمشق",
    experience: "10 سنوات",
    education: "جامعة دمشق - كلية الطب",
    status: "pending",
    submittedDate: "2025-05-12",
    documents: ["شهادة الطب", "رخصة الممارسة", "الهوية"],
  },
  {
    id: 2,
    name: "د. نورة الفهد",
    specialty: "طب الأعصاب",
    email: "dr.noura@email.com",
    phone: "+963 933 987 654",
    location: "الرياض",
    experience: "8 سنوات",
    education: "جامعة الملك سعود - كلية الطب",
    status: "pending",
    submittedDate: "2025-05-13",
    documents: ["شهادة الطب", "رخصة الممارسة"],
  },
  {
    id: 3,
    name: "د. ماجد العتيبي",
    specialty: "جراحة عامة",
    email: "dr.majed@email.com",
    phone: "+963 955 456 789",
    location: "حلب",
    experience: "15 سنوات",
    education: "جامعة حلب - كلية الطب",
    status: "approved",
    submittedDate: "2025-05-10",
    documents: ["شهادة الطب", "رخصة الممارسة", "الهوية", "شهادات التدريب"],
  },
  {
    id: 4,
    name: "د. ليلى حسن",
    specialty: "طب الأطفال",
    email: "dr.laila@email.com",
    phone: "+963 988 321 654",
    location: "اللاذقية",
    experience: "5 سنوات",
    education: "جامعة تشرين - كلية الطب",
    status: "rejected",
    submittedDate: "2025-05-08",
    documents: ["شهادة الطب"],
  },
  {
    id: 5,
    name: "د. أحمد الحسن",
    specialty: "طب القلب",
    email: "dr.ahmed@email.com",
    phone: "+963 944 789 123",
    location: "حمص",
    experience: "12 سنوات",
    education: "جامعة دمشق - كلية الطب",
    status: "pending",
    submittedDate: "2025-05-14",
    documents: ["شهادة الطب", "رخصة الممارسة", "الهوية"],
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  approved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

const AdminRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);

  const filteredRequests = requestsData.filter((request) => {
    const matchesSearch = request.name.includes(searchQuery) || request.specialty.includes(searchQuery) || request.email.includes(searchQuery);
    const matchesStatus = filterStatus === "الكل" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    console.log("Approve request:", id);
  };

  const handleReject = (id: number) => {
    console.log("Reject request:", id);
  };

  return (
    <DashboardLayout title="طلبات الانضمام" items={sidebarItems} role="admin">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">إجمالي الطلبات</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{requestsData.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">قيد المراجعة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{requestsData.filter(r => r.status === "pending").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">مقبولة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{requestsData.filter(r => r.status === "approved").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">مرفوضة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{requestsData.filter(r => r.status === "rejected").length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث (الاسم، التخصص، البريد)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["الكل", "pending", "approved", "rejected"].map((status) => (
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
              {status === "الكل" ? "الكل" : statusLabels[status]}
            </Button>
          ))}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900 flex items-center justify-center shadow-md">
                  <span className="text-base sm:text-lg font-bold text-primary">{selectedRequest.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{selectedRequest.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedRequest.specialty}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-muted-foreground text-lg">✕</button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">التخصص</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.specialty}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">الخبرة</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.experience}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">الموقع</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.location}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">تاريخ التقديم</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.submittedDate}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
              <p className="text-[10px] text-muted-foreground font-medium mb-2">معلومات الاتصال</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  {selectedRequest.email}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  {selectedRequest.phone}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="p-3 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-3">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-1">التعليم</p>
              <p className="text-xs sm:text-sm text-foreground">{selectedRequest.education}</p>
            </div>

            {/* Documents */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-4">
              <p className="text-[10px] text-muted-foreground font-medium mb-2">المستندات المرفقة</p>
              <div className="space-y-1.5">
                {selectedRequest.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                    <FileText className="w-3 h-3 text-primary" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {selectedRequest.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 sm:h-11 text-xs sm:text-sm gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  قبول الطلب
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest.id)}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl h-10 sm:h-11 text-xs sm:text-sm gap-1.5"
                >
                  <X className="w-4 h-4" />
                  رفض الطلب
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <UserPlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا توجد طلبات مطابقة للبحث</p>
          </div>
        ) : (
          filteredRequests.map((request, i) => (
            <div
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm sm:text-base font-bold text-primary">{request.name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{request.name}</p>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        {request.specialty}
                      </span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {request.location}
                      </span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {request.submittedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Star className="w-3 h-3" />
                      <span>الخبرة</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{request.experience}</p>
                  </div>
                  {request.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}
                        className="rounded-lg h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleReject(request.id); }}
                        className="rounded-lg h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminRequests;
