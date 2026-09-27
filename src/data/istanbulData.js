// İstanbul ve Türkiye Yetkili Kamu Kurumları & İlçe Belediyeleri Veritabanı

// 1. Karayolları Genel Müdürlüğü (KGM) 1. Bölge (İstanbul ve Çevresi)
export const KGM_INFO = {
  id: 'kgm',
  name: 'Karayolları Genel Müdürlüğü (1. Bölge Müdürlüğü - İstanbul)',
  shortName: 'KGM (Karayolları 1. Bölge)',
  email: 'bol01@kgm.gov.tr',
  secondaryEmail: 'bilgiedinme@kgm.gov.tr',
  phone: 'ALO 159 / 0212 312 90 00',
  website: 'https://www.kgm.gov.tr',
  description: 'Otoyollar (TEM, Kuzey Marmara), E-5 (D-100 Karayolu), Çevre Yolları, Boğaz Köprüleri ve devlet yolları sorumluluğundadır.',
  badge: 'Otoyol & Devlet Yolları'
};

// 2. İstanbul Büyükşehir Belediyesi (İBB)
export const IBB_INFO = {
  id: 'ibb',
  name: 'İstanbul Büyükşehir Belediyesi (İBB - Çözüm Merkezi)',
  shortName: 'İBB Beyaz Masa',
  email: 'beyazmasa@ibb.gov.tr',
  secondaryEmail: 'bilgiedinme@ibb.gov.tr',
  phone: 'ALO 153',
  whatsapp: '+905521530034',
  website: 'https://www.ibb.istanbul',
  description: 'Genişliği 14 metre üzeri ana arterler, bulvarlar, metrobüs ve tramvay güzergahları, ana caddeler ve meydanlar İBB yetkisindedir.',
  badge: 'Ana Arter & Bulvarlar'
};

// 3. Su ve Kanalizasyon İdaresi (İSKİ)
export const ISKI_INFO = {
  id: 'iski',
  name: 'İSKİ Genel Müdürlüğü (İstanbul Su ve Kanalizasyon)',
  shortName: 'İSKİ',
  email: 'iski@iski.gov.tr',
  phone: 'ALO 185',
  website: 'https://www.iski.istanbul',
  description: 'Kanalizasyon, yağmur suyu mazgalları, rögar kapakları, su patlakları ve altyapı kazı alanları yetkisindedir.',
  badge: 'Mazgal & Altyapı'
};

// 4. Elektrik Dağıtım Şirketleri (Aydınlatma & Direkler)
export const ELECTRICITY_COMPANIES = {
  avrupa: {
    id: 'bedas',
    name: 'BEDAŞ (Boğaziçi Elektrik Dağıtım - Avrupa Yakası)',
    shortName: 'BEDAŞ',
    email: 'alo186@bedas.com.tr',
    phone: 'ALO 186',
    website: 'https://www.bedas.com.tr',
    description: 'Avrupa yakasındaki sokak aydınlatmaları, trafolar ve elektrik direkleri sorumlusudur.',
    badge: 'Sokak Lambası & Elektrik'
  },
  anadolu: {
    id: 'ayedas',
    name: 'AYEDAŞ (Anadolu Yakası Elektrik Dağıtım)',
    shortName: 'AYEDAŞ',
    email: 'iletisim@ayedas.com.tr',
    phone: 'ALO 186',
    website: 'https://www.ayedas.com.tr',
    description: 'Anadolu yakasındaki sokak lambaları, aydınlatma arızaları ve direk sorumlusudur.',
    badge: 'Sokak Lambası & Elektrik'
  }
};

