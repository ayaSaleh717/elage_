import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare, Search, Filter, Check, X, Clock, FileText, MapPin, Star, Phone, Mail, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/admin" },
  { icon: <Users className="w-4 h-4" />, label: "المستخدمون", path: "/admin/users" },
  // { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/admin/consultations" },
  { icon: <UserPlus className="w-4 h-4" />, label: "طلبات الانضمام", path: "/admin/requests" },
  // { icon: <CreditCard className="w-4 h-4" />, label: "المدفوعات", path: "/admin/payments" },
  { icon: <Settings className="w-4 h-4" />, label: "الإعدادات", path: "/admin/settings" },
];

interface JoinRequest {
  id: number;
  name: string;
  specialization: string;
  sub_specialization: string | null;
  email: string;
  phone: string | null;
  latitude: string | null;
  longitude: string | null;
  experience_years: number;
  languages: string;
  license_number: string;
  degree: string;
  university: string;
  bio: string;
  applied_at: string;
  status: "pending" | "approved" | "rejected";
  profile_image: string | null;
  degree_file: string | null;
}



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
  const [requestsData, setRequestsData] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiService.getJoinRequests();
        console.log('طلبات الانضمام response:', response);
        console.log('طلبات الانضمام data:', response.data);
        if (response.success && response.data) {
          const requests = Array.isArray(response.data) ? response.data : [];
          console.log('Setting requestsData with:', requests);
          setRequestsData(requests);
        }
      } catch (error) {
        console.error("Failed to fetch join requests:", error);
        setRequestsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = Array.isArray(requestsData) ? requestsData.filter((request) => {
    const matchesSearch = request.name.includes(searchQuery) || request.specialization.includes(searchQuery) || request.email.includes(searchQuery);
    const matchesStatus = filterStatus === "الكل" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await apiService.approveJoinRequest(id);
      
      if (response.success) {
        // Update the request status locally
        setRequestsData(prev => prev.map(req => 
          req.id === id ? { ...req, status: "approved" } : req
        ));
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to approve request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await apiService.rejectJoinRequest(id);
      
      if (response.success) {
        // Update the request status locally
        setRequestsData(prev => prev.map(req => 
          req.id === id ? { ...req, status: "rejected" } : req
        ));
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setActionLoading(null);
    }
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
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : requestsData.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">قيد المراجعة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : requestsData.filter(r => r.status === "pending").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">مقبولة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : requestsData.filter(r => r.status === "approved").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">مرفوضة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : requestsData.filter(r => r.status === "rejected").length}</p>
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
                  <p className="text-xs text-muted-foreground">{selectedRequest.specialization}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-muted-foreground text-lg">✕</button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">التخصص</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.specialization}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">سنوات الخبرة</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.experience_years}</p>
              </div>
              {selectedRequest.latitude && selectedRequest.longitude && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">الموقع</p>
                  <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.latitude}, {selectedRequest.longitude}</p>
                </div>
              )}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">تاريخ التقديم</p>
                <p className="text-[10px] sm:text-xs font-bold text-foreground">{selectedRequest.applied_at}</p>
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
                {selectedRequest.phone && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    {selectedRequest.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            {selectedRequest.languages && (
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">اللغات</p>
                <p className="text-xs sm:text-sm text-foreground">{selectedRequest.languages}</p>
              </div>
            )}

            {/* Education */}
            <div className="p-3 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-3">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-1">التعليم</p>
              <p className="text-xs sm:text-sm text-foreground font-bold">{selectedRequest.degree}</p>
              <p className="text-xs sm:text-sm text-foreground">{selectedRequest.university}</p>
            </div>

            {/* License */}
            {selectedRequest.license_number && (
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">رقم الرخصة</p>
                <p className="text-xs sm:text-sm text-foreground">{selectedRequest.license_number}</p>
              </div>
            )}

            {/* Bio */}
            {selectedRequest.bio && (
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">نبذة عن الطبيب</p>
                <p className="text-xs sm:text-sm text-foreground">{selectedRequest.bio}</p>
              </div>
            )}

            {/* Sub-specialization */}
            {selectedRequest.sub_specialization && (
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">التخصص الفرعي</p>
                <p className="text-xs sm:text-sm text-foreground">{selectedRequest.sub_specialization}</p>
              </div>
            )}

            {/* Documents */}
            {selectedRequest.degree_file && (
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-4">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">المستندات المرفقة</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                    <FileText className="w-3 h-3 text-primary" />
                    {selectedRequest.degree_file}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedRequest.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={actionLoading === selectedRequest.id}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 sm:h-11 text-xs sm:text-sm gap-1.5"
                >
                  {actionLoading === selectedRequest.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      قبول الطلب
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={actionLoading === selectedRequest.id}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl h-10 sm:h-11 text-xs sm:text-sm gap-1.5"
                >
                  {actionLoading === selectedRequest.id ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      رفض الطلب
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">جاري تحميل الطلبات...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
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
                        {request.specialization}
                      </span>
                      {request.latitude && request.longitude && (
                        <>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {request.latitude}, {request.longitude}
                          </span>
                        </>
                      )}
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {request.applied_at}
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
                    <p className="text-xs font-medium text-foreground">{request.experience_years} سنة</p>
                  </div>
                  {request.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}
                        disabled={actionLoading === request.id}
                        className="rounded-lg h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {actionLoading === request.id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleReject(request.id); }}
                        disabled={actionLoading === request.id}
                        className="rounded-lg h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                      >
                        {actionLoading === request.id ? (
                          <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
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
