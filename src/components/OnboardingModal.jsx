import React, { useState, useEffect } from 'react';
import {
  Eye,
  Building2,
  Send,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  MapPin,
  Camera,
  Mail,
  CheckCircle2,
  FileCheck,
  Scale
} from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    badge: 'Sivil Katılım & Kent Gözlemi',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300/60 dark:border-blue-800/60',
    title: 'Şehrinize Göz Kulak Olun!',
    subtitle: 'İstanbul’un aksaklıklarını birlikte tespit ediyor, resmi kanallarla çözüme kavuşturuyoruz.',
    icon: Eye,
    gradient: 'from-blue-600 to-indigo-600',
    content: (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>KentGözü</strong>; yollardaki tehlikeli çukurlar, kırık kaldırımlar, aydınlatma arızaları veya su patlakları gibi kentsel sorunları saniyeler içinde tespit edip doğrudan yetkili kamu kurumuna iletmenizi sağlayan bağımsız ve açık kaynaklı bir sivil katılım platformudur.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block">Sahipsiz Sorun Yok</span>
              <span className="text-slate-500 dark:text-slate-400">Şehrinizdeki hasarları sahipsiz bırakmayın, çözüme katkı verin.</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-2.5">
            <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block">Resmi Dilekçe Hakkı</span>
              <span className="text-slate-500 dark:text-slate-400">Başvurularınız 3071 sayılı kanun kapsamında resmiyet kazanır.</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'authorities',
    badge: 'Akıllı Yetkili Eşleştirme',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300/60 dark:border-indigo-800/60',
    title: 'Yetkili Kurum Karmaşasına Son',
    subtitle: 'Hangi sokağın kime bağlı olduğunu düşünmenize gerek yok.',
    icon: Building2,
    gradient: 'from-indigo-600 to-purple-600',
    content: (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          İstanbul’da sokak ilçe belediyesine, ana cadde İBB’ye, otoyol Karayolları’na, su arızası İSKİ’ye, elektrik ise BEDAŞ veya AYEDAŞ’a aittir. KentGözü, konumunuza ve aksaklık türüne göre doğru kurumu sizin yerinize anında bulur.
        </p>
        <div className="space-y-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300">Ara Sokak & Parklar</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">39 İlçe Belediyesi</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300">Ana Arter, Cadde & Meydanlar</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">İstanbul Büyükşehir Bld. (İBB)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300">Su, Elektrik & Otoyollar</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">İSKİ, BEDAŞ/AYEDAŞ, Karayolları</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'steps',
    badge: 'Nasıl Çalışır?',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-800/60',
    title: '3 Kolay Adımda Bildirim',
    subtitle: 'Dakikalar içinde resmi başvurunuzu hazırlayın ve gönderin.',
    icon: Send,
    gradient: 'from-emerald-600 to-teal-600',
    content: (
      <div className="space-y-2.5 pt-1">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white">1. Konumu Belirleyin</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">GPS butonu ile bulunduğunuz yeri anında tespit edin veya ilçe ve sokağınızı haritadan seçin.</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white">2. Sorun ve Fotoğrafı Ekleyin</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">Aksaklık tipini (çukur, aydınlatma, kaldırım vb.) seçin ve durumun fotoğrafını ekleyin.</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white">3. Resmi E-postayı Gönderin</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">Oluşturulan mevzuata uygun resmi başvuru metnini tek tıkla e-posta istemcinizden ilgili kuruma iletin.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'privacy',
    badge: 'Yasal Haklar & Gizlilik',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-800/60',
    title: 'Verileriniz ve Haklarınız Güvende',
    subtitle: 'Sıfır sunucu depolaması ve anayasal güvence.',
    icon: ShieldCheck,
    gradient: 'from-blue-600 to-emerald-600',
    content: (
      <div className="space-y-3">
        <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Anayasa Md. 74 — 30 Günlük Yasal Cevap Süresi</span>
          </div>
          <p className="text-blue-950 dark:text-blue-200/80 leading-relaxed">
            Dilekçe hakkı anayasal bir vatandaşlık hakkıdır. Yetkili kamu kurumları, başvurularınıza en geç 30 gün içinde gerekçeli resmi cevap iletmekle yükümlüdür.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Sıfır Sunucu Depolaması & Tam Gizlilik</span>
          </div>
          <p className="text-emerald-950 dark:text-emerald-200/80 leading-relaxed">
            Fotoğraflarınız, konumunuz veya iletişim bilgileriniz hiçbir merkezi sunucuda saklanmaz. Her şey yalnızca cihazınızda çalışır ve doğrudan kendi e-posta hesabınızdan kuruma iletilir.
          </p>
        </div>
      </div>
    )
  }
];

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step whenever opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleComplete();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('kentgozu-onboarding-seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-step-title"
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Rehber Turu • {currentStep + 1} / {ONBOARDING_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Turu Atla
            </button>
            <button
              onClick={handleComplete}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto max-h-[72vh]">
          {/* Top Title & Icon */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <StepIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <div className="inline-block">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${step.badgeColor}`}>
                  {step.badge}
                </span>
              </div>
              <h3 id="onboarding-step-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Step Specific Content */}
          <div className="pt-2">
            {step.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {ONBOARDING_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-blue-600 dark:bg-blue-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
                aria-label={`Adım ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Geri</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                isLastStep
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
              }`}
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hemen Başla</span>
                </>
              ) : (
                <>
                  <span>İleri</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
