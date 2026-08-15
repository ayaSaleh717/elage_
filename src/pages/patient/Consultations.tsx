import React, { useState, useEffect } from 'react';
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Consultations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await apiService.getPatientConsultations();
        if (response.success && response.data) {
          const data = response.data;
          setConsultations(data.consultations || []);
        }
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      setCancellingId(appointmentId);
      const response = await apiService.cancelAppointment(appointmentId);
      
      if (response.success) {
        // Update the consultation status locally
        setConsultations(prev => prev.map(consultation => 
          consultation.id === appointmentId 
            ? { ...consultation, status: "ملغاة" }
            : consultation
        ));
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (consultation: any) => {
    // Only allow cancellation for consultations that are not completed or already cancelled
    return consultation.status !== "مكتملة" && consultation.status !== "ملغاة";
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : consultations.length > 0 ? (
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {consultation.doctor_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {consultation.doctor_specialization} • {consultation.date} • {consultation.time}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    consultation.status === "مكتملة"
                      ? "bg-medical-green-light text-medical-green"
                      : consultation.status === "قيد الانتظار"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      : consultation.status === "ملغاة"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                  }`}
                >
                  {consultation.status}
                </span>

                {canCancel(consultation) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelAppointment(consultation.id)}
                    disabled={cancellingId === consultation.id}
                    className="text-xs h-8 px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    {cancellingId === consultation.id ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <>
                        <X className="w-3 h-3" />
                        إلغاء
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">لا توجد استشارات</p>
      )}
    </div>
  );
};

export default Consultations;