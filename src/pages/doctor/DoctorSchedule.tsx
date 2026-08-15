import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  // { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  // { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  dayOfWeek: number; // 0-6 for Saturday-Friday (matching API)
  id?: number; // Database ID for the working day
  enabled: boolean;
  slots: TimeSlot[];
}

const initialSchedule: DaySchedule[] = [
  { day: "السبت", dayOfWeek: 0, enabled: true, slots: [] },
  { day: "الأحد", dayOfWeek: 1, enabled: true, slots: [] },
  { day: "الاثنين", dayOfWeek: 2, enabled: true, slots: [] },
  { day: "الثلاثاء", dayOfWeek: 3, enabled: true, slots: [] },
  { day: "الأربعاء", dayOfWeek: 4, enabled: true, slots: [] },
  { day: "الخميس", dayOfWeek: 5, enabled: true, slots: [] },
  { day: "الجمعة", dayOfWeek: 6, enabled: false, slots: [] },
];

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [originalSchedule, setOriginalSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        // Fetch schedule (combined working days and time slots)
        const scheduleResponse = await apiService.getMySchedule();
        const scheduleData = scheduleResponse.data || [];

        console.log('API Schedule Data:', scheduleData);

        // Map schedule data to schedule format
        const newSchedule = initialSchedule.map(day => {
          const dayData = scheduleData.find((sd: any) => sd.day_of_week === day.dayOfWeek);
          const daySlots = dayData?.slots?.map((slot: any) => ({
            id: slot.id,
            start: slot.start_time,
            end: slot.end_time
          })) || [];

          return {
            ...day,
            id: dayData?.id,
            enabled: dayData?.is_open === 1,
            slots: daySlots
          };
        });

        console.log('Mapped Schedule:', newSchedule);
        setSchedule(newSchedule);
        setOriginalSchedule(JSON.parse(JSON.stringify(newSchedule)));
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => prev.map((d, i) => i === dayIndex ? { ...d, enabled: !d.enabled } : d));
    setSaved(false);
  };

  const addSlot = (dayIndex: number) => {
    const newSlot = {
      id: Date.now(), // Temporary ID for new slots
      start: "09:00",
      end: "09:00" // Set to same as start time initially
    };
    setSchedule(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        return { ...d, enabled: true, slots: [...d.slots, newSlot] };
      }
      return d;
    }));
    setSaved(false);
  };

  const removeSlot = (dayIndex: number, slotId: number) => {
    setSchedule(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        const newSlots = d.slots.filter(s => s.id !== slotId);
        return { ...d, enabled: newSlots.length > 0, slots: newSlots };
      }
      return d;
    }));
    setSaved(false);
  };

  const updateSlot = (dayIndex: number, slotId: number, field: "start" | "end", value: string) => {
    setSchedule(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        return { ...d, slots: d.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s) };
      }
      return d;
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Prepare days array - include only days with IDs (existing days)
      const days = schedule
        .filter(day => day.id !== undefined)
        .map(day => ({
          id: day.id!,
          is_open: day.enabled
        }));

      // Prepare slots array
      const slots: any[] = [];

      schedule.forEach(day => {
        if (day.enabled) {
          day.slots.forEach(slot => {
            // If slot has a real ID (not temporary), it's an update
            if (slot.id < 1000000000) { // Assuming temporary IDs are large numbers
              slots.push({
                id: slot.id,
                day_of_week: day.dayOfWeek,
                start_time: slot.start,
                end_time: slot.end
              });
            } else {
              // New slot - don't include ID for creation
              slots.push({
                day_of_week: day.dayOfWeek,
                start_time: slot.start,
                end_time: slot.end
              });
            }
          });
        }
      });

      // Find deleted slots (slots that were in original but not in current)
      originalSchedule.forEach(origDay => {
        if (origDay.id !== undefined) {
          const currentDay = schedule.find(d => d.dayOfWeek === origDay.dayOfWeek);
          if (currentDay) {
            origDay.slots.forEach(origSlot => {
              const slotExists = currentDay.slots.some(s => s.id === origSlot.id);
              if (!slotExists && origSlot.id < 1000000000) {
                // Mark for deletion
                slots.push({
                  id: origSlot.id,
                  "delete": true
                });
              }
            });
          }
        }
      });

      console.log('Sending schedule update:', { days, slots });

      const response = await apiService.updateSchedule({ days, slots });

      if (response.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);

        // Refresh the schedule after successful save
        const scheduleResponse = await apiService.getMySchedule();
        const scheduleData = scheduleResponse.data || [];

        const newSchedule = initialSchedule.map(day => {
          const dayData = scheduleData.find((sd: any) => sd.day_of_week === day.dayOfWeek);
          const daySlots = dayData?.slots?.map((slot: any) => ({
            id: slot.id,
            start: slot.start_time,
            end: slot.end_time
          })) || [];

          return {
            ...day,
            id: dayData?.id,
            enabled: dayData?.is_open === 1,
            slots: daySlots
          };
        });

        setSchedule(newSchedule);
        setOriginalSchedule(JSON.parse(JSON.stringify(newSchedule)));
      }
    } catch (error: any) {
      console.error("Failed to save schedule:", error);
      
      // Translate common error messages
      let errorMessage = error.message || "فشل حفظ الجدول. يرجى المحاولة مرة أخرى.";
      
      if (error.message === "This time slot overlaps with an existing one") {
        errorMessage = "هذا الوقت يتداخل مع موعد موجود بالفعل. يرجى اختيار وقت مختلف.";
      } else if (error.message === "This time slot is not available on this day") {
        errorMessage = "هذا الوقت غير متاح في هذا اليوم. يرجى اختيار وقت مختلف.";
      }
      
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const totalHours = schedule.reduce((acc, day) => {
    if (!day.enabled) return acc;
    return acc + day.slots.reduce((slotAcc, slot) => {
      const start = parseInt(slot.start.split(":")[0]) + parseInt(slot.start.split(":")[1]) / 60;
      const end = parseInt(slot.end.split(":")[0]) + parseInt(slot.end.split(":")[1]) / 60;
      return slotAcc + (end - start);
    }, 0);
  }, 0);

  return (
    <DashboardLayout title="أوقات العمل" items={sidebarItems} role="doctor">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/4 mb-3" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">جدول أوقات العمل</h2>
          <p className="text-xs text-muted-foreground mt-0.5">حدد أوقات توفرك للاستشارات</p>
          {saveError && (
            <p className="text-xs text-red-500 mt-1">{saveError}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            إجمالي: <span className="font-bold text-foreground">{totalHours.toFixed(1)} ساعة/أسبوع</span>
          </div>
          <Button onClick={handleSave} size="sm" className="rounded-xl gap-1.5 text-xs bg-primary" disabled={isSaving}>
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ"}
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-3 sm:space-y-4">
        {schedule.map((day, dayIndex) => (
          <div
            key={day.day}
            className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 border transition-all duration-300 ${
              day.enabled
                ? "border-slate-100 dark:border-slate-700 shadow-sm"
                : "border-slate-100 dark:border-slate-700 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleDay(dayIndex)}
                  className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-all duration-300 relative ${
                    day.enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    day.enabled ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
                <span className={`text-sm sm:text-base font-bold ${day.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                  {day.day}
                </span>
              </div>

              {day.enabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSlot(dayIndex)}
                  className="rounded-lg text-[10px] sm:text-xs h-7 sm:h-8 gap-1 border-dashed border-primary/50 text-primary hover:bg-primary/5"
                >
                  <Plus className="w-3 h-3" />
                  إضافة فترة
                </Button>
              )}
            </div>

            {day.enabled && day.slots.length > 0 && (
              <div className="space-y-2 sm:space-y-2.5 mr-8 sm:mr-14">
                {day.slots.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-1 flex-wrap">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateSlot(dayIndex, slot.id, "start", e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs sm:text-sm text-foreground w-[90px] sm:w-[100px]"
                      />
                      <span className="text-xs text-muted-foreground">إلى</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateSlot(dayIndex, slot.id, "end", e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs sm:text-sm text-foreground w-[90px] sm:w-[100px]"
                      />
                    </div>
                    <button
                      onClick={() => removeSlot(dayIndex, slot.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {day.enabled && day.slots.length === 0 && (
              <p className="text-xs text-muted-foreground mr-14 italic">لا توجد فترات عمل - أضف فترة جديدة</p>
            )}
          </div>
        ))}
      </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DoctorSchedule;
