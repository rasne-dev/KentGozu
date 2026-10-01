import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  Globe, 
  ExternalLink, 
  Car, 
  Droplet, 
  Lightbulb, 
  Send,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Zap,
  X
} from 'lucide-react';
import { 
  ISTANBUL_DISTRICTS, 
  IBB_INFO, 
  KGM_INFO, 
  ISKI_INFO,
  ELECTRICITY_COMPANIES
} from '../data/istanbulData';
import { normalizeTurkish, formatWhatsAppUrl } from '../utils/helpers';

export default function DirectoryView({ onSelectDistrictForReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState('ALL');
  const [expandedCards, setExpandedCards] = useState({});
  const [copiedEmail, setCopiedEmail] = useState(null);

  const toggleCardExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyEmail = async (email, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.error('Kopyalanamadı', err);
    }
  };

  const filteredDistricts = useMemo(() => {
    const cleanSearch = normalizeTurkish(searchTerm);
    return ISTANBUL_DISTRICTS.filter((d) => {
      const cleanDistrict = normalizeTurkish(d.district);
      const cleanPhone = (d.phone || '').replace(/\s+/g, '');
      const cleanEmail = normalizeTurkish(d.email);

      const matchesSearch = !cleanSearch ||
        cleanDistrict.includes(cleanSearch) ||
        cleanPhone.includes(cleanSearch) ||
        cleanEmail.includes(cleanSearch);

      const matchesSide = sideFilter === 'ALL' || d.side === sideFilter;
      return matchesSearch && matchesSide;
    });
  }, [searchTerm, sideFilter]);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>İstanbul Kurumsal İletişim Rehberi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Yetkili Kurum & 39 İlçe Belediyesi Rehberi
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Karayolları, İBB Çözüm Merkezi (Beyaz Masa), İSKİ, BEDAŞ/AYEDAŞ ve İstanbul'un tüm ilçe belediyelerinin resmi e-posta, telefon ve WhatsApp ihbar kanalları.
          </p>
        </div>
      </div>

      {/* Bölgesel ve Kentsel Ana İdareler */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Bölgesel ve Kentsel Ana İdareler</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Karayolları 1. Bölge */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 flex items-center gap-1 border border-red-200 dark:border-red-900">
                  <Car className="w-3 h-3" />
                  Otoyol & D-100
                </span>
                <a href="tel:159" className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  ALO 159
                </a>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{KGM_INFO.name}</h4>
              <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${expandedCards['kgm'] ? '' : 'line-clamp-2'}`}>
                {KGM_INFO.description}
              </p>
              <button
                type="button"
                onClick={() => toggleCardExpand('kgm')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mt-1 inline-flex items-center gap-0.5 cursor-pointer select-none"
              >
                <span>{expandedCards['kgm'] ? 'Daha Az Göster' : 'Devamını Göster'}</span>
                {expandedCards['kgm'] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs">
              <a
                href={`mailto:${KGM_INFO.email}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
              >
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{KGM_INFO.email}</span>
              </a>
              <button
                type="button"
                onClick={(e) => handleCopyEmail(KGM_INFO.email, e)}
                className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                title="E-postayı kopyala"
              >
                {copiedEmail === KGM_INFO.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* İBB Beyaz Masa */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 flex items-center gap-1 border border-blue-200 dark:border-blue-900">
                  <Building2 className="w-3 h-3" />
                  Büyükşehir
                </span>
                <a href="tel:153" className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  ALO 153
                </a>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{IBB_INFO.name}</h4>
              <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${expandedCards['ibb'] ? '' : 'line-clamp-2'}`}>
                {IBB_INFO.description}
              </p>
              <button
                type="button"
                onClick={() => toggleCardExpand('ibb')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mt-1 inline-flex items-center gap-0.5 cursor-pointer select-none"
              >
                <span>{expandedCards['ibb'] ? 'Daha Az Göster' : 'Devamını Göster'}</span>
                {expandedCards['ibb'] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs">
              <a
                href={`mailto:${IBB_INFO.email}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
              >
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{IBB_INFO.email}</span>
              </a>
              <button
                type="button"
                onClick={(e) => handleCopyEmail(IBB_INFO.email, e)}
                className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                title="E-postayı kopyala"
              >
                {copiedEmail === IBB_INFO.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* İSKİ */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 flex items-center gap-1 border border-sky-200 dark:border-sky-900">
                  <Droplet className="w-3 h-3" />
                  Altyapı & Mazgal
                </span>
                <a href="tel:185" className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  ALO 185
                </a>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{ISKI_INFO.name}</h4>
              <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${expandedCards['iski'] ? '' : 'line-clamp-2'}`}>
                {ISKI_INFO.description}
              </p>
              <button
                type="button"
                onClick={() => toggleCardExpand('iski')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mt-1 inline-flex items-center gap-0.5 cursor-pointer select-none"
              >
                <span>{expandedCards['iski'] ? 'Daha Az Göster' : 'Devamını Göster'}</span>
                {expandedCards['iski'] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs">
              <a
                href={`mailto:${ISKI_INFO.email}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
              >
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{ISKI_INFO.email}</span>
              </a>
              <button
                type="button"
                onClick={(e) => handleCopyEmail(ISKI_INFO.email, e)}
                className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                title="E-postayı kopyala"
              >
                {copiedEmail === ISKI_INFO.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* BEDAŞ & AYEDAŞ */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center gap-1 border border-amber-200 dark:border-amber-900">
                  <Zap className="w-3 h-3" />
                  Aydınlatma & Enerji
                </span>
                <a href="tel:186" className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  ALO 186
                </a>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">BEDAŞ & AYEDAŞ Dağıtım</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Avrupa Yakası BEDAŞ, Anadolu Yakası AYEDAŞ sokak aydınlatmaları ve elektrik direkleri sorumlusudur.
              </p>
              <div className="space-y-1.5 mt-2.5">
                <div className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg">
                  <a href="mailto:alo186@bedas.com.tr" className="font-mono text-blue-600 dark:text-blue-400 hover:underline truncate">
                    alo186@bedas.com.tr (BEDAŞ)
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail('alo186@bedas.com.tr', e)}
                    className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                    title="BEDAŞ e-postasını kopyala"
                  >
                    {copiedEmail === 'alo186@bedas.com.tr' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg">
                  <a href="mailto:iletisim@ayedas.com.tr" className="font-mono text-blue-600 dark:text-blue-400 hover:underline truncate">
                    iletisim@ayedas.com.tr (AYEDAŞ)
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail('iletisim@ayedas.com.tr', e)}
                    className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                    title="AYEDAŞ e-postasını kopyala"
                  >
                    {copiedEmail === 'iletisim@ayedas.com.tr' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Elektrik Arıza</span>
              <a href="tel:186" className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] hover:underline">
                ALO 186
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 39 İlçe Belediyesi */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              İstanbul 39 İlçe Belediyesi
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredDistricts.length} İlçe
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Arama */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="İlçe veya telefon ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 w-48 sm:w-56"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-1.5 top-1.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Yakaya göre filtre */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setSideFilter('ALL')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sideFilter === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setSideFilter('Avrupa')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sideFilter === 'Avrupa' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Avrupa
              </button>
              <button
                type="button"
                onClick={() => setSideFilter('Anadolu')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sideFilter === 'Anadolu' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Anadolu
              </button>
            </div>
          </div>
        </div>

        {filteredDistricts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Aramanıza uygun ilçe bulunamadı.</p>
            <p>"{searchTerm}" araması için sonuç yok. Filtreleri temizleyip tekrar deneyebilirsiniz.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSideFilter('ALL');
              }}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded-xl font-semibold hover:bg-blue-100 cursor-pointer transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDistricts.map((d) => (
              <div
                key={d.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.district} Belediyesi</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      d.side === 'Anadolu'
                        ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900'
                    }`}>
                      {d.side} Yakası
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-2.5">
                    <div className="flex items-center justify-between gap-1.5 font-mono text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg">
                      <a href={`mailto:${d.email}`} className="flex items-center gap-1.5 truncate hover:underline">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{d.email}</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(d.email, e)}
                        className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer shrink-0"
                        title="E-postayı kopyala"
                      >
                        {copiedEmail === d.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <a 
                      href={`tel:${d.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 px-1 transition-colors"
                      title="Telefonla ara"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{d.phone}</span>
                    </a>

                    {d.whatsapp && (
                      <a
                        href={formatWhatsAppUrl(d.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 px-1 transition-colors hover:underline"
                        title="WhatsApp ihbar hattına mesaj gönder"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>WP: {d.whatsapp}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
                  <a
                    href={d.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Web Sitesi</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectDistrictForReport(d)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-blue-200/60 dark:border-blue-800/60 active:scale-95"
                  >
                    <Send className="w-3 h-3" />
                    <span>Bu İlçeye Bildir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
