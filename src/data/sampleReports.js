export const INITIAL_COMMUNITY_REPORTS = [
  {
    id: 'rep-1',
    issueTypeId: 'yol_cukur',
    issueTitle: 'Derin Yol Çukuru (Sağ Şerit)',
    district: 'Kadıköy',
    address: 'Moda Cad. No: 42, Caferağa Mah.',
    lat: 40.9875,
    lng: 29.0275,
    reportedAt: '2 saat önce',
    authority: 'Kadıköy Belediyesi & İBB',
    supportCount: 14,
    status: 'İletildi'
  },
  {
    id: 'rep-2',
    issueTypeId: 'rogar_mazgal',
    issueTitle: 'Kırık Yağmursuyu Mazgalı',
    district: 'Beşiktaş',
    address: 'Barbaros Bulvarı Girişi, Sinanpaşa',
    lat: 41.0425,
    lng: 29.0062,
    reportedAt: '4 saat önce',
    authority: 'İSKİ & İBB',
    supportCount: 28,
    status: 'İnceleniyor'
  },
  {
    id: 'rep-3',
    issueTypeId: 'tabela_levha',
    issueTitle: 'Devrilmiş Yaya Geçidi Tabelası',
    district: 'Şişli',
    address: 'Halaskargazi Cad. No: 110, Osmanbey',
    lat: 41.0542,
    lng: 28.9873,
    reportedAt: 'Dün',
    authority: 'İBB Ulaşım',
    supportCount: 6,
    status: 'İletildi'
  },
  {
    id: 'rep-4',
    issueTypeId: 'kaldirim_hasar',
    issueTitle: 'Sökülmüş ve Kırık Kaldırım Taşları',
    district: 'Ümraniye',
    address: 'Alemdağ Cad. No: 185, Yamanevler',
    lat: 41.0255,
    lng: 29.1128,
    reportedAt: '1 gün önce',
    authority: 'Ümraniye Belediyesi Fen İşleri',
    supportCount: 19,
    status: 'İnceleniyor'
  },
  {
    id: 'rep-5',
    issueTypeId: 'aydinlatma_direk',
    issueTitle: 'Yanmayan Sokak Aydınlatması',
    district: 'Üsküdar',
    address: 'Hakimiyeti Milliye Cad., Mimar Sinan',
    lat: 41.0248,
    lng: 29.0165,
    reportedAt: '6 saat önce',
    authority: 'AYEDAŞ & Üsküdar Belediyesi',
    supportCount: 9,
    status: 'İletildi'
  },
  {
    id: 'rep-6',
    issueTypeId: 'yol_cukur',
    issueTitle: 'D-100 Bağlantı Yolu Asfalt Bozulması',
    district: 'Bakırköy',
    address: 'E-5 İncirli Yan Yol Girişi',
    lat: 40.9995,
    lng: 28.8722,
    reportedAt: '5 saat önce',
    authority: 'Karayolları 1. Bölge (KGM)',
    supportCount: 42,
    status: 'İnceleniyor'
  },
  {
    id: 'rep-7',
    issueTypeId: 'cop_moloz',
    issueTitle: 'Yol Kenarına Bırakılmış İnşaat Molozu',
    district: 'Fatih',
    address: 'Fevzipaşa Cad. Arka Sokak, Akşemsettin',
    lat: 41.0182,
    lng: 28.9455,
    reportedAt: 'Dün',
    authority: 'Fatih Belediyesi Zabıta',
    supportCount: 11,
    status: 'İletildi'
  }
];

export function getStoredReports() {
  try {
    const data = localStorage.getItem('kentgozu-community-reports');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Raporlar okunamadı', e);
  }
  return INITIAL_COMMUNITY_REPORTS;
}

export function saveReportToCommunity(newReport) {
  try {
    const current = getStoredReports();
    const updated = [newReport, ...current];
    localStorage.setItem('kentgozu-community-reports', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Rapor kaydedilemedi', e);
    return [];
  }
}
