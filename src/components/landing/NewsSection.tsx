import { useEffect, useState } from "react";
import { Newspaper, Clock } from "lucide-react";

interface NewsArticle {
  title: string;
  description?: string;
  url?: string;
  image?: string | null;
  source?: string;
  published_at?: string;
}

// Fallback Arabic medical news in case API fails
const fallbackNews: NewsArticle[] = [
  {
    title: "دراسة جديدة تكشف عن فوائد المشي اليومي لصحة القلب",
    description: "أظهرت دراسة حديثة أن المشي لمدة 30 دقيقة يومياً يقلل من خطر الإصابة بأمراض القلب بنسبة 35%",
    source: "صحة اليوم",
    published_at: new Date().toISOString(),
  },
  {
    title: "تطورات جديدة في علاج مرض السكري من النوع الثاني",
    description: "باحثون يطورون علاجاً جديداً يساعد في تنظيم مستويات السكر في الدم بشكل أكثر فعالية",
    source: "المجلة الطبية العربية",
    published_at: new Date().toISOString(),
  },
  {
    title: "أهمية الفحص الدوري للكشف المبكر عن الأمراض",
    description: "خبراء الصحة يؤكدون أن الفحوصات الدورية تساهم في الكشف المبكر عن الأمراض وزيادة فرص العلاج الناجح",
    source: "وزارة الصحة",
    published_at: new Date().toISOString(),
  },
  {
    title: "نصائح طبية لتقوية جهاز المناعة في فصل الشتاء",
    description: "أطباء ينصحون بتناول الفيتامينات والأغذية الغنية بمضادات الأكسدة لتعزيز المناعة",
    source: "صحتك أولاً",
    published_at: new Date().toISOString(),
  },
  {
    title: "الذكاء الاصطناعي يساعد في تشخيص الأمراض بدقة أعلى",
    description: "تقنيات الذكاء الاصطناعي الحديثة تحقق نتائج واعدة في تشخيص الأمراض المعقدة بسرعة ودقة",
    source: "تكنولوجيا الصحة",
    published_at: new Date().toISOString(),
  },
  {
    title: "أطعمة تساعد في الوقاية من ارتفاع ضغط الدم",
    description: "خبراء التغذية يحددون قائمة بالأطعمة التي تساهم في خفض ضغط الدم بشكل طبيعي",
    source: "التغذية السليمة",
    published_at: new Date().toISOString(),
  },
];

const NewsSection = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Try RapidAPI health news first
        const response = await fetch("https://heath-news.p.rapidapi.com/news", {
          method: "GET",
          headers: {
            "x-rapidapi-key": "5eab8fee49msh70532f0ae4b72c5p16fd95jsn089b99dc720f",
            "x-rapidapi-host": "heath-news.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const newsList = Array.isArray(data) ? data : data.articles || data.news || data.data || [];
          if (newsList.length > 0) {
            setArticles(newsList);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Silently fall through to fallback
      }

      try {
        // Fallback to Mediastack
        const response = await fetch(
          `http://api.mediastack.com/v1/news?access_key=57e3371e9bbb776fade280a9ab400739&categories=health&languages=ar&keywords=طب,صحة,علاج&limit=6`
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setArticles(data.data);
          setLoading(false);
          return;
        }
      } catch {
        // Silently fall through to static fallback
      }

      // Use static Arabic medical news as final fallback
      setArticles(fallbackNews);
      setLoading(false);
    };

    fetchNews();
  }, []);

  // Auto-rotate every 15 seconds with fade transition (show 3 at a time)
  useEffect(() => {
    if (articles.length <= 3) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 3) % articles.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [articles]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">آخر الأخبار الصحية</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            ابقَ على اطلاع بأحدث <span className="text-gradient-primary">الأخبار الطبية</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تابع آخر المستجدات والأخبار في عالم الصحة والطب
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-card border border-border p-8 space-y-4 animate-pulse">
            <div className="h-56 rounded-xl bg-muted" />
            <div className="h-6 rounded bg-muted w-3/4" />
            <div className="h-4 rounded bg-muted w-full" />
            <div className="h-4 rounded bg-muted w-1/2" />
          </div>
        )}

        {/* 3 articles at a time with fade transition */}
        {!loading && articles.length > 0 && (
          <div
            className={`transition-all duration-500 ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((offset) => {
                const article = articles[(currentIndex + offset) % articles.length];
                return (
                  <div
                    key={currentIndex + offset}
                    className="group rounded-2xl bg-card border border-border/60 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden bg-muted relative">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-medical-blue/10">
                          <Newspaper className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-display font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {article.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                        {article.source && (
                          <span className="text-xs text-muted-foreground/70">{article.source}</span>
                        )}
                      </div>
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          اقرأ المزيد ←
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(articles.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFade(false);
                    setTimeout(() => {
                      setCurrentIndex(i * 3);
                      setFade(true);
                    }, 300);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 3) === i
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5"
                  }`}
                  aria-label={`مجموعة ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
