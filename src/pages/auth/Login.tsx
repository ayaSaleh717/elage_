import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { apiService } from "@/services/api";
import heartbeatVideo from "@/assests/human heartbet.mp4";

const Login = () => {
  const [email, setEmail] = useState("ss@gmail.com");
  const [password, setPassword] = useState("12345");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login({ email, password });

      if (response.success) {
        navigate("/");
      } else {
        setError(response.message || "فشل تسجيل الدخول");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left side - Video with overlay */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heartbeatVideo} type="video/mp4" />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Content on video */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <Link to="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white drop-shadow-lg">i-Shifa</span>
          </Link>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-display font-bold text-white leading-tight">
              صحتك تبدأ
              <br />
              <span className="text-primary">من هنا</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              منصة طبية ذكية تجمعك بأفضل الأطباء وتوفر لك استشارات فورية مدعومة بالذكاء الاصطناعي
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-green animate-pulse" />
                <span className="text-white/50 text-sm">+500 طبيب متصل</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-white/50 text-sm">24/7 متاح</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated red cells on video side */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-3 h-3 rounded-full bg-red-500/40 top-[20%] left-[20%] animate-float" />
          <div className="absolute w-2 h-2 rounded-full bg-red-400/50 top-[40%] left-[60%] animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute w-4 h-4 rounded-full bg-red-500/30 top-[70%] left-[30%] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600/40 top-[55%] left-[75%] animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="absolute w-3.5 h-3.5 rounded-full bg-red-400/35 top-[85%] left-[50%] animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background relative p-6 lg:p-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, hsl(174 62% 40%) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Floating cells on form side */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-32 h-32 rounded-full bg-primary/5 blur-3xl top-[10%] right-[10%]" />
          <div className="absolute w-40 h-40 rounded-full bg-red-500/5 blur-3xl bottom-[10%] left-[10%]" />
        </div>

        <div className="w-full max-w-[420px] relative z-10 space-y-8">
          {/* Mobile logo */}
          <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">i-Shifa</span>
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              تسجيل الدخول
            </h1>
            <p className="text-muted-foreground text-base">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className="h-13 pr-11 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                <Input
                  type="password"
                  placeholder="•••••••••"
                  className="h-13 pr-11 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                {error}
              </div>
            )}

            <Button
              className="w-full h-13 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  تسجيل الدخول
                  <ArrowLeft className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground">أو وصول سريع</span>
            </div>
          </div>

          {/* Quick Demo Access */}
          <div className="grid grid-cols-3 gap-3">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="w-full rounded-xl h-11 text-xs border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all">
                المسؤول
              </Button>
            </Link>
            <Link to="/doctor">
              <Button variant="outline" size="sm" className="w-full rounded-xl h-11 text-xs border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all">
                الطبيب
              </Button>
            </Link>
            <Link to="/patient">
              <Button variant="outline" size="sm" className="w-full rounded-xl h-11 text-xs border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all">
                المريض
              </Button>
            </Link>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
