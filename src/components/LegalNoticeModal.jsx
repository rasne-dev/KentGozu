import React, { useEffect } from 'react';
import { Scale, Lock, AlertCircle, ShieldAlert, ExternalLink } from 'lucide-react';

export default function LegalNoticeModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 transition-colors cursor-default"
      >
        <div className="bg-slate-900 dark:bg-slate-950 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Yasal Dayanak & KVKK Bilgilendirmesi</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto">
          {/* Resmi Kurum Feragatnamesi (Google Play & Mevzuat Uyumluluğu) */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Resmi Kurum ve Temsil Feragatnamesi</span>
            </div>
            <p className="text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
              Bu uygulama herhangi bir resmi kamu kurumunu veya belediyeyi temsil etmemektedir. Uygulama, vatandaşların anayasal dilekçe haklarını kullanarak kamuya açık resmi kurumsal e-posta adreslerine kentsel aksaklık bildirimi hazırlamasını kolaylaştıran bağımsız ve açık kaynaklı bir sivil katılım aracıdır.
            </p>
          </div>

          {/* Anayasa 74 */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
              <Scale className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Anayasal Dilekçe Hakkı (Md. 74 & 3071 Sayılı Kanun)</span>
            </div>
            <p className="text-blue-950 dark:text-blue-200/90">
              Türkiye Cumhuriyeti Anayasası'nın 74. Maddesi ve 3071 Sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun uyarınca; her vatandaşın kendileriyle veya kamu ile ilgili dilek ve şikayetleri hakkında yetkili makamlara başvurma hakkı anayasal güvence altındadır. İdareler mevzuat gereği başvuruları inceleyerek en geç 30 gün içinde vatandaşa gerekçeli cevap vermekle yükümlüdür.
            </p>
          </div>

          {/* KVKK & Veri Güvenliği */}
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Sıfır Sunucu Depolaması & KVKK Güvencesi</span>
            </div>
            <p className="text-emerald-950 dark:text-emerald-200/90">
              KentGözü platformunda hiçbir kişisel veriniz, adınız, e-posta adresiniz veya çektiğiniz fotoğraflar merkezi bir sunucuda <strong>depolanmaz ve işlenmez</strong>. Uygulama tamamen tarayıcınızda (istemci taraflı) çalışır ve hazırladığı resmi şablonu doğrudan sizin kendi e-posta istemcinize aktarır. Gönderim tamamen sizin e-posta hesabınızdan yapılır.
            </p>
          </div>

          {/* Fotoğraf Çekimi & Özel Hayat */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Fotoğraf Çekerken Dikkat Edilecekler</span>
            </div>
            <p className="text-amber-950 dark:text-amber-200/90">
              6698 sayılı Kişisel Verilerin Korunması Kanunu gereğince; çektiğiniz fotoğraflarda yoldan geçen üçüncü şahısların yüzlerinin ve özel araç plakalarının görünmemesine özen gösteriniz. Sadece hasarlı yol, çukur, tabela veya mazgalın odaklandığı fotoğraflar yeterlidir.
            </p>
          </div>

          {/* Sorumluluk */}
          <div className="space-y-1 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Kullanıcı Sorumluluğu:</p>
            <p>
              Gönderilen iletilerdeki ifadelerin doğruluğu ve hukuki sorumluluğu gönderen vatandaşa aittir. Kasıtlı asılsız ihbar veya hakaret niteliğindeki bildirimler yasal yaptırıma tabi olabilir.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href="https://rasne-dev.github.io/KentGozu/privacy-policy.html"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Gizlilik Politikası (Web Sayfası)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
