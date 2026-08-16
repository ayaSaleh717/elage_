import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Stethoscope, CreditCard, User, FileText, Bot, Activity, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const humanHeart = "https://scwzacvwp7mrajkx.public.blob.vercel-storage.com/assests/hm.png";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/patient" },
  { icon: <Bot className="w-4 h-4" />, label: "استشارة ذكية", path: "/patient/ai-consultation" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "استشاراتي", path: "/patient/consultations" },
  // { icon: <FileText className="w-4 h-4" />, label: "السجل الطبي", path: "/patient/records" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/patient/profile" },
];

const PatientDashboard = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalConsultations: 0,
    balance: 0,
    medicalReports: 0,
    upcomingAppointments: 0,
    lastConsultations: [],
    consultationStats: [
      { name: "مكتملة", value: 0, color: "#10b981" },
      { name: "قيد الانتظار", value: 0, color: "#f59e0b" },
      { name: "ملغاة", value: 0, color: "#ef4444" },
    ]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.getPatientDashboard();
        if (response.success && response.data) {
          const data = response.data;
          
          // Calculate consultation stats from last_consultations
          const consultations = data.last_consultations || [];
          const completed = consultations.filter((c: any) => c.status === "مكتملة").length;
          const pending = consultations.filter((c: any) => c.status === "قيد الانتظار").length;
          const cancelled = consultations.filter((c: any) => c.status === "ملغاة").length;

          setDashboardData({
            totalConsultations: consultations.length || 0,
            balance: data.balance || 0,
            medicalReports: data.medical_reports || 0,
            upcomingAppointments: pending, // Count consultations with status "قيد الانتظار"
            lastConsultations: consultations,
            consultationStats: [
              { name: "مكتملة", value: completed, color: "#10b981" },
              { name: "قيد الانتظار", value: pending, color: "#f59e0b" },
              { name: "ملغاة", value: cancelled, color: "#ef4444" },
            ]
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="لوحة تحكم المريض" items={sidebarItems} role="patient">
      <Outlet />

      {location.pathname === "/patient" && (
        <div className="space-y-6">

          {/* Welcome + Image Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-3 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-2xl p-6 border border-primary/10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">مرحباً بك 👋</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                تابع حالتك الصحية واحجز استشاراتك بسهولة من هنا.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/ai-consultation">
                  <Button className="rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 gap-2">
                    <Bot className="w-4 h-4" />
                    استشارة ذكية
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5">
                    <Stethoscope className="w-4 h-4" />
                    حجز موعد
                  </Button>
                </Link>
              </div>
            </div>

            {/* Human Body Image */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative">
              <div className="relative">
                <img
                  src={humanHeart}
                  alt="جسم الإنسان"
                  className="w-[200px] h-auto object-contain animate-float drop-shadow-xl"
                />
                {/* Pulse ring */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-[180px] h-[180px] rounded-full border-2 border-dashed border-primary/20 animate-[spin_15s_linear_infinite]" />
                </div>
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : dashboardData.totalConsultations}</p>
              <p className="text-xs text-muted-foreground mt-1">إجمالي الاستشارات</p>
            </div>
            {/* <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : `${dashboardData.balance} ر.س`}</p>
              <p className="text-xs text-muted-foreground mt-1">الرصيد المتاح</p>
            </div> */}
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : dashboardData.medicalReports}</p>
              <p className="text-xs text-muted-foreground mt-1">التقارير الطبية</p>
            </div>
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : dashboardData.upcomingAppointments}</p>
              <p className="text-xs text-muted-foreground mt-1">مواعيد قادمة</p>
            </div>
          </div>

          {/* Chart + Recent Consultations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut Chart */}
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-foreground text-sm">توزيع الاستشارات</h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={dashboardData.consultationStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {dashboardData.consultationStats.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-3">
                {dashboardData.consultationStats.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="lg:col-span-2 bg-card dark:bg-slate-800/50 rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-foreground text-sm">آخر الاستشارات</h3>
                </div>
                <Link to="/patient/consultations" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                  عرض الكل
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.lastConsultations.length > 0 ? (
                  dashboardData.lastConsultations.map((consultation: any) => (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 dark:bg-slate-700/30 border border-transparent hover:border-primary/15 hover:bg-muted/60 dark:hover:bg-slate-700/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{consultation.doctor_name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{consultation.doctor_specialization} • {consultation.date} • {consultation.start_time}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${
                        consultation.status === "مكتملة"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : consultation.status === "قيد الانتظار"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                      }`}>
                        {consultation.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد استشارات سابقة</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
        

        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
