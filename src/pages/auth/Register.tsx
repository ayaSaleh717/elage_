import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Upload, FileText, X, Mail, Lock, User, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const heartbeatVideo = "https://scwzacvwp7mrajkx.public.blob.vercel-storage.com/assests/human%20heartbet.mp4";

const Register = () => {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    specialty?: string;
  }>({});
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecializations = async () => {
      setIsLoadingSpecializations(true);
      try {
        const response = await fetch("https://wolflike-merri-nugatory.ngrok-free.dev/api/specializations", {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await response.json();
        if (data.status === "success" && data.specializations) {
          setSpecializations(data.specializations);
        }
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      } finally {
        setIsLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    // Get user location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          console.log("User location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Don't block registration if location fails
        }
      );
    }
  }, []);

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleRemoveCertificate = () => {
    setCertificateFile(null);
  };

  const validateForm = () => {
    const errors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      specialty?: string;
    } = {};

    if (!firstName.trim()) {
      errors.firstName = "الرجاء إدخال الاسم الأول";
    } else if (firstName.length < 2) {
      errors.firstName = "الاسم الأول يجب أن يكون حرفين على الأقل";
    }

    if (!lastName.trim()) {
      errors.lastName = "الرجاء إدخال اسم العائلة";
    } else if (lastName.length < 2) {
      errors.lastName = "اسم العائلة يجب أن يكون حرفين على الأقل";
    }

    if (!email.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = "الرجاء إدخال بريد إلكتروني صحيح (مثال: example@gmail.com)";
    }

    if (!password) {
      errors.password = "الرجاء إدخال كلمة المرور";
    } else if (password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (role === "doctor") {
      if (!specialty.trim()) {
        errors.specialty = "الرجاء إدخال التخصص الطبي";
      } else if (specialty.length < 3) {
        errors.specialty = "التخصص يجب أن يكون 3 أحرف على الأقل";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        specialization: role === "doctor" ? specialty : undefined,
        degree_file: role === "doctor" ? certificateFile || undefined : undefined,
        latitude: latitude !== null ? latitude.toString() : undefined,
        longitude: longitude !== null ? longitude.toString() : undefined,
      });

      if (response.success) {
        // Redirect based on role after successful registration
        if (role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || "فشل إنشاء الحساب");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
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
              انضم إلى
              <br />
              <span className="text-primary">مجتمعنا الطبي</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              سجّل الآن واحصل على رعاية طبية مميزة مع أفضل الأطباء المتخصصين
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-green animate-pulse" />
                <span className="text-white/50 text-sm">تسجيل مجاني</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-white/50 text-sm">ذكاء اصطناعي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated red cells */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-3 h-3 rounded-full bg-red-500/40 top-[20%] left-[20%] animate-float" />
          <div className="absolute w-2 h-2 rounded-full bg-red-400/50 top-[40%] left-[60%] animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute w-4 h-4 rounded-full bg-red-500/30 top-[70%] left-[30%] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600/40 top-[55%] left-[75%] animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="absolute w-3.5 h-3.5 rounded-full bg-red-400/35 top-[85%] left-[50%] animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background relative p-6 lg:p-12 overflow-y-auto">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, hsl(174 62% 40%) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Glow effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-32 h-32 rounded-full bg-primary/5 blur-3xl top-[10%] right-[10%]" />
          <div className="absolute w-40 h-40 rounded-full bg-red-500/5 blur-3xl bottom-[10%] left-[10%]" />
        </div>

        <div className="w-full max-w-[440px] relative z-10 space-y-6 my-8">
          {/* Mobile logo */}
          <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">i-Shifa</span>
          </Link>

          {registered ? (
            /* Email verification message */
            <div className="space-y-6 text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  تم إنشاء الحساب بنجاح!
                </h1>
                <p className="text-muted-foreground leading-relaxed text-base">
                  لقد أرسلنا رابط تحقق إلى بريدك الإلكتروني
                </p>
                <p className="font-medium text-foreground text-lg" dir="ltr">
                  {email}
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <div className="flex items-start gap-3 text-right">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">قم بتأكيد بريدك الإلكتروني</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      افتح بريدك الإلكتروني واضغط على رابط التحقق لتفعيل حسابك. تحقق من مجلد الرسائل غير المرغوب فيها إذا لم تجد الرسالة.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login">
                  <Button className="w-full h-12 bg-gradient-primary text-primary-foreground rounded-xl">
                    الذهاب لتسجيل الدخول
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
          <>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              إنشاء حساب
            </h1>
            <p className="text-muted-foreground text-base">
              سجّل الآن وابدأ رحلتك الصحية
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-1 p-1.5 bg-muted/40 rounded-2xl border border-border/40">
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                role === "patient"
                  ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              مريض
            </button>
            <button
              onClick={() => setRole("doctor")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                role === "doctor"
                  ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              طبيب
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الاسم</label>
                <div className="relative">
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    placeholder="الاسم الأول"
                    className={`h-13 pr-10 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all ${fieldErrors.firstName ? "border-destructive focus:border-destructive" : ""}`}
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (fieldErrors.firstName) {
                        setFieldErrors(prev => ({ ...prev, firstName: undefined }));
                      }
                    }}
                  />
                </div>
                {fieldErrors.firstName && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">العائلة</label>
                <div className="relative">
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    placeholder="اسم العائلة"
                    className={`h-13 pr-10 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all ${fieldErrors.lastName ? "border-destructive focus:border-destructive" : ""}`}
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (fieldErrors.lastName) {
                        setFieldErrors(prev => ({ ...prev, lastName: undefined }));
                      }
                    }}
                  />
                </div>
                {fieldErrors.lastName && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className={`h-13 pr-10 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all ${fieldErrors.email ? "border-destructive focus:border-destructive" : ""}`}
                  dir="ltr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`h-13 pr-10 rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all ${fieldErrors.password ? "border-destructive focus:border-destructive" : ""}`}
                  dir="ltr"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {role === "doctor" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">التخصص الطبي</label>
                  <div className="relative">
                    <Stethoscope className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10" />
                    <select
                      className={`h-13 pr-10 pl-10 w-full rounded-xl bg-muted/30 border-border/40 focus:bg-background focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(174_62%_40%/0.1)] transition-all appearance-none text-foreground text-sm ${fieldErrors.specialty ? "border-destructive focus:border-destructive" : ""}`}
                      value={specialty}
                      onChange={(e) => {
                        setSpecialty(e.target.value);
                        if (fieldErrors.specialty) {
                          setFieldErrors(prev => ({ ...prev, specialty: undefined }));
                        }
                      }}
                      disabled={isLoadingSpecializations}
                    >
                      <option value="">اختر التخصص</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                  </div>
                  {fieldErrors.specialty && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.specialty}</p>
                  )}
                  {isLoadingSpecializations && (
                    <p className="text-xs text-muted-foreground mt-1">جاري تحميل التخصصات...</p>
                  )}
                </div>

                {/* Certificate Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      الشهادة الطبية
                    </label>
                    {certificateFile && (
                      <button
                        onClick={handleRemoveCertificate}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded-lg hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {certificateFile ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">{certificateFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(certificateFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/5 cursor-pointer group"
                      onClick={() => document.getElementById("certificate-upload")?.click()}
                    >
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        اضغط لرفع الشهادة
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleCertificateUpload}
                        className="hidden"
                        id="certificate-upload"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                {error}
              </div>
            )}

            <Button
              className="w-full h-13 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري إنشاء الحساب...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  إنشاء الحساب
                  <ArrowLeft className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground pt-2">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
