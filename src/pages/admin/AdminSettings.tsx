import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, CreditCard, Settings, UserPlus, MessageSquare, Bell, Shield, Globe, Palette, Database, Save, ToggleRight, ToggleLeft, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/admin" },
  { icon: <Users className="w-4 h-4" />, label: "المستخدمون", path: "/admin/users" },
  // { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/admin/consultations" },
  { icon: <UserPlus className="w-4 h-4" />, label: "طلبات الانضمام", path: "/admin/requests" },
  // { icon: <CreditCard className="w-4 h-4" />, label: "المدفوعات", path: "/admin/payments" },
  { icon: <Settings className="w-4 h-4" />, label: "الإعدادات", path: "/admin/settings" },
];

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "iShifa",
    siteEmail: "info@ishifa.com",
    sitePhone: "+963 11 123 4567",
    siteAddress: "اللاذقية، سوريا",
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    allowRegistration: true,
    doctorApprovalRequired: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.getAdminSettings();
        console.log('Admin settings response:', response);
        if (response.success && response.data) {
          const data = response.data;
          setSettings({
            siteName: data.site_name || "iShifa",
            siteEmail: data.contact_email || "info@ishifa.com",
            sitePhone: data.contact_phone || "+963 11 123 4567",
            siteAddress: data.address || "اللاذقية، سوريا",
            notificationsEnabled: data.enable_notifications === 1,
            emailNotifications: data.email_notifications === 1,
            smsNotifications: data.sms_notifications === 1,
            maintenanceMode: data.maintenance_mode === 1,
            allowRegistration: data.allow_registration === 1,
            doctorApprovalRequired: data.doctor_approval_required === 1,
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleChange = (key: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsData = {
        site_name: settings.siteName,
        contact_email: settings.siteEmail,
        contact_phone: settings.sitePhone,
        address: settings.siteAddress,
        enable_notifications: settings.notificationsEnabled ? 1 : 0,
        email_notifications: settings.emailNotifications ? 1 : 0,
        sms_notifications: settings.smsNotifications ? 1 : 0,
        maintenance_mode: settings.maintenanceMode ? 1 : 0,
        allow_registration: settings.allowRegistration ? 1 : 0,
        doctor_approval_required: settings.doctorApprovalRequired ? 1 : 0,
      };

      const response = await apiService.updateAdminSettings(settingsData);
      
      if (response.success) {
        alert('تم حفظ الإعدادات بنجاح');
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert('فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="الإعدادات" items={sidebarItems} role="admin">
      {isLoading ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">جاري تحميل الإعدادات...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm sm:text-base">الإعدادات العامة</h3>
                <p className="text-xs text-muted-foreground">معلومات الموقع الأساسية</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">اسم الموقع</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">البريد الإلكتروني</label>
                <Input
                  value={settings.siteEmail}
                  onChange={(e) => handleChange("siteEmail", e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">رقم الهاتف</label>
                <Input
                  value={settings.sitePhone}
                  onChange={(e) => handleChange("sitePhone", e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">العنوان</label>
                <Input
                  value={settings.siteAddress}
                  onChange={(e) => handleChange("siteAddress", e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">الإشعارات</h3>
              <p className="text-xs text-muted-foreground">إعدادات التنبيهات والإشعارات</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">تفعيل الإشعارات</p>
                  <p className="text-[10px] text-muted-foreground">إرسال إشعارات للمستخدمين</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("notificationsEnabled")}
                className="relative w-12 h-6 rounded-full transition-colors"
              >
                {settings.notificationsEnabled ? (
                  <div className="absolute inset-0 bg-primary rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">إشعارات البريد</p>
                  <p className="text-[10px] text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className="relative w-12 h-6 rounded-full transition-colors"
              >
                {settings.emailNotifications ? (
                  <div className="absolute inset-0 bg-primary rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">إشعارات SMS</p>
                  <p className="text-[10px] text-muted-foreground">إرسال إشعارات عبر الرسائل النصية</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("smsNotifications")}
                className="relative w-12 h-6 rounded-full transition-colors"
              >
                {settings.smsNotifications ? (
                  <div className="absolute inset-0 bg-primary rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">الأمان والصلاحيات</h3>
              <p className="text-xs text-muted-foreground">إعدادات الحماية والوصول</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">وضع الصيانة</p>
                  <p className="text-[10px] text-muted-foreground">إيقاف الموقع مؤقتاً للصيانة</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("maintenanceMode")}
                className="relative w-12 h-6 rounded-full transition-colors"
              >
                {settings.maintenanceMode ? (
                  <div className="absolute inset-0 bg-amber-500 rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <UserPlus className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">السماح بالتسجيل</p>
                  <p className="text-[10px] text-muted-foreground">تفعيل تسجيل المستخدمين الجدد</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("allowRegistration")}
                className="relative w-12 h-6 rounded-full transition-colors"
              >
                {settings.allowRegistration ? (
                  <div className="absolute inset-0 bg-primary rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">موافقة على الأطباء</p>
                  <p className="text-[10px] text-muted-foreground">تطلب موافقة المسؤول على الأطباء الجدد</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("doctorApprovalRequired")}
                className="relative w-12 h-6 rounded-full transition-colors"
              >
                {settings.doctorApprovalRequired ? (
                  <div className="absolute inset-0 bg-primary rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base gap-2"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الحفظ...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSettings;
