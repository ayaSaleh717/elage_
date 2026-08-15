import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare } from "lucide-react";
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

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    consultations_today: 0,
    active_doctors: 0,
    total_users: 0,
    latest_consultations: [],
    latest_join_requests: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getAdminStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "مقبول" || status === "completed" || status === "booked") {
      return "bg-medical-green-light text-medical-green";
    } else if (status === "قيد المراجعة" || status === "pending") {
      return "bg-medical-orange-light text-medical-orange";
    } else if (status === "جارية") {
      return "bg-medical-blue-light text-medical-blue";
    } else if (status === "cancelled") {
      return "bg-red-100 text-red-700";
    }
    return "bg-muted text-muted-foreground";
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      "pending": "قيد المراجعة",
      "booked": "محجوز",
      "completed": "مكتملة",
      "cancelled": "ملغاة"
    };
    return statusMap[status] || status;
  };

  return (
    <DashboardLayout title="لوحة تحكم المسؤول" items={sidebarItems} role="admin">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-medical-blue" />}
          label="إجمالي المستخدمين"
          value={isLoading ? "-" : stats.total_users.toString()}
          change=""
          colorClass="bg-medical-blue-light"
        />
        <StatCard
          icon={<Stethoscope className="w-6 h-6 text-medical-teal" />}
          label="الأطباء النشطون"
          value={isLoading ? "-" : stats.active_doctors.toString()}
          change=""
          colorClass="bg-medical-teal-light"
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-medical-green" />}
          label="الاستشارات اليوم"
          value={isLoading ? "-" : stats.consultations_today.toString()}
          change=""
          colorClass="bg-medical-green-light"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6 text-medical-orange" />}
          label="الإيرادات الشهرية"
          value="-"
          change=""
          colorClass="bg-medical-orange-light"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-foreground mb-4">آخر طلبات الانضمام</h3>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">جاري التحميل...</div>
            ) : stats.latest_join_requests && stats.latest_join_requests.length > 0 ? (
              stats.latest_join_requests.map((req: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.doctor_name}</p>
                    <p className="text-xs text-muted-foreground">{req.specialization}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
                    {getStatusText(req.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">لا توجد طلبات انضمام</div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-foreground mb-4">آخر الاستشارات</h3>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">جاري التحميل...</div>
            ) : stats.latest_consultations && stats.latest_consultations.length > 0 ? (
              stats.latest_consultations.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.patient_name} ← {c.doctor_name}</p>
                    <p className="text-xs text-muted-foreground">{c.time_ago}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(c.status)}`}>
                    {getStatusText(c.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">لا توجد استشارات</div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
