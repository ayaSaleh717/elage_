import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User } from "lucide-react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

const DoctorDashboard = () => {
  return (
    <DashboardLayout title="لوحة تحكم الطبيب" items={sidebarItems} role="doctor">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-medical-blue" />}
          label="إجمالي المرضى"
          value="342"
          change="18 جديد"
          colorClass="bg-medical-blue-light"
        />
        <StatCard
          icon={<Stethoscope className="w-6 h-6 text-medical-teal" />}
          label="استشارات اليوم"
          value="8"
          colorClass="bg-medical-teal-light"
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-medical-green" />}
          label="رسائل جديدة"
          value="12"
          colorClass="bg-medical-green-light"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-medical-orange" />}
          label="أرباح الشهر"
          value="8,500 "
          change="22% نمو"
          colorClass="bg-medical-orange-light"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-foreground mb-4">الاستشارات القادمة</h3>
          <div className="space-y-3">
            {[
              { patient: "محمد سعيد", time: "10:00 ص", type: "فيديو" },
              { patient: "أمل الرشيد", time: "11:30 ص", type: "فيديو" },
              { patient: "يوسف أحمد", time: "2:00 م", type: "دردشة" },
            ].map((apt, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{apt.patient.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{apt.patient}</p>
                    <p className="text-xs text-muted-foreground">{apt.time}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-medical-blue-light text-medical-blue">{apt.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-foreground mb-4">آخر التقييمات</h3>
          <div className="space-y-3">
            {[
              { patient: "خالد محمد", rating: 5, comment: "طبيب ممتاز ومتعاون جداً" },
              { patient: "نورة العلي", rating: 4, comment: "تشخيص دقيق وسريع" },
              { patient: "أحمد فهد", rating: 5, comment: "أنصح به بشدة" },
            ].map((review, i) => (
              <div key={i} className="py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{review.patient}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} className="text-accent text-xs">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
