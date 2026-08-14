import React, { useState, useEffect } from 'react';
import { apiService } from "@/services/api";

const Consultations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState<any[]>([]);

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
              <div>
                <p className="text-sm font-medium text-foreground">
                  {consultation.doctor_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {consultation.doctor_specialization} • {consultation.date} • {consultation.time}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  consultation.status === "مكتملة"
                    ? "bg-medical-green-light text-medical-green"
                    : consultation.status === "قيد الانتظار"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {consultation.status}
              </span>
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