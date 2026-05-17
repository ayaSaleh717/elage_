import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Stethoscope, ChevronLeft, Menu, X, Sun, Moon, Bell, Search, Calendar, MessageSquare, UserCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface SidebarItem {
  icon: ReactNode;
  label: string;
  path: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  items: SidebarItem[];
  role: "admin" | "doctor" | "patient";
}

const roleLabels = {
  admin: "المسؤول",
  doctor: "الطبيب",
  patient: "المريض",
};

const DashboardLayout = ({ children, title, items, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);

  const activeItem = items.find(item => location.pathname === item.path);
  const activeTitle = activeItem ? activeItem.label : title;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, type: "appointment", title: "موعد جديد", message: "محمد سعيد حجز موعد استشارة فيديو", time: "منذ 5 دقائق", read: false, icon: Calendar },
    { id: 2, type: "message", title: "رسالة جديدة", message: "أمل الرشيد أرسلت لك رسالة", time: "منذ 15 دقيقة", read: false, icon: MessageSquare },
    { id: 3, type: "patient", title: "مريض جديد", message: "تم تسجيل مريض جديد: يوسف أحمد", time: "منذ ساعة", read: false, icon: UserCheck },
    { id: 4, type: "alert", title: "تنبيه طبي", message: "سارة خالد - نتائج تحاليل تحتاج مراجعة", time: "منذ ساعتين", read: true, icon: AlertCircle },
    { id: 5, type: "system", title: "تم تأكيد الموعد", message: "خالد الدمشقي أكد موعده ليوم الخميس", time: "منذ 3 ساعات", read: true, icon: CheckCircle2 },
    { id: 6, type: "message", title: "رسالة جديدة", message: "نورة العلي أرسلت نتائج التحاليل", time: "أمس", read: true, icon: MessageSquare },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-[280px] transform transition-all duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      } lg:flex flex-col
        bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl lg:shadow-[4px_0_24px_-6px_rgba(0,0,0,0.05)] dark:lg:shadow-[4px_0_24px_-6px_rgba(0,0,0,0.3)]
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-300">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="font-display font-bold text-[15px] text-slate-800 dark:text-white tracking-tight">i-Shifa</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest">{roleLabels[role]}</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-4 mb-3">القائمة الرئيسية</p>
          {items.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/8 dark:bg-primary/15 text-primary"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-l-full bg-primary shadow-sm shadow-primary/50" />
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 dark:bg-primary/25 text-primary shadow-sm shadow-primary/10"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-700"
                }`}>
                  {item.icon}
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
          <Link
            to="/"
            className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">العودة للرئيسية</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-[70px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="font-display font-bold text-[17px] text-slate-800 dark:text-white truncate">{activeTitle}</h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">لوحة تحكم {roleLabels[role]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span>بحث...</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{unreadCount}</span>
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute left-0 top-full mt-2 w-[320px] sm:w-[380px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden animate-fade-in">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-sm">الإشعارات</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} جديد
                        </span>
                      )}
                    </div>
                    <button className="text-[10px] text-primary hover:underline font-medium">
                      تحديد الكل كمقروء
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-3 p-3 sm:p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer ${
                            !notif.read ? "bg-primary/5 dark:bg-primary/5" : ""
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === "appointment" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                            notif.type === "message" ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" :
                            notif.type === "patient" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" :
                            notif.type === "alert" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                            "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                              <span className="text-[9px] text-muted-foreground shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{notif.message}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center">
                    <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs text-primary hover:underline font-medium">
                      عرض جميع الإشعارات
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
            >
              {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px] text-amber-500" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-slate-500" />
              )}
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* User Avatar */}
            <button className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-xs font-bold text-white">م</span>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">المستخدم</p>
                <p className="text-[10px] text-slate-400">{roleLabels[role]}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
