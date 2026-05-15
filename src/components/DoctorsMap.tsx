import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  available: boolean;
  lat: number;
  lng: number;
}

interface DoctorsMapProps {
  doctors: Doctor[];
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DoctorsMap = ({ doctors }: DoctorsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError("لم يتم السماح بالوصول إلى الموقع");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    if (!document.querySelector('link[href*="leaflet"]')) {
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      const center = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [36.8065, 5.7600];
      const zoom = userLocation ? 13 : 12;

      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      // User location marker
      if (userLocation) {
        const userIcon = L.divIcon({
          html: `<div style="width:20px;height:20px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.5)"></div>`,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(
            `<div style="text-align:center;direction:rtl;font-family:Tajawal,sans-serif;padding:4px">
              <p style="font-weight:bold;font-size:13px;margin:0">📍 موقعك الحالي</p>
            </div>`
          );

        // Draw circle around user
        L.circle([userLocation.lat, userLocation.lng], {
          radius: 50000,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.05,
          weight: 1,
          dashArray: "5,5",
        }).addTo(map);
      }

      // Sort doctors by distance if user location available
      const sortedDoctors = userLocation
        ? [...doctors].sort(
            (a, b) =>
              getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
              getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
          )
        : doctors;

      sortedDoctors.forEach((doc, index) => {
        const distance = userLocation
          ? getDistance(userLocation.lat, userLocation.lng, doc.lat, doc.lng).toFixed(1)
          : null;

        const popup = `
          <div style="text-align:center;direction:rtl;font-family:Tajawal,sans-serif;min-width:160px;padding:6px">
            <h3 style="font-weight:bold;font-size:14px;margin:0 0 4px">${doc.name}</h3>
            <p style="color:#0d9488;font-size:12px;margin:0 0 4px">${doc.specialty}</p>
            <p style="font-size:12px;margin:0 0 4px">⭐ ${doc.rating} (${doc.reviews} تقييم)</p>
            ${distance ? `<p style="font-size:11px;color:#6b7280;margin:0 0 4px">📍 ${distance} كم منك</p>` : ""}
            <p style="font-weight:bold;font-size:13px;margin:0 0 4px">${doc.price} د.ج</p>
            <span style="font-size:11px;padding:2px 8px;border-radius:10px;background:${doc.available ? "#dcfce7" : "#f3f4f6"};color:${doc.available ? "#16a34a" : "#9ca3af"}">
              ${doc.available ? "متاح الآن" : "غير متاح"}
            </span>
          </div>
        `;

        const markerColor = doc.available ? "#0d9488" : "#9ca3af";
        const doctorIcon = L.divIcon({
          html: `<div style="width:32px;height:32px;background:${markerColor};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px ${markerColor}40;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold">${index + 1}</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([doc.lat, doc.lng], { icon: doctorIcon }).addTo(map).bindPopup(popup);
      });
    };

    if ((window as any).L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [doctors, userLocation]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 shadow-card">
      {/* Location bar */}
      <div className="bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          {userLocation ? (
            <span className="text-foreground font-medium">تم تحديد موقعك — الأطباء مرتبون حسب القرب منك</span>
          ) : locationError ? (
            <span className="text-muted-foreground">{locationError}</span>
          ) : (
            <span className="text-muted-foreground">شارك موقعك لعرض أقرب الأطباء</span>
          )}
        </div>
        {!userLocation && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs shrink-0"
            onClick={requestLocation}
            disabled={locating}
          >
            <Navigation className="w-3.5 h-3.5" />
            {locating ? "جاري التحديد..." : "تحديد موقعي"}
          </Button>
        )}
      </div>

      <div ref={mapRef} style={{ height: "450px", width: "100%" }} />
    </div>
  );
};

export default DoctorsMap;
