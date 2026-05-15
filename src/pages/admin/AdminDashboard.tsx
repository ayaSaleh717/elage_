import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare } from "lucide-react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/admin" },
  { icon: <Users className="w-4 h-4" />, label: "المستخدمون", path: "/admin/users" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/admin/consultations" },
  { icon: <UserPlus className="w-4 h-4" />, label: "طلبات الانضمام", path: "/admin/requests" },
  { icon: <CreditCard className="w-4 h-4" />, label: "المدفوعات", path: "/admin/payments" },
  { icon: <Settings className="w-4 h-4" />, label: "الإعدادات", path: "/admin/settings" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="لوحة تحكم المسؤول" items={sidebarItems} role="admin">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-medical-blue" />}
          label="إجمالي المستخدمين"
          value="2,450"
          change="12% هذا الشهر"
          colorClass="bg-medical-blue-light"
        />
        <StatCard
          icon={<Stethoscope className="w-6 h-6 text-medical-teal" />}
          label="الأطباء النشطون"
          value="185"
          change="8 جدد"
          colorClass="bg-medical-teal-light"
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-medical-green" />}
          label="الاستشارات اليوم"
          value="67"
          change="23% زيادة"
          colorClass="bg-medical-green-light"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6 text-medical-orange" />}
          label="الإيرادات الشهرية"
          value="45,200 ر.س"
          change="15% نمو"
          colorClass="bg-medical-orange-light"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-foreground mb-4">آخر طلبات الانضمام</h3>
          <div className="space-y-3">
            {[
              { name: "د. عمر السعيد", specialty: "طب العيون", status: "قيد المراجعة" },
              { name: "د. نورة الفهد", specialty: "طب الأعصاب", status: "قيد المراجعة" },
              { name: "د. ماجد العتيبي", specialty: "جراحة عامة", status: "مقبول" },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{req.name}</p>
                  <p className="text-xs text-muted-foreground">{req.specialty}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  req.status === "مقبول" ? "bg-medical-green-light text-medical-green" : "bg-medical-orange-light text-medical-orange"
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-foreground mb-4">آخر الاستشارات</h3>
          <div className="space-y-3">
            {[
              { patient: "محمد أحمد", doctor: "د. سارة العلي", time: "منذ 5 دقائق", status: "جارية" },
              { patient: "فاطمة حسن", doctor: "د. أحمد محمد", time: "منذ 15 دقيقة", status: "مكتملة" },
              { patient: "علي خالد", doctor: "د. خالد الحسن", time: "منذ ساعة", status: "مكتملة" },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.patient} ← {c.doctor}</p>
                  <p className="text-xs text-muted-foreground">{c.time}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  c.status === "جارية" ? "bg-medical-blue-light text-medical-blue" : "bg-medical-green-light text-medical-green"
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
