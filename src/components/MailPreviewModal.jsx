import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  FileText, 
  AlertTriangle,
  Info,
  Sparkles,
  ChevronDown,
  Camera
} from 'lucide-react';
import { formatWhatsAppUrl } from '../utils/helpers';

export default function MailPreviewModal({
  isOpen,
  onClose,
  selectedIssue,
  locationData,
  roadType,
  userNote,
  userName,
  selectedEmails,
  authorities
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [showMailOpeningHint, setShowMailOpeningHint] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const optionsMenuRef = useRef(null);

  // Dışarı tıklandığında diğer seçenekler menüsünü kapat
  useEffect(() => {
    if (!showOtherOptions) return;
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        setShowOtherOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOtherOptions]);

  // Escape tuşu ile pencereyi kapatma
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const primaryEmail = selectedEmails[0] || 'beyazmasa@ibb.gov.tr';
  const ccEmails = selectedEmails.slice(1).join(',');

  const districtTitle = locationData.districtName || 'İstanbul';
  const issueTitle = selectedIssue?.title || 'Kentsel Sorun / Yol Bozukluğu';

  const subject = `${districtTitle} - ${issueTitle} Bildirimi`;

  const mapLink = locationData.latitude && locationData.longitude
    ? `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
    : 'Belirtilmedi';

  let dateStr = '';
  try {
    dateStr = new Date().toLocaleString('tr-TR', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  } catch {
    dateStr = new Date().toLocaleString('tr-TR');
  }

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

Gereğinin yapılmasını ve konu hakkında tarafıma e-posta yoluyla bilgi verilmesini saygılarımla arz ederim.

${userName.trim() || 'Bir Kent Sakini'}
(KentGözü ile hazırlanmıştır)`;

  const mailtoUrl = `mailto:${primaryEmail}?${ccEmails ? `cc=${encodeURIComponent(ccEmails)}&` : ''}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(primaryEmail)}${ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : ''}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(primaryEmail)}${ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : ''}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleCopyText = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Kopyalanamadı', err);
    }
  };

  const handleSendMail = () => {
    setShowMailOpeningHint(true);
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 100);
  };

  const authWithWhatsApp = authorities.find((a) => a.email === primaryEmail && a.whatsapp) || authorities.find((a) => a.whatsapp);
  const whatsappUrl = authWithWhatsApp?.whatsapp
    ? formatWhatsAppUrl(authWithWhatsApp.whatsapp, `*${subject}*\n\n${body}`)
    : null;

  const whatsappInstitutionName = authWithWhatsApp?.district 
    ? `${authWithWhatsApp.district} Bel.` 
    : (authWithWhatsApp?.shortName || authWithWhatsApp?.name || '');

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 transition-colors cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hazır Resmi E-Posta Taslağı</h3>
              <p className="text-xs text-blue-100">
                E-posta istemcinizde açıp son kontrolü yaptıktan sonra tek tıkla gönderebilirsiniz.
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
          <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-slate-500 dark:text-slate-400 w-16 shrink-0">Kime (To):</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800 truncate">
                  {primaryEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(primaryEmail, 'primary')}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shrink-0 transition-colors"
                title="Kime e-posta adresini kopyala"
              >
                {copiedField === 'primary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {ccEmails && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 w-16 shrink-0">Bilgi (CC):</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 truncate">
                    {ccEmails}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(ccEmails, 'cc')}
                  className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shrink-0 transition-colors"
                  title="CC e-posta adreslerini kopyala"
                >
                  {copiedField === 'cc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-slate-500 dark:text-slate-400 w-16 shrink-0">Konu:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{subject}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(subject, 'subject')}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shrink-0 transition-colors"
                title="Konu başlığını kopyala"
              >
                {copiedField === 'subject' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Mail Metni Önizlemesi */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Dilekçe & Başvuru Metni (3071 Sayılı Kanun Uyarınca):
              </span>

              <button
                type="button"
                onClick={() => handleCopyText(body, 'body')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1.5 cursor-pointer bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/80 transition-colors self-end sm:self-auto"
              >
                {copiedField === 'body' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Kopyalandı!</span>
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
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 font-sans text-xs text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong>Fotoğraf Ekleme Notu:</strong> Varsa olay yeri fotoğraflarını mail uygulamanızdaki ataç (ek dosya) butonundan ekleyiniz.
            </div>
          </div>

          {showMailOpeningHint && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2 animate-in fade-in duration-150">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Varsayılan e-posta istemciniz açılıyor... Lütfen kontrol edip Gönder tuşuna basınız.</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 dark:bg-slate-900 px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Kapat ve Düzenle
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Diğer Seçenekler Dropdown Menüsü */}
            <div className="relative" ref={optionsMenuRef}>
              <button
                type="button"
                onClick={() => setShowOtherOptions((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <span>Diğer</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${showOtherOptions ? 'rotate-180' : ''}`} />
              </button>

              {showOtherOptions && (
                <div className="absolute bottom-full mb-2 right-0 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <a
                    href={outlookWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowOtherOptions(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Outlook Web</span>
                  </a>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <a
                    href="https://www.cimer.gov.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowOtherOptions(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>CİMER Başvuru Portalı</span>
                  </a>
                </div>
              )}
            </div>

            {/* Gmail Web Butonu */}
            <a
              href={gmailWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              title="Gmail Web İstemcisinde Aç"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Gmail Web</span>
            </a>

            {/* WhatsApp İhbar Butonu (Varsa doğrudan görünür) */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp İhbar{whatsappInstitutionName ? ` (${whatsappInstitutionName})` : ''}</span>
              </a>
            )}

            {/* Birincil Aksiyon Butonu */}
            <button
              type="button"
              onClick={handleSendMail}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>E-Posta ile Gönder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
