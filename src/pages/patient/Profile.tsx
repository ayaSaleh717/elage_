import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Scale, Ruler, Wallet, FileText, Upload, Edit2 } from "lucide-react";
import { apiService } from "@/services/api";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    age: 0,
    weight: 0,
    height: 0,
    balance: 0,
    email: "",
    phone: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user data for name and email
        const currentUser = apiService.getCurrentUser();

        // Fetch profile data for other fields
        const response = await apiService.getPatientProfile();
        if (response.success && response.data) {
          // Handle both response structures: direct data or nested profile
          const profileData = response.data.profile || response.data;
          setProfileData({
            name: currentUser?.name || currentUser?.first_name || profileData.first_name || profileData.name || "",
            email: currentUser?.email || profileData.email || "",
            age: profileData.age || 0,
            weight: profileData.weight || 0,
            height: profileData.height || 0,
            balance: profileData.balance || 0,
            phone: profileData.phone || ""
          });
        } else if (currentUser) {
          // Fallback to user data if profile fetch fails
          setProfileData({
            name: currentUser.name || currentUser.first_name || "",
            email: currentUser.email || "",
            age: 0,
            weight: 0,
            height: 0,
            balance: 0,
            phone: ""
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        // Fallback to current user data on error
        const currentUser = apiService.getCurrentUser();
        if (currentUser) {
          setProfileData({
            name: currentUser.name || currentUser.first_name || "",
            email: currentUser.email || "",
            age: 0,
            weight: 0,
            height: 0,
            balance: 0,
            phone: ""
          });
        }
        setError("فشل تحميل الملف الشخصي");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await apiService.updatePatientProfile({
        age: profileData.age,
        height: profileData.height,
        weight: profileData.weight,
        phone: profileData.phone,
      });

      if (response.success) {
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isFetching ? (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-11 bg-muted rounded" />
              <div className="h-11 bg-muted rounded" />
              <div className="h-11 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Personal Information Card */}
          <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-display">المعلومات الشخصية</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-4 h-4 ml-2" />
            {isEditing ? "إلغاء" : "تعديل"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم الكامل
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                العمر
              </Label>
              <Input
                id="age"
                type="number"
                value={profileData.age}
                onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                disabled={!isEditing}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                الوزن (كجم)
              </Label>
              <Input
                id="weight"
                type="number"
                value={profileData.weight}
                onChange={(e) => setProfileData({...profileData, weight: parseInt(e.target.value)})}
                disabled={!isEditing}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                الطول (سم)
              </Label>
              <Input
                id="height"
                type="number"
                value={profileData.height}
                onChange={(e) => setProfileData({...profileData, height: parseInt(e.target.value)})}
                disabled={!isEditing}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                className="h-11"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className="h-11"
                dir="ltr"
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end pt-4 space-y-3">
              {error && (
                <p className="text-sm text-destructive w-full text-right">{error}</p>
              )}
              {success && (
                <p className="text-sm text-medical-green w-full text-right">تم تحديث الملف الشخصي بنجاح</p>
              )}
              <Button onClick={handleSave} className="h-11" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Balance Card */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Wallet className="w-5 h-5 text-medical-green" />
            الرصيد المالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-medical-green-light rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">الرصيد المتاح</p>
            <p className="text-3xl font-bold text-medical-green">{profileData.balance} ر.س</p>
            <Button className="mt-4 w-full md:w-auto">
              شحن الرصيد
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* Medical Records Card */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            السجلات الطبية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد سجلات طبية حالياً</p>
            <Button variant="outline" className="mt-4">
              <Upload className="w-4 h-4 ml-2" />
              رفع سجل طبي
            </Button>
          </div>
        </CardContent>
      </Card> */}
        </>
      )}
    </div>
  );
};

export default Profile