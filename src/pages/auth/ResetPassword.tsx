import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { apiService } from "@/services/api";

const VIDEO_URL = "https://scwzacvwp7mrajkx.public.blob.vercel-storage.com/assests/human%20heartbet.mp4";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const passedPassword = (location.state as any)?.password || "";

  const [password, setPassword] = useState(passedPassword);
  const [passwordConfirmation, setPasswordConfirmation] = useState(passedPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!password || !passwordConfirmation) {
      setError("الرجاء ملء جميع الحقول");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("كلمة المرور وتأكيدها غير متطابقتين");
      return;
    }

    if (!token || !email) {
      setError("الرابط غير صالح أو منتهي الصلاحية. الرجاء طلب رابط جديد.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.success) {
        setSuccess(true);
        // Auto-login if token returned
        if (response.token) {
          localStorage.setItem("authToken", response.token);
          if (response.user) {
            localStorage.setItem("userData", JSON.stringify(response.user));
          }
        }
      } else {
        setError(response.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
        if (response.errors) {
          setFieldErrors(response.errors);
        }
      }
    } catch (err: any) {
      if (err.status === 401) {
        setError("هذا الرابط منتهي الصلاحية. الرجاء طلب رابط جديد.");
      } else if (err.status === 422) {
        setError(err.message || "بيانات غير صالحة");
        if (err.errors) {
          setFieldErrors(err.errors);
        }
      } else {
        setError("حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    const userData = apiService.getCurrentUser();
    if (userData?.role === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/patient");
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left side - Video */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <Link to="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white drop-shadow-lg">i-Shifa</span>
          </Link>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-display font-bold text-white leading-tight">
              إعادة تعيين
              <br />
              <span className="text-primary">كلمة المرور</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              أدخل كلمة المرور الجديدة لحسابك
            </p>
          </div>
        </div>

        {/* Animated red cells */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-3 h-3 rounded-full bg-red-500/40 top-[20%] left-[20%] animate-float" />
          <div className="absolute w-2 h-2 rounded-full bg-red-400/50 top-[40%] left-[60%] animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute w-4 h-4 rounded-full bg-red-500/30 top-[70%] left-[30%] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600/40 top-[55%] left-[75%] animate-float" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background relative p-6 lg:p-16">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, hsl(174 62% 40%) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

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

          {/* No token/email warning */}
          {!token && !email && !success && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-xl p-4 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">رابط غير مكتمل</p>
                <p className="mt-1 text-amber-600/80 dark:text-amber-400/80">
                  يبدو أن الرابط لا يحتوي على بيانات التحقق. تأكد من استخدام الرابط المرسل إلى بريدك الإلكتروني.
                </p>
              </div>
            </div>
          )}

          {success ? (
            /* Success state */
            <div className="space-y-6 text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-full bg-medical-green/10 border-2 border-medical-green/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-medical-green" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  تم تغيير كلمة المرور بنجاح!
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                {apiService.isAuthenticated() ? (
                  <Button
                    onClick={handleGoToDashboard}
                    className="w-full h-12 bg-gradient-primary text-primary-foreground rounded-xl"
                  >
                    الذهاب إلى لوحة التحكم
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button className="w-full h-12 bg-gradient-primary text-primary-foreground rounded-xl">
                      تسجيل الدخول
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  كلمة مرور جديدة
                </h1>
                <p className="text-muted-foreground text-base">
                  أدخل كلمة المرور الجديدة لحسابك
                  {email && (
                    <span className="block mt-1 text-sm font-medium text-foreground" dir="ltr">
                      {email}
                    </span>
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-13 pr-11 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all"
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
                  )}
                </div>

                {/* Password Confirmation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-13 pr-11 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all"
                      dir="ltr"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                  </div>
                  {fieldErrors.password_confirmation && (
                    <p className="text-xs text-destructive">{fieldErrors.password_confirmation[0]}</p>
                  )}
                </div>

                {/* General error */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-13 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري التغيير...
                    </div>
                  ) : (
                    "تغيير كلمة المرور"
                  )}
                </Button>
              </form>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                العودة لتسجيل الدخول
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
