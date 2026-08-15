import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare, Search, Filter, MoreVertical, Shield, Ban, Check, X, Mail, Phone, Calendar, MapPin } from "lucide-react";
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

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "doctor" | "patient" | "admin";
  status: "active" | "suspended" | "pending";
  joined_at: string;
  latitude: string | null;
  longitude: string | null;
  specialization: string | null;
  consultations_count: number | null;
}



const roleColors: Record<string, string> = {
  doctor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  patient: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  admin: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  suspended: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("الكل");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.getAdminUsers();
        console.log('Admin users response:', response);
        console.log('Response data type:', typeof response.data);
        console.log('Response data:', response.data);
        console.log('Is array?', Array.isArray(response.data));
        
        if (response.success && response.data) {
          // Ensure data is an array
          const users = Array.isArray(response.data) ? response.data : [];
          console.log('Setting usersData with:', users);
          setUsersData(users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsersData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(usersData) ? usersData.filter((user) => {
    const matchesSearch = user.name.includes(searchQuery) || user.email.includes(searchQuery) || (user.phone && user.phone.includes(searchQuery));
    const matchesRole = filterRole === "الكل" || user.role === filterRole;
    const matchesStatus = filterStatus === "الكل" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  const roleLabels: Record<string, string> = {
    doctor: "طبيب",
    patient: "مريض",
    admin: "مسؤول",
  };

  const statusLabels: Record<string, string> = {
    active: "نشط",
    suspended: "معلق",
    pending: "قيد الانتظار",
  };

  return (
    <DashboardLayout title="المستخدمون" items={sidebarItems} role="admin">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">إجمالي المستخدمين</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : usersData.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-4 h-4 text-teal-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">الأطباء</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : usersData.filter(u => u.role === "doctor").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">نشطون</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : usersData.filter(u => u.status === "active").length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="w-4 h-4 text-red-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">معلقون</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{isLoading ? "-" : usersData.filter(u => u.status === "suspended").length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث (الاسم، البريد، الهاتف)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Role Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["الكل", "doctor", "patient", "admin"].map((role) => (
              <Button
                key={role}
                variant={filterRole === role ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole(role)}
                className={`rounded-lg text-[10px] sm:text-xs whitespace-nowrap px-2.5 sm:px-3 h-8 ${
                  filterRole === role ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {role === "الكل" && <Filter className="w-3 h-3 ml-1" />}
                {role === "الكل" ? "الكل" : roleLabels[role]}
              </Button>
            ))}
          </div>
          {/* Status Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["الكل", "active", "suspended", "pending"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg text-[10px] sm:text-xs whitespace-nowrap px-2.5 sm:px-3 h-8 ${
                  filterStatus === status ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {status === "الكل" ? "الكل" : statusLabels[status]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">جاري تحميل المستخدمين...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا يوجد مستخدمين مطابقين للبحث</p>
          </div>
        ) : (
          filteredUsers.map((user, i) => (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm sm:text-base font-bold text-primary">{user.name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[user.status]}`}>
                        {statusLabels[user.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        </>
                      )}
                      {user.latitude && user.longitude && (
                        <>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.latitude}, {user.longitude}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  {user.role === "doctor" && (
                    <div className="hidden sm:block text-left">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Stethoscope className="w-3 h-3" />
                        <span>الاستشارات</span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{user.consultations_count || 0}</p>
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>تاريخ الانضمام</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{user.joined_at}</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
