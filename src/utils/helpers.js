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
 * İlgili DOM elementine akıcı bir şekilde odaklanıp kaydırır ve dikkat çeker.
 */
export function scrollToElement(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('outline-2', 'outline-blue-500', 'transition-all');
    setTimeout(() => {
      el.classList.remove('outline-2', 'outline-blue-500', 'transition-all');
    }, 1800);
  }
}

/**
 * Türkiye telefon numaralarını WhatsApp evrensel bağlantısına (wa.me) dönüştürür.
 * Örn: "0533 123 45 67" -> "https://wa.me/905331234567?text=..."
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
  const encodedText = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${encodedText}`;
}

/**
 * Telefon metnini güvenli tel: bağlantı numarasına dönüştürür.
 * Birden fazla numara (örn: "ALO 159 / 0212 312 90 00") varsa birincil numarayı ayıklar.
 */
export function getCleanPhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  const str = rawPhone.toString().trim();
  // ALO 153, ALO 159, ALO 185, ALO 186 gibi kısa hat kontrolü
  const shortMatch = str.match(/\b(15[39]|18[56])\b/);
  if (shortMatch) return shortMatch[1];
  // Eğik çizgi veya tireyle ayrılmış ilk kısmı al
  const firstPart = str.split(/[\/|]/)[0].trim();
  return firstPart.replace(/[^0-9]/g, '');
}
