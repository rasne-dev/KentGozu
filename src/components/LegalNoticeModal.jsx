import React from 'react';
import { ShieldCheck, Scale, Lock, Eye, AlertCircle } from 'lucide-react';

export default function LegalNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
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

        <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto">
          {/* Anayasa 74 */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Anayasal Dilekçe Hakkı (Md. 74 & 3071 Sayılı Kanun)</span>
            </div>
            <p className="text-blue-950">
              Türkiye Cumhuriyeti Anayasası'nın 74. Maddesi ve 3071 Sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun uyarınca; her vatandaşın kendileriyle veya kamu ile ilgili dilek ve şikayetleri hakkında yetkili makamlara başvurma hakkı anayasal güvence altındadır. İdareler mevzuat gereği başvuruları inceleyerek en geç 30 gün içinde vatandaşa gerekçeli cevap vermekle yükümlüdür.
            </p>
          </div>

          {/* KVKK & Veri Güvenliği */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>Sıfır Sunucu Depolaması & KVKK Güvencesi</span>
            </div>
            <p className="text-emerald-950">
              KentGözü platformunda hiçbir kişisel veriniz, adınız, e-posta adresiniz veya çektiğiniz fotoğraflar merkezi bir sunucuda <strong>depolanmaz ve işlenmez</strong>. Uygulama tamamen tarayıcınızda (istemci taraflı) çalışır ve hazırladığı resmi şablonu doğrudan sizin kendi e-posta istemcinize aktarır. Gönderim tamamen sizin e-posta hesabınızdan yapılır.
            </p>
          </div>

          {/* Fotoğraf Çekimi & Özel Hayat */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Fotoğraf Çekerken Dikkat Edilecekler</span>
            </div>
            <p className="text-amber-950">
              6698 sayılı Kişisel Verilerin Korunması Kanunu gereğince; çektiğiniz fotoğraflarda yoldan geçen üçüncü şahısların yüzlerinin ve özel araç plakalarının görünmemesine özen gösteriniz. Sadece hasarlı yol, çukur, tabela veya mazgalın odaklandığı fotoğraflar yeterlidir.
            </p>
          </div>

          {/* Sorumluluk */}
          <div className="space-y-1 text-slate-500 pt-2 border-t border-slate-100">
            <p className="font-semibold text-slate-700">Kullanıcı Sorumluluğu:</p>
            <p>
              Gönderilen iletilerdeki ifadelerin doğruluğu ve hukuki sorumluluğu gönderen vatandaşa aittir. Kasıtlı asılsız ihbar veya hakaret niteliğindeki bildirimler yasal yaptırıma tabi olabilir.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
