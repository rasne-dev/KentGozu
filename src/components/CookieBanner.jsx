import React, { useState, useEffect } from 'react';
import { Cookie, Check, ShieldCheck } from 'lucide-react';

export default function CookieBanner({ onOpenLegal, suppressed = false }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (suppressed) {
      setIsVisible(false);
      return;
    }
    const consent = localStorage.getItem('kentgozu-cookie-consent');
    if (!consent) {
      // İlk ziyarette küçük bir gecikmeyle göster
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [suppressed]);

  const handleAccept = () => {
    localStorage.setItem('kentgozu-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Çerez ve Gizlilik Bilgilendirmesi</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sitemizde reklam, analitik veya takip çerezi <strong>kullanılmaz</strong>. Yalnızca karanlık/aydınlık tema tercihiniz tarayıcınızda yerel olarak tutulur. Kişisel verileriniz hiçbir sunucuda depolanmaz ve yapay zekaya aktarılmaz.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onOpenLegal}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Yasal Detaylar</span>
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Anladım ve Kabul Ediyorum</span>
          </button>
        </div>
      </div>
    </div>
  );
}
