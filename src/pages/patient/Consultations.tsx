import React from 'react'
import data from './data.json'

const Consultations = () => {
    return (


      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">

        <div className="space-y-3">
            {data.consultations.map((consultation) => (
                <div
                    key={consultation.id}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                >
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {consultation.doctor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {consultation.specialty} • {consultation.date}
                        </p>
                    </div>

                    <span
                        className={`text-xs px-3 py-1 rounded-full ${consultation.status === "مكتملة"
                            ? "bg-medical-green-light text-medical-green"
                            : "bg-destructive/10 text-destructive"
                            }`}
                    >
                        {consultation.status}
                    </span>
                </div>
            ))}
        </div>

</div>
    )
}







export default Consultations