// Yol Tipleri ve Yetki Sınıflandırması
export const ROAD_TYPES = [
  {
    id: 'neighborhood',
    label: 'Mahalle İçi / Ara Sokak',
    authorityDesc: 'İlçe Belediyesi yetkisindedir.',
    primaryAuthority: 'district',
    secondaryAuthority: null,
    icon: 'Home'
  },
  {
    id: 'main_artery',
    label: 'Ana Cadde / Bulvar / Meydan',
    authorityDesc: 'İBB (İstanbul Büyükşehir Belediyesi) yetkisindedir.',
    primaryAuthority: 'ibb',
    secondaryAuthority: 'district',
    icon: 'Building2'
  },
  {
    id: 'highway',
    label: 'Otoyol / TEM / E-5 (D-100) / Çevre Yolu',
    authorityDesc: 'Karayolları Genel Müdürlüğü (KGM 1. Bölge) yetkisindedir.',
    primaryAuthority: 'kgm',
    secondaryAuthority: 'ibb',
    icon: 'Car'
  },
  {
    id: 'unknown',
    label: 'Emin Değilim (Her İki Kuruma da Gönder)',
    authorityDesc: 'İlçe Belediyesi ve İBB ortak bilgilendirilir.',
    primaryAuthority: 'district',
    secondaryAuthority: 'ibb',
    icon: 'HelpCircle'
  }
];

