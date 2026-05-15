import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Scale, Ruler, Wallet, FileText, Upload, Edit2 } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "أحمد محمد",
    age: 35,
    weight: 75,
    height: 175,
    balance: 350,
    email: "ahmed.mohammed@example.com",
    phone: "+966 50 123 4567"
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
  };

  return (
    <div className="space-y-6">
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
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} className="h-11">
                حفظ التغييرات
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card>
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
      </Card>
    </div>
  )
}

export default Profile