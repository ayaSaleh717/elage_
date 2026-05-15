import { Video, Bot, Shield, MapPin, Star, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Bot,
    title: "تشخيص أولي بالذكاء الاصطناعي",
    description: "مساعد ذكي يحلل أعراضك ويوجهك للتخصص الطبي المناسب",
    color: "bg-medical-teal-light text-medical-teal",
  },
  {
    icon: Video,
    title: "استشارات فيديو مباشرة",
    description: "تحدث مع طبيبك وجهاً لوجه عبر مكالمات فيديو عالية الجودة",
    color: "bg-medical-blue-light text-medical-blue",
  },
  {
    icon: MapPin,
    title: "أطباء قريبون منك",
    description: "اعثر على أطباء بالقرب من موقعك على الخريطة التفاعلية",
    color: "bg-medical-green-light text-medical-green",
  },
  {
    icon: Star,
    title: "تقييمات موثوقة",
    description: "اطلع على تقييمات المرضى الحقيقية لاختيار الطبيب الأنسب",
    color: "bg-medical-orange-light text-medical-orange",
  },
  {
    icon: Shield,
    title: "خصوصية وأمان",
    description: "بياناتك الطبية محمية بأعلى معايير الأمان والتشفير",
    color: "bg-medical-purple-light text-medical-purple",
  },
  {
    icon: Clock,
    title: "متاح على مدار الساعة",
    description: "احصل على استشارة في أي وقت، من أي مكان بسهولة تامة",
    color: "bg-medical-teal-light text-medical-teal",
  },
];

const FeaturesSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          features.forEach((_, i) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, i]);
            }, i * 500);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-muted/30" ref={sectionRef}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            لماذا{" "}
            <span className="text-gradient-primary inline-block animate-bounce">i-Shifa</span>{" "}
            ؟
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقدم لك تجربة طبية رقمية متكاملة تجمع بين التكنولوجيا والرعاية الإنسانية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-700 hover:-translate-y-1 ${
                visibleCards.includes(i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
