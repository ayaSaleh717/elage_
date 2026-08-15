import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, TrendingUp, Calendar, Activity, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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







const DoctorDashboard = () => {
  const [animatedStats, setAnimatedStats] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedStats(true), 100);
    const timer2 = setTimeout(() => setChartVisible(true), 400);
    
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.getDoctorDashboard();
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setDashboardData(null);
        }
      } catch (err: any) {
        setError(err.message || "فشل تحميل الإحصائيات");
        console.error("Failed to fetch dashboard data:", err);
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Transform API data to chart format
  const weeklyData = dashboardData?.weekly_consultations ? 
    dashboardData.weekly_consultations.labels.map((label: string, index: number) => ({
      day: label === 'Sat' ? 'السبت' : 
           label === 'Sun' ? 'الأحد' : 
           label === 'Mon' ? 'الاثنين' : 
           label === 'Tue' ? 'الثلاثاء' : 
           label === 'Wed' ? 'الأربعاء' : 
           label === 'Thu' ? 'الخميس' : 'الجمعة',
      consultations: dashboardData.weekly_consultations.values[index]
    })) : [];

  // Transform API data to stats format
  const statsData = dashboardData ? [
    { 
      icon: Users, 
      label: "إجمالي المرضى", 
      value: dashboardData.total_patients?.toString() || "0", 
      change: `+${dashboardData.new_patients_this_week || 0} جديد`, 
      color: "from-blue-500 to-sky-400", 
      bgColor: "bg-blue-50 dark:bg-blue-900/20" 
    },
    { 
      icon: Stethoscope, 
      label: "استشارات اليوم", 
      value: dashboardData.consultations_today?.toString() || "0", 
      change: dashboardData.consultations_today_change >= 0 ? 
        `+${dashboardData.consultations_today_change} عن أمس` : 
        `${dashboardData.consultations_today_change} عن أمس`, 
      color: "from-teal-500 to-emerald-400", 
      bgColor: "bg-teal-50 dark:bg-teal-900/20" 
    },
  ] : [];

  return (
    <DashboardLayout title="لوحة تحكم الطبيب" items={sidebarItems} role="doctor">
      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
              <div className="h-6 bg-muted rounded w-1/2 mb-3" />
              <div className="h-8 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group ${
                  animatedStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.change.includes('+') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 
                    'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {/* Decorative gradient */}
                <div className={`absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Donut Chart - Consultation Types */}
        {/* <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 ${
          chartVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-foreground text-sm sm:text-base">توزيع الاستشارات</h3>
              <p className="text-xs text-muted-foreground mt-0.5">حسب نوع الاستشارة</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-1/2 h-[200px] sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consultationTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={400}
                    animationDuration={1200}
                  >
                    {consultationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      direction: "rtl",
                    }}
                    formatter={(value: number) => [`${value}%`, "النسبة"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {consultationTypeData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Bar Chart - Weekly Consultations */}
        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 ${
          chartVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-foreground text-sm sm:text-base">استشارات الأسبوع</h3>
              <p className="text-xs text-muted-foreground mt-0.5">عدد الاستشارات يومياً</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData.length > 0 ? weeklyData : [
                { day: "السبت", consultations: 0 },
                { day: "الأحد", consultations: 0 },
                { day: "الاثنين", consultations: 0 },
                { day: "الثلاثاء", consultations: 0 },
                { day: "الأربعاء", consultations: 0 },
                { day: "الخميس", consultations: 0 },
                { day: "الجمعة", consultations: 0 },
              ]} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    direction: "rtl",
                  }}
                  formatter={(value: number) => [`${value} استشارة`, "العدد"]}
                />
                <Bar 
                  dataKey="consultations" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  animationBegin={600}
                  animationDuration={1000}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

     

      {/* Bottom Section */}
      <div className=" lg:grid-cols-1 gap-4 sm:gap-6">
        {/* Upcoming Consultations */}
        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 delay-200 ${
          chartVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              الاستشارات القادمة
            </h3>
            <span className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">اليوم</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {dashboardData?.upcoming_consultations && dashboardData.upcoming_consultations.length > 0 ? (
              dashboardData.upcoming_consultations.map((apt: any, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="text-xs sm:text-sm font-bold text-primary">{apt.patient_first_name?.charAt(0) || 'P'}</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-foreground">{apt.patient_first_name} {apt.patient_last_name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{apt.start_time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">لا توجد استشارات قادمة</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest Reviews */}
        {/* <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 delay-300 ${
          chartVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
              <span className="text-amber-500">★</span>
              آخر التقييمات
            </h3>
            <span className="text-[10px] text-muted-foreground bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">4.8 متوسط</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {[
              { patient: "خالد محمد", rating: 5, comment: "طبيب ممتاز ومتعاون جداً", time: "منذ ساعة" },
              { patient: "نورة العلي", rating: 4, comment: "تشخيص دقيق وسريع", time: "منذ 3 ساعات" },
              { patient: "أحمد فهد", rating: 5, comment: "أنصح به بشدة", time: "أمس" },
              { patient: "ليلى حسن", rating: 5, comment: "شرح واضح ومفصل", time: "منذ يومين" },
            ].map((review, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{review.patient.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground">{review.patient}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <span key={j} className="text-amber-500 text-[10px]">★</span>
                      ))}
                    </div>
                    <span className="text-[9px] text-muted-foreground mr-1">{review.time}</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground pr-9">{review.comment}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
