import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Stethoscope, CreditCard, User, FileText, Bot, Activity, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import data from "./data.json";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import humanHeart from "@/assests/hm.png";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/patient" },
  { icon: <Bot className="w-4 h-4" />, label: "استشارة ذكية", path: "/patient/ai-consultation" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "استشاراتي", path: "/patient/consultations" },
  { icon: <FileText className="w-4 h-4" />, label: "السجل الطبي", path: "/patient/records" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/patient/profile" },
];

const consultationData = [
  { name: "مكتملة", value: 10, color: "#10b981" },
  { name: "قيد الانتظار", value: 3, color: "#f59e0b" },
  { name: "ملغاة", value: 2, color: "#ef4444" },
];

const PatientDashboard = () => {
  const location = useLocation();

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">15</p>
              <p className="text-xs text-muted-foreground mt-1">إجمالي الاستشارات</p>
            </div>
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">350 ر.س</p>
              <p className="text-xs text-muted-foreground mt-1">الرصيد المتاح</p>
            </div>
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground mt-1">التقارير الطبية</p>
            </div>
            <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">3</p>
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
                    data={consultationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {consultationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-3">
                {consultationData.map((item, i) => (
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
                {data.consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 dark:bg-slate-700/30 border border-transparent hover:border-primary/15 hover:bg-muted/60 dark:hover:bg-slate-700/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{consultation.doctor}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{consultation.specialty} • {consultation.date}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${
                      consultation.status === "مكتملة"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}>
                      {consultation.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/ai-consultation" className="group">
              <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:border-teal-300 dark:hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-sm font-bold text-foreground">استشارة ذكية</p>
                <p className="text-[11px] text-muted-foreground mt-1">تشخيص أولي بالذكاء الاصطناعي</p>
              </div>
            </Link>
            <Link to="/doctors" className="group">
              <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-bold text-foreground">حجز استشارة</p>
                <p className="text-[11px] text-muted-foreground mt-1">اختر طبيبك المفضل</p>
              </div>
            </Link>
            <div className="group cursor-pointer">
              <div className="bg-card dark:bg-slate-800/50 rounded-2xl p-5 border border-border/50 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-foreground">شحن الرصيد</p>
                <p className="text-[11px] text-muted-foreground mt-1">أضف رصيداً لحسابك</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
