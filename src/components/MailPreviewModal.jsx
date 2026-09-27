import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  FileText, 
  Eye, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function MailPreviewModal({
  isOpen,
  onClose,
  selectedIssue,
  locationData,
  roadType,
  userNote,
  userName,
  selectedEmails,
  authorities,
  photoAttached
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Birincil ve ikincil alıcılar
  const primaryEmail = selectedEmails[0] || 'beyazmasa@ibb.gov.tr';
  const ccEmails = selectedEmails.slice(1).join(',');

  const districtTitle = locationData.districtName || 'İstanbul';
  const issueTitle = selectedIssue?.title || 'Kentsel Sorun / Yol Bozukluğu';

  const subject = `[KentGözü] ${districtTitle} - ${issueTitle} Bildirimi`;

  const mapLink = locationData.latitude && locationData.longitude
    ? `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
    : 'Belirtilmedi';

  const dateStr = new Date().toLocaleString('tr-TR', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  const body = `Sayın İlgili Kurum ve Belediye Yetkilileri,

3071 sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun kapsamında, aşağıda detayları, adresi ve koordinatları belirtilen kentsel aksaklığın incelenerek ivedilikle giderilmesini arz ve talep ederim.

■ BİLDİRİM BİLGİLERİ:
- Sorun Türü: ${issueTitle}
- Açıklama: ${userNote.trim() || selectedIssue?.placeholder || 'Kentsel aksaklık yerinde tespit edilmiştir.'}
- Tarih / Zaman: ${dateStr}

■ KONUM VE ADRES BİLGİLERİ:
- İlçe: ${districtTitle} / İstanbul
- Açık Adres / Mahalle: ${locationData.fullAddress || 'Adres bilgisi harita linkindedir.'}
- GPS Koordinatları: ${locationData.latitude && locationData.longitude ? `${locationData.latitude}, ${locationData.longitude}` : 'Belirtilmedi'}
- Google Haritalar Konumu: ${mapLink}

■ EK BİLGİ:
${photoAttached ? 'Durumu gösteren fotoğraf ek olarak iliştirilmiştir.' : 'Görsel eklenmemiştir, koordinat konumundan incelenebilir.'}

Gereğinin yapılmasını ve konu hakkında tarafıma e-posta yoluyla bilgi verilmesini saygılarımla arz ederim.

${userName.trim() ? `Vatandaş: ${userName.trim()}` : 'Bir Kent Sakini'}
(Bu bildirim taslağı KentGözü Açık Kaynak Kentsel Katılım Platformu aracılığıyla oluşturulmuştur.)`;

  const mailtoUrl = `mailto:${primaryEmail}?${ccEmails ? `cc=${encodeURIComponent(ccEmails)}&` : ''}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(primaryEmail)}${ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : ''}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Panoya Kopyala
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Kopyalanamadı', err);
    }
  };

  // WhatsApp seçeneği (eğer birincil kurumun WhatsApp hattı varsa)
  const primaryAuthObj = authorities.find((a) => a.email === primaryEmail);
  const whatsappNum = primaryAuthObj?.whatsapp?.replace(/[^0-9]/g, '');
  const whatsappUrl = whatsappNum
    ? `https://api.whatsapp.com/send?phone=${whatsappNum}&text=${encodeURIComponent(`[KentGözü Bildirimi]\n${subject}\n\n${body}`)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hazır E-Posta Taslağı</h3>
              <p className="text-xs text-blue-100">
                Tek tıkla mail istemcinizde açıp kontrol ettikten sonra gönderebilirsiniz.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Gönderilecek Adresler Özeti */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 w-16">Kime (To):</span>
              <span className="font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {primaryEmail}
              </span>
            </div>
            {ccEmails && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 w-16">Bilgi (CC):</span>
                <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                  {ccEmails}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 w-16">Konu:</span>
              <span className="font-medium text-slate-800">{subject}</span>
            </div>
          </div>

          {/* Mail Metni Önizlemesi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Dilekçe & Şikayet Metni Önizlemesi:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Metni Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={11}
              value={body}
              className="w-full p-3 bg-slate-50 font-sans text-xs text-slate-700 rounded-xl border border-slate-200 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {photoAttached && (
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Fotoğrafı Eklemeyi Unutmayın:</strong> E-posta uygulamanız açıldığında çektiğiniz fotoğrafı mailinize <em>"Dosya Ekle" (Attachment)</em> butonuyla ekleyiniz.
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Kapat ve Düzenle
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp İhbar</span>
              </a>
            )}

            <a
              href={gmailWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Gmail Web'de Aç</span>
            </a>

            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
              <span>E-Posta Uygulamasıyla Gönder</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
