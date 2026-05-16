import { Button } from "@/components/ui/button";
import { Bot, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const humanBody = "https://scwzacvwp7mrajkx.public.blob.vercel-storage.com/assests/humanbody.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen  flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-bl from-medical-teal-light via-background to-medical-blue-light" />

      {/* Subtle grid pattern for modern feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, hsl(174 62% 40%) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="container relative z-10 drop-shadow-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Right side - Human body image with orbiting circle */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in-up order-last">
            <div className="relative w-[520px] h-[620px] flex items-center justify-center">
              {/* Circle behind the image - clear and visible */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border-4 border-primary/40 bg-primary/5" />
              </div>

              {/* Human body image */}
              <img
                src={humanBody}
                alt="جسم الإنسان"
                className="relative z-10 h-[580px] w-auto object-contain drop-shadow-2xl"
              />

              {/* Orbiting circle that moves up and down - on the right side */}
              <div className="absolute right-4 top-1/2 z-20 animate-orbit-vertical">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-medical-blue shadow-lg shadow-primary/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Secondary smaller orbiting circle */}
              <div className="absolute left-6 top-1/3 z-20 animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="w-8 h-8 rounded-full bg-accent/80 shadow-md shadow-accent/20" />
              </div>

              {/* Decorative ring */}
              <div className="absolute inset-6 rounded-full border-2 border-dashed border-primary/15 animate-[spin_20s_linear_infinite]" />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex mx-2 items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">مدعوم بالذكاء الاصطناعي</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground">
              استشاراتك الطبية
              <br />
              <span className="text-gradient-primary">أصبحت أسهل</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              منصة رقمية شاملة تقدم خدمات الاستشارات الطبية مع دمج الذكاء الاصطناعي كمساعد في عملية التشخيص الأولي وتوجيه المريض إلى الطبيب المناسب.
              لتسهيل حجزك عند أفضل طبيب في منطقتك
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/ai-consultation">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2 text-base px-8 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  <Bot className="w-5 h-5" />
                  ابدأ استشارة ذكية
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 backdrop-blur-sm transition-all hover:-translate-y-0.5">
                  تصفح الأطباء
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">+500</div>
                <div className="text-xs text-muted-foreground">طبيب متخصص</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">+10K</div>
                <div className="text-xs text-muted-foreground">استشارة ناجحة</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex items-center gap-1 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">4.9</div>
                  <div className="text-xs text-muted-foreground">تقييم المرضى</div>
                </div>
                <Star className="w-5 h-5 text-accent fill-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
