import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, TrendingUp, TrendingDown, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

const monthlyEarnings = [
  { month: "يناير", amount: 620000 },
  { month: "فبراير", amount: 710000 },
  { month: "مارس", amount: 580000 },
  { month: "أبريل", amount: 890000 },
  { month: "مايو", amount: 850000 },
];

const weeklyEarnings = [
  { day: "السبت", amount: 120000 },
  { day: "الأحد", amount: 80000 },
  { day: "الاثنين", amount: 150000 },
  { day: "الثلاثاء", amount: 100000 },
  { day: "الأربعاء", amount: 180000 },
  { day: "الخميس", amount: 60000 },
  { day: "الجمعة", amount: 0 },
];

const transactions = [
  { id: 1, patient: "محمد سعيد", type: "استشارة فيديو", amount: 50000, date: "2025-05-17", status: "مكتمل" },
  { id: 2, patient: "أمل الرشيد", type: "متابعة", amount: 30000, date: "2025-05-16", status: "مكتمل" },
  { id: 3, patient: "يوسف أحمد", type: "دردشة طبية", amount: 25000, date: "2025-05-16", status: "مكتمل" },
  { id: 4, patient: "سارة خالد", type: "زيارة عيادة", amount: 75000, date: "2025-05-15", status: "مكتمل" },
  { id: 5, patient: "خالد الدمشقي", type: "استشارة فيديو", amount: 50000, date: "2025-05-15", status: "مكتمل" },
  { id: 6, patient: "نورة العلي", type: "دردشة طبية", amount: 25000, date: "2025-05-14", status: "معلق" },
  { id: 7, patient: "فادي الحموي", type: "زيارة عيادة", amount: 75000, date: "2025-05-14", status: "مكتمل" },
  { id: 8, patient: "ليلى حسن", type: "استشارة فيديو", amount: 50000, date: "2025-05-13", status: "ملغاة" },
];

const DoctorEarnings = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const totalMonth = 850000;
  const totalWeek = weeklyEarnings.reduce((a, b) => a + b.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === "معلق").reduce((a, t) => a + t.amount, 0);

  return (
    <DashboardLayout title="الأرباح" items={sidebarItems} role="doctor">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { icon: Wallet, label: "أرباح الشهر", value: `${totalMonth.toLocaleString()} ل.س`, change: "+22%", up: true, color: "from-emerald-500 to-teal-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { icon: CreditCard, label: "أرباح الأسبوع", value: `${totalWeek.toLocaleString()} ل.س`, change: "+15%", up: true, color: "from-blue-500 to-sky-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: TrendingUp, label: "متوسط الاستشارة", value: "45,000 ل.س", change: "+8%", up: true, color: "from-violet-500 to-purple-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
          { icon: Clock, label: "مبالغ معلقة", value: `${pendingAmount.toLocaleString()} ل.س`, change: "1 معاملة", up: false, color: "from-amber-500 to-orange-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
                animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  stat.up ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" : "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
                }`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              <div className={`absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-5`} />
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Monthly Area Chart */}
        <div className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 ${
          animated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">الأرباح الشهرية</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">آخر 5 أشهر</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="h-[180px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEarnings} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px", direction: "rtl" }}
                  formatter={(value: number) => [`${value.toLocaleString()} ل.س`, "الأرباح"]}
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} fill="url(#areaGradient)" animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 ${
          animated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">أرباح الأسبوع</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">التوزيع اليومي</p>
            </div>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="h-[180px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEarnings} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px", direction: "rtl" }}
                  formatter={(value: number) => [`${value.toLocaleString()} ل.س`, "الأرباح"]}
                />
                <Bar dataKey="amount" fill="url(#earningsBarGradient)" radius={[6, 6, 0, 0]} animationDuration={1000} />
                <defs>
                  <linearGradient id="earningsBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-700 delay-200 ${
        animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground text-sm sm:text-base">آخر المعاملات</h3>
          <span className="text-[10px] sm:text-xs text-muted-foreground bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{transactions.length} معاملة</span>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-primary">{tx.patient.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{tx.patient}</p>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    <span>{tx.type}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{tx.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${
                  tx.status === "مكتمل" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                  tx.status === "معلق" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                  "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                  {tx.status}
                </span>
                <span className={`text-xs sm:text-sm font-bold ${tx.status === "ملغاة" ? "text-muted-foreground line-through" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {tx.amount.toLocaleString()} ل.س
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorEarnings;
