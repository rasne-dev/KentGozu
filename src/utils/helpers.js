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
