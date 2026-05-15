import { Bot, UserCheck, Video, FileText } from "lucide-react";

const steps = [
  {
    icon: Bot,
    step: "01",
    title: "وصف الأعراض",
    description: "تحدث مع مساعدنا الذكي وأخبره عن أعراضك",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "اختيار الطبيب",
    description: "يقترح عليك النظام أفضل الأطباء المتخصصين",
  },
  {
    icon: Video,
    step: "03",
    title: "استشارة مباشرة",
    description: "تواصل مع طبيبك عبر مكالمة فيديو فورية",
  },
  {
    icon: FileText,
    step: "04",
    title: "تقرير طبي",
    description: "احصل على تقرير مفصل ووصفة طبية إلكترونية",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            كيف <span className="text-gradient-primary">يعمل</span>؟
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            أربع خطوات بسيطة للحصول على استشارتك الطبية
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -left-4 w-[calc(100%-2rem)] h-0.5 bg-border" />
              )}
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-card group-hover:scale-110 transition-transform">
                <s.icon className="w-8 h-8 text-primary-foreground" />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {s.step}
                </div>
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
