export const ISSUE_TYPES = [
  {
    id: 'yol_cukur',
    title: 'Yol Çukuru & Asfalt Bozulması',
    icon: 'AlertTriangle',
    badge: 'Ulaşım',
    color: 'amber',
    placeholder: 'Örn: Yolun sağ şeridinde yaklaşık 40-50 cm genişliğinde araçlara ve motosikletlilere zarar verebilecek derin bir çukur oluşmuş durumda.',
    keywords: ['asfalt', 'cukur', 'yol', 'tumsek', 'kasis', 'delik', 'yarik', 'yama', 'zemin', 'arac', 'oto']
  },
  {
    id: 'kaldirim_hasar',
    title: 'Kaldırım & Parke Taşı Hasarı',
    icon: 'Footprints',
    badge: 'Yaya Güvenliği',
    color: 'orange',
    placeholder: 'Örn: Kaldırım taşları sökülmüş/kırılmış, yayaların ve bebek arabalarının geçişini engelliyor.',
    keywords: ['kaldirim', 'parke', 'tas', 'yaya', 'yuruyus', 'engelli', 'bebek arabasi', 'kirik tas', 'bordur']
  },
  {
    id: 'tabela_levha',
    title: 'Düşmüş Tabela & Trafik Levhası',
    icon: 'Signpost',
    badge: 'Trafik',
    color: 'blue',
    placeholder: 'Örn: Yaya geçidi / yön levhası yerinden kopmuş ve kaldırıma devrilmiş, görüşü ve yürüyüşü engelliyor.',
    keywords: ['tabela', 'levha', 'trafik levhasi', 'yol tabelasi', 'yaya gecidi', 'isaret', 'yon levhasi', 'direk']
  },
  {
    id: 'rogar_mazgal',
    title: 'Açık / Kırık Mazgal & Rögar',
    icon: 'ShieldAlert',
    badge: 'Acil Tehlike',
    color: 'red',
    placeholder: 'Örn: Yağmur suyu ızgarası kırılmış / açık kalmış, araç lastikleri ve yayalar için hayati tehlike oluşturuyor.',
    keywords: ['mazgal', 'rogar', 'kanalizasyon', 'lagim', 'yagmur suyu', 'izgara', 'kapak', 'su taskini', 'su baskini', 'iski']
  },
  {
    id: 'aydinlatma_direk',
    title: 'Sokak Lambası / Aydınlatma Arızası',
    icon: 'Lightbulb',
    badge: 'Güvenlik',
    color: 'yellow',
    placeholder: 'Örn: Sokaktaki aydınlatma direkleri yanmıyor, akşam saatlerinde cadde tamamen karanlıkta kalıyor.',
    keywords: ['lamba', 'sokak lambasi', 'aydinlatma', 'direk', 'karanlik', 'ampul', 'yanmiyor', 'bedas', 'ayedas']
  },
  {
    id: 'cop_moloz',
    title: 'Kaçak Moloz & Çöp Birikintisi',
    icon: 'Trash2',
    badge: 'Çevre',
    color: 'emerald',
    placeholder: 'Örn: Boş araziye/yol kenarına inşaat atığı ve moloz dökülmüş, çevre kirliliği ve koku oluşturuyor.',
    keywords: ['cop', 'moloz', 'atik', 'insaat atigi', 'koku', 'pislik', 'konteyner', 'hafriyat', 'temizlik']
  },
  {
    id: 'park_agac',
    title: 'Park Hasarı & Devrilme Tehlikesi Olan Ağaç',
    icon: 'Trees',
    badge: 'Park ve Bahçeler',
    color: 'green',
    placeholder: 'Örn: Yol kenarındaki kurumuş kalın ağaç dalı sarkmış veya çocuk parkındaki salıncak kırılmış.',
    keywords: ['park', 'agac', 'dal', 'cocuk parki', 'salincak', 'kaydirak', 'yesil alan', 'budama', 'bahce']
  },
  {
    id: 'trafik_isik',
    title: 'Trafik Işığı & Sinyalizasyon Arızası',
    icon: 'TrafficCone',
    badge: 'Trafik & Sinyal',
    color: 'rose',
    placeholder: 'Örn: Kavşaktaki trafik lambası yanmıyor veya sürekli kırmızıda takılı kalmış, kaza tehlikesi yaratıyor.',
    keywords: ['trafik isigi', 'sinyalizasyon', 'kirmizi isik', 'yesil isik', 'kavsak', 'lamba', 'sinyal']
  },
  {
    id: 'elektrik_kablo_pano',
    title: 'Açık Elektrik Kablosu & Hasarlı Pano',
    icon: 'Zap',
    badge: 'Hayati Tehlike',
    color: 'amber',
    placeholder: 'Örn: Sokakta elektrik panosunun kapağı açık/kırık veya direkten yere açıkta kablo sarkıyor, can güvenliği riski yaratıyor.',
    keywords: ['elektrik', 'kablo', 'trafo', 'pano', 'sarkan kablo', 'kacak', 'carpar', 'enerji', 'tehlike']
  },
  {
    id: 'yarali_hayvan',
    title: 'Yaralı / Hasta Sokak Hayvanı',
    icon: 'PawPrint',
    badge: 'Acil Veterinerlik',
    color: 'rose',
    placeholder: 'Örn: Sokakta acil tıbbi müdahaleye muhtaç, yaralanmış veya hasta bir sokak hayvanı bulunmaktadır.',
    keywords: ['yarali', 'hayvan', 'kedi', 'kopek', 'veteriner', 'hasta hayvan', 'kus', 'acil can', 'tedavi']
  },
  {
    id: 'basibos_hayvan',
    title: 'Başıboş / Saldırgan Hayvan İhbarı',
    icon: 'Dog',
    badge: 'Rehabilitasyon',
    color: 'orange',
    placeholder: 'Örn: Mahallede sürüleşerek yayalara ve çocuklara karşı saldırganlık gösteren sahipsiz köpekler bulunuyor.',
    keywords: ['basibos', 'sahipsiz', 'kopek', 'suru', 'saldirgan', 'it', 'rehabilite', 'barinak', 'toplama']
  },
  {
    id: 'hasere_ilaclama',
    title: 'Haşere, Sivrisinek & İlaçlama Talebi',
    icon: 'Bug',
    badge: 'Çevre Sağlığı',
    color: 'teal',
    placeholder: 'Örn: Sokakta ve rögarlarda aşırı sivrisinek, kene veya zararlı haşere artışı var; periyodik sokak ilaçlaması talep ediyoruz.',
    keywords: ['hasere', 'sivrisinek', 'sinek', 'ilaclama', 'bocek', 'kene', 'fare', 'kemirgen', 'larva']
  },
  {
    id: 'altyapi_kazi',
    title: 'Kapatılmamış Altyapı Kazısı & Hendek',
    icon: 'Construction',
    badge: 'Altyapı & AYKOME',
    color: 'yellow',
    placeholder: 'Örn: Altyapı kazı çalışması tamamlandığı halde çukur asfaltlanmadan toprak ve moloz halinde bırakılmış, araç ve yaya trafiğini engelliyor.',
    keywords: ['kazi', 'altyapi', 'hendek', 'aykome', 'fiber', 'boru', 'kapatilmamis', 'toprak yigini', 'cukuru']
  },
  {
    id: 'metruk_bina',
    title: 'Metruk Bina & Çökme / Güvenlik Tehlikesi',
    icon: 'Building',
    badge: 'İmar & Güvenlik',
    color: 'slate',
    placeholder: 'Örn: Sokakta her an yola çökme tehlikesi olan terk edilmiş metruk yapı can ve mal güvenliğini tehdit ediyor.',
    keywords: ['metruk', 'bina', 'harabe', 'yikilma', 'cokme', 'terk edilmis', 'guvenlik tehlikesi', 'yapi', 'insa']
  },
  {
    id: 'gida_ruhsat',
    title: 'Gıda Hijyeni & Ruhsatsız İşletme / Seyyar',
    icon: 'Utensils',
    badge: 'Zabıta & Denetim',
    color: 'blue',
    placeholder: 'Örn: Hijyen kurallarına uymayan işletme veya izinsiz/ruhsatsız seyyar satıcı faaliyet göstermektedir.',
    keywords: ['gida', 'hijyen', 'ruhsat', 'seyyar', 'denetim', 'zabita', 'lokanta', 'restoran', 'firin', 'pazar']
  },
  {
    id: 'diger',
    title: 'Diğer Kentsel Aksaklık',
    icon: 'HelpCircle',
    badge: 'Genel',
    color: 'indigo',
    placeholder: 'Örn: Yukarıdaki kategorilere uymayan diğer kentsel sorun veya talep açıklaması.',
    keywords: ['diger', 'genel', 'talep', 'oneri', 'sikayet', 'sorun', 'aksaklik']
  }
];
