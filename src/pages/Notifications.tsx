import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, MessageSquare, UserCheck, AlertCircle, CheckCircle2, Stethoscope, DollarSign, Trash2, Check, Filter, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  type: "appointment" | "message" | "patient" | "alert" | "system" | "payment";
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
}

const allNotifications: Notification[] = [
  { id: 1, type: "appointment", title: "موعد جديد", message: "محمد سعيد حجز موعد استشارة فيديو يوم الأحد الساعة 10:00 ص", time: "منذ 5 دقائق", date: "اليوم", read: false },
  { id: 2, type: "message", title: "رسالة جديدة", message: "أمل الرشيد أرسلت لك رسالة: 'موعدي القادم يوم الأحد صح؟'", time: "منذ 15 دقيقة", date: "اليوم", read: false },
  { id: 3, type: "patient", title: "مريض جديد", message: "تم تسجيل مريض جديد: يوسف أحمد حسن - حساسية موسمية", time: "منذ ساعة", date: "اليوم", read: false },
  { id: 4, type: "alert", title: "تنبيه طبي عاجل", message: "سارة خالد الشامي - نتائج تحاليل القلب تحتاج مراجعة فورية", time: "منذ ساعتين", date: "اليوم", read: false },
  { id: 5, type: "system", title: "تم تأكيد الموعد", message: "خالد الدمشقي أكد موعده ليوم الخميس الساعة 2:00 م", time: "منذ 3 ساعات", date: "اليوم", read: true },
  { id: 6, type: "message", title: "رسالة جديدة", message: "نورة العلي أرسلت نتائج فحص الغدة الدرقية TSH: 4.8", time: "منذ 4 ساعات", date: "اليوم", read: true },
  { id: 7, type: "payment", title: "دفعة جديدة", message: "تم استلام 50,000 ل.س من محمد سعيد - استشارة فيديو", time: "منذ 5 ساعات", date: "اليوم", read: true },
  { id: 8, type: "appointment", title: "إلغاء موعد", message: "ليلى حسن ألغت موعدها ليوم الثلاثاء الساعة 2:00 م", time: "أمس 4:30 م", date: "أمس", read: true },
  { id: 9, type: "system", title: "تحديث النظام", message: "تم تحديث نظام الاستشارات - ميزات جديدة متاحة", time: "أمس 2:00 م", date: "أمس", read: true },
  { id: 10, type: "alert", title: "تذكير بموعد", message: "لديك 3 مواعيد غداً - تأكد من جاهزيتك", time: "أمس 8:00 م", date: "أمس", read: true },
  { id: 11, type: "patient", title: "تقييم جديد", message: "خالد محمد أعطاك تقييم 5 نجوم: 'طبيب ممتاز ومتعاون'", time: "منذ يومين", date: "منذ يومين", read: true },
  { id: 12, type: "message", title: "رسالة جديدة", message: "فادي الحموي: 'هل يمكنني ممارسة الرياضة مع الانزلاق؟'", time: "منذ يومين", date: "منذ يومين", read: true },
  { id: 13, type: "payment", title: "دفعة جديدة", message: "تم استلام 75,000 ل.س من سارة خالد - زيارة عيادة", time: "منذ يومين", date: "منذ يومين", read: true },
  { id: 14, type: "appointment", title: "موعد جديد", message: "فادي الحموي حجز موعد متابعة يوم السبت القادم", time: "منذ 3 أيام", date: "منذ 3 أيام", read: true },
  { id: 15, type: "system", title: "تقرير أسبوعي", message: "تقرير الأسبوع جاهز: 18 استشارة، 690,000 ل.س أرباح", time: "منذ 3 أيام", date: "منذ 3 أيام", read: true },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  appointment: { icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  message: { icon: MessageSquare, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/30" },
  patient: { icon: UserCheck, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/30" },
  alert: { icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  system: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  payment: { icon: DollarSign, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
};

const typeLabels: Record<string, string> = {
  appointment: "مواعيد",
  message: "رسائل",
  patient: "مرضى",
  alert: "تنبيهات",
  system: "النظام",
  payment: "مدفوعات",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filterType, setFilterType] = useState<string>("الكل");
  const [filterRead, setFilterRead] = useState<string>("الكل");

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = filterType === "الكل" || n.type === filterType;
    const matchesRead = filterRead === "الكل" || (filterRead === "غير مقروء" ? !n.read : n.read);
    return matchesType && matchesRead;
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Group by date
  const grouped = filteredNotifications.reduce((acc, notif) => {
    if (!acc[notif.date]) acc[notif.date] = [];
    acc[notif.date].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="container max-w-4xl flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-base sm:text-lg">الإشعارات</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "لا توجد إشعارات جديدة"}
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
              <ArrowRight className="w-3.5 h-3.5" />
              رجوع
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-4xl px-4 py-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm" className="rounded-lg text-xs gap-1.5 h-8">
                <Check className="w-3.5 h-3.5" />
                تحديد الكل كمقروء
              </Button>
            )}
            <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              {filteredNotifications.length} إشعار
            </span>
          </div>

          {/* Read Filter */}
          <div className="flex gap-1.5">
            {["الكل", "غير مقروء", "مقروء"].map((status) => (
              <Button
                key={status}
                variant={filterRead === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRead(status)}
                className={`rounded-lg text-[10px] sm:text-xs h-7 sm:h-8 px-2.5 ${
                  filterRead === status ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          <Button
            variant={filterType === "الكل" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("الكل")}
            className={`rounded-lg text-[10px] sm:text-xs h-8 px-3 gap-1 whitespace-nowrap ${
              filterType === "الكل" ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <Filter className="w-3 h-3" />
            الكل
          </Button>
          {Object.entries(typeLabels).map(([key, label]) => {
            const config = typeConfig[key];
            const Icon = config.icon;
            return (
              <Button
                key={key}
                variant={filterType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(key)}
                className={`rounded-lg text-[10px] sm:text-xs h-8 px-3 gap-1.5 whitespace-nowrap ${
                  filterType === key ? "bg-primary text-white" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* Notifications List - Grouped by Date */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">لا توجد إشعارات مطابقة</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, notifs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <Clock className="w-3 h-3" />
                    {date}
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  {notifs.map((notif, i) => {
                    const config = typeConfig[notif.type];
                    const Icon = config.icon;
                    return (
                      <div
                        key={notif.id}
                        className={`group relative bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-md animate-fade-in-up ${
                          !notif.read
                            ? "border-primary/30 dark:border-primary/40 bg-primary/[0.02] dark:bg-primary/5"
                            : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                        }`}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs sm:text-sm font-semibold text-foreground">{notif.title}</p>
                                  {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
                              </div>
                              <span className="text-[9px] sm:text-[10px] text-muted-foreground shrink-0 mt-0.5">{notif.time}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-[10px] text-primary hover:underline font-medium flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  تحديد كمقروء
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-[10px] text-red-500 hover:underline font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] px-1.5 py-0.5 rounded-md font-medium ${config.bg} ${config.color}`}>
                          {typeLabels[notif.type]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
