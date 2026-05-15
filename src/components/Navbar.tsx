import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, X, Moon, Sun, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { apiService } from "@/services/api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "doctor") return "/doctor";
    return "/patient";
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-card border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">i-Shifa <br />
            <pre className="text-sm">آي- شفا </pre>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">المميزات</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">كيف يعمل</a>
          <a href="#doctors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">الأطباء</a>
          <a href="#ai" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">الذكاء الاصطناعي</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </button>

          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.first_name || user.name || user.email}
                </span>
              </div>

              {/* Dashboard button */}
              <Link to={getDashboardPath()}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Button>
              </Link>

              {/* Logout button */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">تسجيل الدخول</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">إنشاء حساب</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </button>
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-card border-t p-4 space-y-3 animate-fade-in">
          <a href="#features" className="block py-2 text-sm text-muted-foreground">المميزات</a>
          <a href="#how-it-works" className="block py-2 text-sm text-muted-foreground">كيف يعمل</a>
          <a href="#doctors" className="block py-2 text-sm text-muted-foreground">الأطباء</a>

          {user ? (
            <div className="space-y-3 pt-2 border-t border-border">
              {/* User info */}
              <div className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.first_name || user.name || user.email}
                </span>
              </div>

              <div className="flex gap-2">
                <Link to={getDashboardPath()} className="flex-1">
                  <Button variant="outline" className="w-full gap-1.5" size="sm">
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة التحكم
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">تسجيل الدخول</Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full bg-gradient-primary text-primary-foreground" size="sm">إنشاء حساب</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
