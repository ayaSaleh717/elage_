import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-background">i-Shifa </span>
            </div>
            <p className="text-sm leading-relaxed text-background/60">
              منصة رقمية شاملة للاستشارات الطبية عن بُعد مدعومة بالذكاء الاصطناعي
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-background mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-background transition-colors">المميزات</a></li>
              <li><a href="#how-it-works" className="hover:text-background transition-colors">كيف يعمل</a></li>
              <li><a href="#doctors" className="hover:text-background transition-colors">الأطباء</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-background mb-4">الحساب</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-background transition-colors">تسجيل الدخول</Link></li>
              <li><Link to="/register" className="hover:text-background transition-colors">إنشاء حساب</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-background mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li>info@i.shifa.com</li>
              <li>+963 50 000 0000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 text-center text-sm text-background/40">
          © 2026 آي- شفا . جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
