import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Mail, ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";
import { useState } from "react";
import { apiService } from "@/services/api";
import heartbeatVideo from "@/assests/human heartbet.mp4";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.forgotPassword({ email });
      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.message || "حدث خطأ أثناء إرسال الرابط");
      }
    } catch (err: any) {
      if (err.status === 422) {
        setError(err.message || "البريد الإلكتروني غير صالح");
      } else if (err.status === 404) {
        setError("هذا البريد الإلكتروني غير مسجل");
      } else {
        setError(err.message || "حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.");
      }
    } finally {
      setIsLoading(false);
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
          <source src={heartbeatVideo} type="video/mp4" />
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
              لا تقلق
              <br />
              <span className="text-primary">سنساعدك</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
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

          {submitted ? (
            /* Success state */
            <div className="space-y-6 text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-full bg-medical-green/10 border-2 border-medical-green/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-medical-green" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  تم الإرسال بنجاح!
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/login">
                  <Button className="w-full h-12 bg-gradient-primary text-primary-foreground rounded-xl">
                    العودة لتسجيل الدخول
                  </Button>
                </Link>
                <button
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  className="text-sm text-primary hover:underline"
                >
                  لم تستلم الرسالة؟ أعد المحاولة
                </button>
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  نسيت كلمة المرور؟
                </h1>
                <p className="text-muted-foreground text-base">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      جاري الإرسال...
                    </div>
                  ) : (
                    "إرسال رابط إعادة التعيين"
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

              {/* Test button - للتجربة فقط */}
              <Link to={`/reset-password?token=test-token-123&email=${encodeURIComponent(email || 'test@example.com')}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl border-dashed border-amber-500/50 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                >
                  <FlaskConical className="w-4 h-4 ml-2" />
                  تجربة صفحة إعادة تعيين كلمة المرور
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
