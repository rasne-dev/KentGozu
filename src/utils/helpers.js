/**
 * KentGözü Yardımcı Fonksiyonlar ve Formatlayıcılar
 */

/**
 * Türkçe karakterleri ve aksanları duyarsız hale getirerek arama ve eşleştirme sağlar.
 * Örn: "Kadıköy" -> "kadikoy", "ŞİŞLİ" -> "sisli", "Üsküdar" -> "uskudar"
 */
export function normalizeTurkish(text) {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u');
}

/**
 * Dosya boyutunu insan odaklı okunaklı formata dönüştürür (KB veya MB).
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  if (bytes < k * 1024) {
    return `${Math.round(bytes / k)} KB`;
  }
  return `${(bytes / (k * k)).toFixed(1)} MB`;
}

/**
 * İlgili DOM elementine akıcı bir şekilde odaklanıp kaydırır.
 */
export function scrollToElement(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-2', 'ring-amber-500', 'animate-pulse');
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-amber-500', 'animate-pulse');
    }, 2000);
  }
}

/**
 * Türkiye telefon numaralarını WhatsApp API için uluslararası formata (+90) dönüştürür.
 * Örn: "0533 123 45 67" -> "https://api.whatsapp.com/send?phone=905331234567&text=..."
 */
export function formatWhatsAppUrl(rawPhone, text = '') {
  if (!rawPhone) return null;
  let digits = rawPhone.toString().replace(/[^0-9]/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) {
    digits = '90' + digits.substring(1);
  } else if (!digits.startsWith('90')) {
    digits = '90' + digits;
  }
  const encodedText = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://api.whatsapp.com/send?phone=${digits}${encodedText}`;
}
