import React from 'react';
import { Smartphone, Download, X, ArrowRight, ShieldCheck, Zap, Camera } from 'lucide-react';

export default function MobileAppPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    localStorage.setItem('kentgozu-apk-prompt-seen', 'true');
    window.open('https://github.com/rasne-dev/KentGozu/releases/latest', '_blank');
    onClose();
  };

  const handleDismiss = () => {
    localStorage.setItem('kentgozu-apk-prompt-seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apk-modal-title"
      >
        {/* Header / Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-800/60">
                  Android APK Yayında
                </span>
              </div>
              <h3 id="apk-modal-title" className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                KentGözü Mobil Uygulaması
              </h3>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          KentGözü'nü akıllı telefonunuzda daha akıcı, pratik ve doğrudan kamera desteğiyle kullanmak ister misiniz? Resmi Android uygulamasını cihazınıza hemen yükleyebilirsiniz.
        </p>

        {/* Feature bullets */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Hızlı Erişim</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Tek dokunuş</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-1">
            <Camera className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Kamera</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Anında çekim</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Ücretsiz</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Açık kaynak</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Uygulamayı İndir (APK)</span>
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer text-center"
          >
            Web Sürümü ile Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}
