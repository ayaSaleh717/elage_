import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare, Search, Filter, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Calendar, CheckCircle2, XCircle, Clock, Download, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/admin" },
  { icon: <Users className="w-4 h-4" />, label: "المستخدمون", path: "/admin/users" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/admin/consultations" },
  { icon: <UserPlus className="w-4 h-4" />, label: "طلبات الانضمام", path: "/admin/requests" },
  // { icon: <CreditCard className="w-4 h-4" />, label: "المدفوعات", path: "/admin/payments" },
  { icon: <Settings className="w-4 h-4" />, label: "الإعدادات", path: "/admin/settings" },
];

interface Payment {
  id: number;
  doctor: string;
  patient: string;
  amount: number;
  type: "consultation" | "subscription" | "refund";
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
  method: string;
}

const paymentsData: Payment[] = [
  {
    id: 1,
    doctor: "د. محمد السعيد",
    patient: "أمل الرشيد",
    amount: 50000,
    type: "consultation",
    status: "completed",
    date: "2025-05-17",
    method: "بطاقة ائتمان",
  },
  {
    id: 2,
    doctor: "د. سارة العلي",
    patient: "يوسف أحمد",
    amount: 75000,
    type: "consultation",
    status: "completed",
    date: "2025-05-17",
    method: "تحويل بنكي",
  },
  {
    id: 3,
    doctor: "د. خالد الفهد",
    patient: "نورة العلي",
    amount: 50000,
    type: "consultation",
    status: "pending",
    date: "2025-05-16",
    method: "بطاقة ائتمان",
  },
  {
    id: 4,
    doctor: "د. ماجد العتيبي",
    patient: "فادي الحموي",
    amount: 25000,
    type: "consultation",
    status: "completed",
    date: "2025-05-16",
    method: "محفظة إلكترونية",
  },
  {
    id: 5,
    doctor: "د. ليلى حسن",
    patient: "أحمد الحسن",
    amount: 50000,
    type: "consultation",
    status: "failed",
    date: "2025-05-15",
    method: "بطاقة ائتمان",
  },
  {
    id: 6,
    doctor: "د. عمر السعيد",
    patient: "سارة خالد",
    amount: 50000,
    type: "consultation",
    status: "refunded",
    date: "2025-05-15",
    method: "تحويل بنكي",
  },
  {
    id: 7,
    doctor: "د. نورة الفهد",
    patient: "خالد محمد",
    amount: 300000,
    type: "subscription",
    status: "completed",
    date: "2025-05-14",
    method: "بطاقة ائتمان",
  },
  {
    id: 8,
    doctor: "د. أحمد الحسن",
    patient: "ليلى حسن",
    amount: 75000,
    type: "consultation",
    status: "completed",
    date: "2025-05-14",
    method: "تحويل بنكي",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  failed: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  refunded: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
};

const statusLabels: Record<string, string> = {
  completed: "مكتمل",
  pending: "قيد المعالجة",
  failed: "فشل",
  refunded: "مسترد",
};

const typeLabels: Record<string, string> = {
  consultation: "استشارة",
  subscription: "اشتراك",
  refund: "استرداد",
};

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [filterType, setFilterType] = useState<string>("الكل");

  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch = payment.doctor.includes(searchQuery) || payment.patient.includes(searchQuery);
    const matchesStatus = filterStatus === "الكل" || payment.status === filterStatus;
    const matchesType = filterType === "الكل" || payment.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = paymentsData.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = paymentsData.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = paymentsData.filter(p => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout title="المدفوعات" items={sidebarItems} role="admin">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">إجمالي الإيرادات</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{totalRevenue.toLocaleString()} ل.س</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">قيد المعالجة</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{pendingAmount.toLocaleString()} ل.س</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-slate-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">المستردات</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{refundedAmount.toLocaleString()} ل.س</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">إجمالي المعاملات</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground">{paymentsData.length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث (الطبيب، المريض)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 sm:h-11 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Status Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["الكل", "completed", "pending", "failed", "refunded"].map((status) => (
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
          {/* Type Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["الكل", "consultation", "subscription", "refund"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={`rounded-lg text-[10px] sm:text-xs whitespace-nowrap px-2.5 sm:px-3 h-8 ${
                  filterType === type ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {type === "الكل" ? "الكل" : typeLabels[type]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
          {filteredPayments.length} معاملة
        </span>
        <Button variant="outline" size="sm" className="rounded-lg gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" />
          تصدير التقرير
        </Button>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">لا توجد مدفوعات مطابقة للبحث</p>
          </div>
        ) : (
          filteredPayments.map((payment, i) => (
            <div
              key={payment.id}
              className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{payment.doctor}</p>
                      <span className="text-slate-300 dark:text-slate-600">←</span>
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">{payment.patient}</p>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[payment.status]}`}>
                        {statusLabels[payment.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {payment.date}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{payment.method}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{typeLabels[payment.type]}</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="text-left">
                    <p className={`text-xs sm:text-sm font-bold ${
                      payment.status === "completed" ? "text-emerald-600 dark:text-emerald-400" :
                      payment.status === "failed" ? "text-red-600 dark:text-red-400" :
                      payment.status === "refunded" ? "text-slate-500 dark:text-slate-400 line-through" :
                      "text-amber-600 dark:text-amber-400"
                    }`}>
                      {payment.amount.toLocaleString()} ل.س
                    </p>
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

export default AdminPayments;