// İstanbul'un 39 İlçe Belediyesi
export const ISTANBUL_DISTRICTS = [
  {
    id: 'adalar',
    name: 'Adalar Belediyesi',
    district: 'Adalar',
    side: 'Anadolu',
    email: 'adalar@adalar.bel.tr',
    phone: '0216 382 60 00',
    whatsapp: '0533 052 34 50',
    website: 'https://www.adalar.bel.tr'
  },
  {
    id: 'arnavutkoy',
    name: 'Arnavutköy Belediyesi',
    district: 'Arnavutköy',
    side: 'Avrupa',
    email: 'arnavutkoy@arnavutkoy.bel.tr',
    phone: '444 44 59',
    whatsapp: '0530 918 01 01',
    website: 'https://www.arnavutkoy.bel.tr'
  },
  {
    id: 'atasehir',
    name: 'Ataşehir Belediyesi',
    district: 'Ataşehir',
    side: 'Anadolu',
    email: 'iletisim@atasehir.bel.tr',
    phone: '0216 570 50 00',
    whatsapp: '0530 041 33 00',
    website: 'https://www.atasehir.bel.tr'
  },
  {
    id: 'avcilar',
    name: 'Avcılar Belediyesi',
    district: 'Avcılar',
    side: 'Avrupa',
    email: 'cozummerkezi@avcilar.bel.tr',
    phone: '444 69 89',
    whatsapp: '0535 010 01 53',
    website: 'https://www.avcilar.bel.tr'
  },
  {
    id: 'bagcilar',
    name: 'Bağcılar Belediyesi',
    district: 'Bağcılar',
    side: 'Avrupa',
    email: 'halklailiskiler@bagcilar.bel.tr',
    phone: '0212 410 06 00',
    whatsapp: '0530 310 70 70',
    website: 'https://www.bagcilar.bel.tr'
  },
  {
    id: 'bahcelievler',
    name: 'Bahçelievler Belediyesi',
    district: 'Bahçelievler',
    side: 'Avrupa',
    email: 'bimer@bahcelievler.bel.tr',
    phone: '444 03 11',
    whatsapp: '0532 590 03 11',
    website: 'https://www.bahcelievler.bel.tr'
  },
  {
    id: 'bakirkoy',
    name: 'Bakırköy Belediyesi',
    district: 'Bakırköy',
    side: 'Avrupa',
    email: 'bakirkoy@bakirkoy.bel.tr',
    phone: '444 68 11',
    whatsapp: '0530 468 11 00',
    website: 'https://www.bakirkoy.bel.tr'
  },
  {
    id: 'basaksehir',
    name: 'Başakşehir Belediyesi',
    district: 'Başakşehir',
    side: 'Avrupa',
    email: 'iletisim@basaksehir.bel.tr',
    phone: '444 0 669',
    whatsapp: '0549 840 84 84',
    website: 'https://www.basaksehir.bel.tr'
  },
  {
    id: 'bayrampasa',
    name: 'Bayrampaşa Belediyesi',
    district: 'Bayrampaşa',
    side: 'Avrupa',
    email: 'bayrampasa@bayrampasa.bel.tr',
    phone: '444 19 90',
    whatsapp: '0533 153 19 90',
    website: 'https://www.bayrampasa.bel.tr'
  },
  {
    id: 'besiktas',
    name: 'Beşiktaş Belediyesi',
    district: 'Beşiktaş',
    side: 'Avrupa',
    email: 'iletisim@besiktas.bel.tr',
    phone: '444 44 55',
    whatsapp: '0530 200 44 55',
    website: 'https://www.besiktas.bel.tr'
  },
  {
    id: 'beykoz',
    name: 'Beykoz Belediyesi',
    district: 'Beykoz',
    side: 'Anadolu',
    email: 'cozummerkezi@beykoz.bel.tr',
    phone: '444 66 61',
    whatsapp: '0530 075 66 61',
    website: 'https://www.beykoz.bel.tr'
  },
  {
    id: 'beylikduzu',
    name: 'Beylikdüzü Belediyesi',
    district: 'Beylikdüzü',
    side: 'Avrupa',
    email: 'iletisim@beylikduzu.bel.tr',
    phone: '444 09 39',
    whatsapp: '0533 030 09 39',
    website: 'https://www.beylikduzu.bel.tr'
  },
  {
    id: 'beyoglu',
    name: 'Beyoğlu Belediyesi',
    district: 'Beyoğlu',
    side: 'Avrupa',
    email: 'iletisim@beyoglu.bel.tr',
    phone: '444 01 60',
    whatsapp: '0530 460 01 60',
    website: 'https://www.beyoglu.bel.tr'
  },
  {
    id: 'buyukcekmece',
    name: 'Büyükçekmece Belediyesi',
    district: 'Büyükçekmece',
    side: 'Avrupa',
    email: 'iletisim@bcekmece.bel.tr',
    phone: '444 0 340',
    whatsapp: '0530 340 03 40',
    website: 'https://www.bcekmece.bel.tr'
  },
  {
    id: 'catalca',
    name: 'Çatalca Belediyesi',
    district: 'Çatalca',
    side: 'Avrupa',
    email: 'iletisim@catalca.bel.tr',
    phone: '0212 789 10 03',
    whatsapp: '0530 468 34 34',
    website: 'https://www.catalca.bel.tr'
  },
  {
    id: 'cekmekoy',
    name: 'Çekmeköy Belediyesi',
    district: 'Çekmeköy',
    side: 'Anadolu',
    email: 'iletisim@cekmekoy.bel.tr',
    phone: '0216 600 0 600',
    whatsapp: '0533 600 0 600',
    website: 'https://www.cekmekoy.bel.tr'
  },
  {
    id: 'esenler',
    name: 'Esenler Belediyesi',
    district: 'Esenler',
    side: 'Avrupa',
    email: 'esenler@esenler.bel.tr',
    phone: '444 00 73',
    whatsapp: '0530 700 00 73',
    website: 'https://www.esenler.bel.tr'
  },
  {
    id: 'esenyurt',
    name: 'Esenyurt Belediyesi',
    district: 'Esenyurt',
    side: 'Avrupa',
    email: 'esenyurt@esenyurt.bel.tr',
    phone: '444 0 411',
    whatsapp: '0530 500 04 11',
    website: 'https://www.esenyurt.bel.tr'
  },
  {
    id: 'eyupsultan',
    name: 'Eyüpsultan Belediyesi',
    district: 'Eyüpsultan',
    side: 'Avrupa',
    email: 'beyazmasa@eyupsultan.bel.tr',
    phone: '444 30 00',
    whatsapp: '0538 440 30 00',
    website: 'https://www.eyupsultan.bel.tr'
  },
  {
    id: 'fatih',
    name: 'Fatih Belediyesi',
    district: 'Fatih',
    side: 'Avrupa',
    email: 'bilgi@fatih.bel.tr',
    phone: '0212 453 14 53',
    whatsapp: '0530 453 14 53',
    website: 'https://www.fatih.bel.tr'
  },
  {
    id: 'gaziosmanpasa',
    name: 'Gaziosmanpaşa Belediyesi',
    district: 'Gaziosmanpaşa',
    side: 'Avrupa',
    email: 'gop@gaziosmanpasa.bel.tr',
    phone: '444 19 84',
    whatsapp: '0530 444 19 84',
    website: 'https://www.gaziosmanpasa.bel.tr'
  },
  {
    id: 'gungoren',
    name: 'Güngören Belediyesi',
    district: 'Güngören',
    side: 'Avrupa',
    email: 'info@gungoren.bel.tr',
    phone: '444 28 80',
    whatsapp: '0530 028 80 00',
    website: 'https://www.gungoren.bel.tr'
  },
  {
    id: 'kadikoy',
    name: 'Kadıköy Belediyesi',
    district: 'Kadıköy',
    side: 'Anadolu',
    email: 'iletisim@kadikoy.bel.tr',
    phone: '444 55 22',
    whatsapp: '0533 155 55 22',
    website: 'https://www.kadikoy.bel.tr'
  },
  {
    id: 'kagithane',
    name: 'Kağıthane Belediyesi',
    district: 'Kağıthane',
    side: 'Avrupa',
    email: 'info@kagithane.bel.tr',
    phone: '444 23 00',
    whatsapp: '0530 923 00 00',
    website: 'https://www.kagithane.bel.tr'
  },
  {
    id: 'kartal',
    name: 'Kartal Belediyesi',
    district: 'Kartal',
    side: 'Anadolu',
    email: 'komsuiletisim@kartal.bel.tr',
    phone: '444 4 578',
    whatsapp: '0532 153 05 78',
    website: 'https://www.kartal.bel.tr'
  },
  {
    id: 'kucukcekmece',
    name: 'Küçükçekmece Belediyesi',
    district: 'Küçükçekmece',
    side: 'Avrupa',
    email: 'iletisim@kucukcekmece.bel.tr',
    phone: '444 4 360',
    whatsapp: '0530 360 43 60',
    website: 'https://www.kucukcekmece.bel.tr'
  },
  {
    id: 'maltepe',
    name: 'Maltepe Belediyesi',
    district: 'Maltepe',
    side: 'Anadolu',
    email: 'halklailiskiler@maltepe.bel.tr',
    phone: '444 17 06',
    whatsapp: '0530 417 06 00',
    website: 'https://www.maltepe.bel.tr'
  },
  {
    id: 'pendik',
    name: 'Pendik Belediyesi',
    district: 'Pendik',
    side: 'Anadolu',
    email: 'iletisim@pendik.bel.tr',
    phone: '444 81 80',
    whatsapp: '0530 818 01 80',
    website: 'https://www.pendik.bel.tr'
  },
  {
    id: 'sancaktepe',
    name: 'Sancaktepe Belediyesi',
    district: 'Sancaktepe',
    side: 'Anadolu',
    email: 'iletisim@sancaktepe.bel.tr',
    phone: '0216 622 33 33',
    whatsapp: '0530 622 33 33',
    website: 'https://www.sancaktepe.bel.tr'
  },
  {
    id: 'sariyer',
    name: 'Sarıyer Belediyesi',
    district: 'Sarıyer',
    side: 'Avrupa',
    email: 'iletisim@sariyer.bel.tr',
    phone: '444 1 722',
    whatsapp: '0530 722 01 72',
    website: 'https://www.sariyer.bel.tr'
  },
  {
    id: 'silivri',
    name: 'Silivri Belediyesi',
    district: 'Silivri',
    side: 'Avrupa',
    email: 'iletisim@silivri.bel.tr',
    phone: '444 20 47',
    whatsapp: '0530 444 20 47',
    website: 'https://www.silivri.bel.tr'
  },
  {
    id: 'sultanbeyli',
    name: 'Sultanbeyli Belediyesi',
    district: 'Sultanbeyli',
    side: 'Anadolu',
    email: 'iletisim@sultanbeyli.bel.tr',
    phone: '0216 564 13 00',
    whatsapp: '0530 564 13 00',
    website: 'https://www.sultanbeyli.bel.tr'
  },
  {
    id: 'sultangazi',
    name: 'Sultangazi Belediyesi',
    district: 'Sultangazi',
    side: 'Avrupa',
    email: 'sultangazi@sultangazi.bel.tr',
    phone: '0212 459 34 34',
    whatsapp: '0530 459 34 34',
    website: 'https://www.sultangazi.bel.tr'
  },
  {
    id: 'sile',
    name: 'Şile Belediyesi',
    district: 'Şile',
    side: 'Anadolu',
    email: 'iletisim@sile.bel.tr',
    phone: '444 74 53',
    whatsapp: '0530 474 53 00',
    website: 'https://www.sile.bel.tr'
  },
  {
    id: 'sisli',
    name: 'Şişli Belediyesi',
    district: 'Şişli',
    side: 'Avrupa',
    email: 'cozum@sisli.bel.tr',
    phone: '444 31 12',
    whatsapp: '0530 444 31 12',
    website: 'https://www.sisli.bel.tr'
  },
  {
    id: 'tuzla',
    name: 'Tuzla Belediyesi',
    district: 'Tuzla',
    side: 'Anadolu',
    email: 'iletisim@tuzla.bel.tr',
    phone: '444 09 06',
    whatsapp: '0530 906 00 00',
    website: 'https://www.tuzla.bel.tr'
  },
  {
    id: 'umraniye',
    name: 'Ümraniye Belediyesi',
    district: 'Ümraniye',
    side: 'Anadolu',
    email: 'iletisim@umraniye.bel.tr',
    phone: '444 98 22',
    whatsapp: '0530 498 22 00',
    website: 'https://www.umraniye.bel.tr'
  },
  {
    id: 'uskudar',
    name: 'Üsküdar Belediyesi',
    district: 'Üsküdar',
    side: 'Anadolu',
    email: 'beyazmasa@uskudar.bel.tr',
    phone: '444 0 875',
    whatsapp: '0530 875 00 00',
    website: 'https://www.uskudar.bel.tr'
  },
  {
    id: 'zeytinburnu',
    name: 'Zeytinburnu Belediyesi',
    district: 'Zeytinburnu',
    side: 'Avrupa',
    email: 'cozum@zeytinburnu.bel.tr',
    phone: '444 19 84',
    whatsapp: '0530 198 40 00',
    website: 'https://www.zeytinburnu.bel.tr'
  }
];

