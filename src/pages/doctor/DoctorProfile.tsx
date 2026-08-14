import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Mail, Phone, MapPin, GraduationCap, Award, Star, Edit3, Camera, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  // { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    subSpecialty: "",
    experience: "",
    degree: "",
    university: "",
    license: "",
    bio: "",
    location: "",
    languages: "",
    consultationFee: "",
    followUpFee: "",
    appointmentsCount: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.getDoctorProfile();
        if (response.success && response.data) {
          // Handle nested profile structure
          const profileData = response.data.profile || response.data;
          const currentUser = apiService.getCurrentUser();

          setProfile({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            email: currentUser?.email || "",
            phone: profileData.phone || "",
            specialty: profileData.specialization || "",
            subSpecialty: profileData.sub_specialization || "",
            experience: profileData.experience_years?.toString() || "",
            degree: profileData.degree || "",
            university: profileData.university || "",
            license: profileData.license_number || "",
            bio: profileData.bio || "",
            location: "",
            languages: profileData.languages || "",
            consultationFee: "",
            followUpFee: "",
            appointmentsCount: profileData.appointments_count || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setIsGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;
            const city = address.city || address.town || address.village || address.county || "";
            const country = address.country || "";
            const street = address.road || address.street || "";

            const locationText = [street, city, country].filter(Boolean).join(", ");
            setProfile(prev => ({
              ...prev,
              location: locationText
            }));
          } else {
            // Fallback to coordinates if geocoding fails
            setProfile(prev => ({
              ...prev,
              location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            }));
          }
        } catch (geocodingError) {
          console.error("Geocoding error:", geocodingError);
          // Fallback to coordinates if geocoding fails
          setProfile(prev => ({
            ...prev,
            location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          }));
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("فشل في الحصول على الموقع. يرجى السماح بالوصول إلى الموقع");
        setIsGettingLocation(false);
      }
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const response = await apiService.updateDoctorProfile({
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        specialization: profile.specialty,
        sub_specialization: profile.subSpecialty,
        experience_years: parseInt(profile.experience) || 0,
        languages: profile.languages,
        license_number: profile.license,
        degree: profile.degree,
        university: profile.university,
        bio: profile.bio,
      });

      if (response.success) {
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="الملف الشخصي" items={sidebarItems} role="doctor">
      {isLoading ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-28 sm:h-36 bg-gradient-to-br from-primary via-teal-500 to-emerald-400 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgydjRoNHYyaC00djRoLTJ2LTR6bTAtMzBoLTJ2LTRoMlYwaDJ2NGg0djJoLTR2NGgtMlY0em0tMzAgMGgtMnYtNGgyVjBoMnY0aDR2MmgtNHY0aC0yVjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6 pb-5 -mt-12 sm:-mt-14 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-primary">{profile.firstName.charAt(0)}</span>
              </div>
              <button className="absolute bottom-1 left-1 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name & Info */}
            <div className="flex-1 text-center sm:text-right">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">د. {profile.firstName} {profile.lastName}</h2>
              <p className="text-xs sm:text-sm text-primary font-medium">{profile.specialty} • {profile.subSpecialty}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />4.8 (156 تقييم)</span>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              size="sm"
              disabled={isSaving}
              className={`rounded-xl gap-1.5 text-xs ${isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary"}`}
            >
              {isSaving ? (
                <>جاري الحفظ...</>
              ) : isEditing ? (
                <>حفظ التغييرات</>
              ) : (
                <><Edit3 className="w-3.5 h-3.5" />تعديل</>
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-2 text-xs text-destructive">{error}</div>
          )}
          {success && (
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">تم تحديث الملف الشخصي بنجاح</div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              المعلومات الشخصية
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">الاسم الأول</label>
                {isEditing ? (
                  <Input value={profile.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.firstName}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">الاسم الأخير</label>
                {isEditing ? (
                  <Input value={profile.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.lastName}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" />البريد الإلكتروني</label>
                {isEditing ? (
                  <Input value={profile.email} onChange={(e) => handleChange("email", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" />رقم الهاتف</label>
                {isEditing ? (
                  <Input value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Globe className="w-3 h-3" />اللغات</label>
                {isEditing ? (
                  <Input value={profile.languages} onChange={(e) => handleChange("languages", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.languages}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block flex items-center gap-1"><MapPin className="w-3 h-3" />الموقع</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input 
                      value={profile.location} 
                      onChange={(e) => handleChange("location", e.target.value)} 
                      className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm flex-1" 
                      placeholder="خط العرض، خط الطول"
                    />
                    <Button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      size="sm"
                      className="h-9 sm:h-10 px-3 rounded-lg bg-primary hover:bg-primary/90"
                    >
                      {isGettingLocation ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.location || "لم يتم تحديد الموقع"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-3 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-primary" />
              نبذة تعريفية
            </h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full h-28 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.bio}</p>
            )}
          </div>

          {/* Fees */}
          {/* <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              رسوم الاستشارة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">رسوم الاستشارة الأولى (ل.س)</label>
                {isEditing ? (
                  <Input value={profile.consultationFee} onChange={(e) => handleChange("consultationFee", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">{Number(profile.consultationFee).toLocaleString()} ل.س</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">رسوم المتابعة (ل.س)</label>
                {isEditing ? (
                  <Input value={profile.followUpFee} onChange={(e) => handleChange("followUpFee", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">{Number(profile.followUpFee).toLocaleString()} ل.س</p>
                )}
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Column - Professional Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Specialty */}
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              التخصص
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">التخصص الرئيسي</label>
                {isEditing ? (
                  <Input value={profile.specialty} onChange={(e) => handleChange("specialty", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">{profile.specialty}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">التخصص الدقيق</label>
                {isEditing ? (
                  <Input value={profile.subSpecialty} onChange={(e) => handleChange("subSpecialty", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.subSpecialty}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" />سنوات الخبرة</label>
                {isEditing ? (
                  <Input value={profile.experience} onChange={(e) => handleChange("experience", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.experience} سنة</p>
                )}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              المؤهلات العلمية
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">الدرجة العلمية</label>
                {isEditing ? (
                  <Input value={profile.degree} onChange={(e) => handleChange("degree", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.degree}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">الجامعة</label>
                {isEditing ? (
                  <Input value={profile.university} onChange={(e) => handleChange("university", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{profile.university}</p>
                )}
              </div>
            </div>
          </div>

          {/* License */}
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              الترخيص
            </h3>
            <div>
              <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">رقم الترخيص الطبي</label>
              {isEditing ? (
                <Input value={profile.license} onChange={(e) => handleChange("license", e.target.value)} className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm" />
              ) : (
                <p className="text-xs sm:text-sm font-medium text-foreground p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span> {profile.license}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="bg-gradient-to-br from-primary/5 to-teal-50/50 dark:from-primary/10 dark:to-teal-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/20 dark:border-primary/30">
            <h3 className="font-bold text-foreground text-xs sm:text-sm mb-3">إحصائيات سريعة</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/60 dark:bg-slate-800/60">
                <p className="text-lg sm:text-xl font-bold text-primary">{profile.appointmentsCount || 0}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">مواعيد</p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/60 dark:bg-slate-800/60">
                <p className="text-lg sm:text-xl font-bold text-primary">{profile.experience || 0}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">سنة خبرة</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DoctorProfile;