// Akıllı Yetki Belirleme Fonksiyonu
export function determineResponsibleAuthorities({
  districtObj,
  roadType = 'neighborhood',
  issueTypeId = ''
}) {
  const selectedAuthorities = [];
  const side = districtObj?.side === 'Anadolu' ? 'anadolu' : 'avrupa';

  // 1. Yol yetkisine göre ana ve ikincil kurum
  if (roadType === 'highway') {
    // Karayolları 1. Bölge
    selectedAuthorities.push({
      ...KGM_INFO,
      role: 'Birincil Yetkili (Otoyol / Devlet Yolu İdaresi)',
      isPrimary: true
    });
    // İBB bilgilendirme
    selectedAuthorities.push({
      ...IBB_INFO,
      role: 'Bilgilendirme (Büyükşehir Belediyesi)',
      isPrimary: false
    });
  } else if (roadType === 'main_artery') {
    // İBB Ana arter
    selectedAuthorities.push({
      ...IBB_INFO,
      role: 'Birincil Yetkili (Ana Arter & Bulvar İdaresi)',
      isPrimary: true
    });
    if (districtObj) {
      selectedAuthorities.push({
        ...districtObj,
        role: `İlgili İlçe Belediyesi (${districtObj.district})`,
        isPrimary: false
      });
    }
  } else {
    // Mahalle / Ara Sokak
    if (districtObj) {
      selectedAuthorities.push({
        ...districtObj,
        role: 'Birincil Yetkili (İlçe Belediyesi Fen İşleri / Çözüm Merkezi)',
        isPrimary: true
      });
    }
    // İBB de destek olarak eklenebilir
    selectedAuthorities.push({
      ...IBB_INFO,
      role: 'Koordinasyon / Destek (İBB Beyaz Masa)',
      isPrimary: false
    });
  }

  // 2. Özel Sorun Türü İhtisas Kurumları
  if (issueTypeId === 'rogar_mazgal') {
    // Mazgal ve rögar için İSKİ doğrudan yetkilidir
    selectedAuthorities.unshift({
      ...ISKI_INFO,
      role: 'İhtisas Yetkilisi (Kanalizasyon & Yağmursuyu Mazgal İdaresi)',
      isPrimary: true
    });
  } else if (issueTypeId === 'aydinlatma_direk' || issueTypeId === 'elektrik_kablo_pano') {
    // Sokak aydınlatması ve açık elektrik/hasarlı pano için Elektrik Dağıtım Şirketi (BEDAŞ / AYEDAŞ)
    const elecCompany = ELECTRICITY_COMPANIES[side];
    selectedAuthorities.unshift({
      ...elecCompany,
      role: issueTypeId === 'elektrik_kablo_pano'
        ? `Acil İhtisas Yetkilisi (${districtObj?.side || 'İstanbul'} Elektrik Şebeke İdaresi)`
        : `İhtisas Yetkilisi (${districtObj?.side || 'İstanbul'} Elektrik & Aydınlatma Dağıtım)`,
      isPrimary: true
    });
  } else if (issueTypeId === 'trafik_isik') {
    // Sinyalizasyon ve trafik ışıkları İBB Trafik Müdürlüğü yetkisindedir
    selectedAuthorities.unshift({
      ...IBB_INFO,
      role: 'Birincil Yetkili (İBB Trafik & Sinyalizasyon İdaresi)',
      isPrimary: true
    });
  } else if (issueTypeId === 'yarali_hayvan') {
    // Yaralı ve acil tedaviye muhtaç sokak hayvanları
    if (districtObj) {
      selectedAuthorities.unshift({
        ...districtObj,
        role: `Acil Yetkili (${districtObj.district} Bel. Veterinerlik & Acil Müdahale)`,
        isPrimary: true
      });
    }
  } else if (issueTypeId === 'basibos_hayvan') {
    // Başıboş ve saldırgan sahipsiz hayvan ihbarı
    if (districtObj) {
      selectedAuthorities.unshift({
        ...districtObj,
        role: `Birincil Yetkili (${districtObj.district} Bel. Veterinerlik & Zabıta Müdürlüğü)`,
        isPrimary: true
      });
    }
  } else if (issueTypeId === 'hasere_ilaclama') {
    // Haşere ve sivrisinek ilaçlama
    if (districtObj) {
      selectedAuthorities.unshift({
        ...districtObj,
        role: `Birincil Yetkili (${districtObj.district} Bel. Çevre Koruma & Temizlik İşleri)`,
        isPrimary: true
      });
    }
  } else if (issueTypeId === 'altyapi_kazi') {
    // Kapatılmamış altyapı kazısı (İBB AYKOME koordinasyonu)
    selectedAuthorities.unshift({
      ...IBB_INFO,
      role: 'Altyapı Denetim (İBB AYKOME - Altyapı Koordinasyon)',
      isPrimary: true
    });
    if (districtObj) {
      selectedAuthorities.push({
        ...districtObj,
        role: `Saha Denetim (${districtObj.district} Bel. Fen İşleri)`,
        isPrimary: false
      });
    }
  } else if (issueTypeId === 'metruk_bina') {
    // Metruk bina ve yıkılma tehlikesi
    if (districtObj) {
      selectedAuthorities.unshift({
        ...districtObj,
        role: `Birincil Yetkili (${districtObj.district} Bel. İmar ve Şehircilik Müdürlüğü)`,
        isPrimary: true
      });
    }
  } else if (issueTypeId === 'gida_ruhsat') {
    // Gıda hijyeni ve seyyar satıcı denetimi
    if (districtObj) {
      selectedAuthorities.unshift({
        ...districtObj,
        role: `Birincil Yetkili (${districtObj.district} Bel. Zabıta ve Ruhsat Denetim)`,
        isPrimary: true
      });
    }
  }

  // Duplicate id engelleme
  const uniqueList = [];
  const seen = new Set();
  for (const auth of selectedAuthorities) {
    if (auth && auth.email && !seen.has(auth.email)) {
      seen.add(auth.email);
      uniqueList.push(auth);
    }
  }

  return uniqueList;
}

export function findDistrictByName(districtName) {
  if (!districtName) return null;
  const clean = districtName.trim().toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/\s*(ilcesi|belediyesi|ilce|belediye)\s*/g, '');

  return ISTANBUL_DISTRICTS.find(d => {
    const dClean = d.district.toLowerCase()
      .replace(/i̇/g, 'i')
      .replace(/ı/g, 'i')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u');
    return clean === dClean || clean.includes(dClean) || dClean.includes(clean);
  }) || null;
}
