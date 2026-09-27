import React, { useState } from 'react';
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
  Send
} from 'lucide-react';
import { 
  ISTANBUL_DISTRICTS, 
  IBB_INFO, 
  KGM_INFO, 
  ISKI_INFO, 
  ELECTRICITY_COMPANIES 
} from '../data/istanbulData';

export default function DirectoryView({ onSelectDistrictForReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState('ALL'); // ALL, Avrupa, Anadolu

  const filteredDistricts = ISTANBUL_DISTRICTS.filter((d) => {
    const matchesSearch = d.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSide = sideFilter === 'ALL' || d.side === sideFilter;
    return matchesSearch && matchesSide;
  });

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md">
        <h2 className="text-xl font-bold mb-1">İstanbul Yetkili Kurum & Belediye Rehberi</h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
          Karayolları, İBB, İSKİ ve İstanbul'un 39 ilçe belediyesinin resmi iletişim, Beyaz Masa ve ihbar hatları.
        </p>
      </div>

      {/* Büyükşehir & Bölgesel İhtisas Kurumları */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Bölgesel ve Kentsel Ana İdareler
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Karayolları 1. Bölge */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  Otoyol & D-100
                </span>
                <span className="text-[11px] font-mono text-slate-500">ALO 159</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{KGM_INFO.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{KGM_INFO.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
              <a
                href={`mailto:${KGM_INFO.email}`}
                className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                {KGM_INFO.email}
              </a>
              <a
                href={KGM_INFO.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* İBB Beyaz Masa */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Büyükşehir
                </span>
                <span className="text-[11px] font-mono text-slate-500">ALO 153</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{IBB_INFO.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{IBB_INFO.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
              <a
                href={`mailto:${IBB_INFO.email}`}
                className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                {IBB_INFO.email}
              </a>
              <span className="text-emerald-600 font-medium">WhatsApp: {IBB_INFO.whatsapp}</span>
            </div>
          </div>

          {/* İSKİ */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 flex items-center gap-1">
                  <Droplet className="w-3 h-3" />
                  Altyapı & Mazgal
                </span>
                <span className="text-[11px] font-mono text-slate-500">ALO 185</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{ISKI_INFO.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ISKI_INFO.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
              <a
                href={`mailto:${ISKI_INFO.email}`}
                className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                {ISKI_INFO.email}
              </a>
              <a
                href={ISKI_INFO.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 39 İlçe Belediyesi */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>İstanbul 39 İlçe Belediyesi</span>
            <span className="text-xs font-normal text-slate-500">
              ({filteredDistricts.length} listeleniyor)
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {/* Arama */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="İlçe ara (örn. Kadıköy)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44"
              />
            </div>

            {/* Yakaya göre filtre */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setSideFilter('ALL')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sideFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setSideFilter('Avrupa')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sideFilter === 'Avrupa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Avrupa
              </button>
              <button
                type="button"
                onClick={() => setSideFilter('Anadolu')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sideFilter === 'Anadolu' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Anadolu
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDistricts.map((d) => (
            <div
              key={d.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{d.district}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    d.side === 'Anadolu'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {d.side} Yakası
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 my-2">
                  <div className="flex items-center gap-1.5 font-mono text-blue-600">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{d.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{d.phone}</span>
                  </div>
                  {d.whatsapp && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span>{d.whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
                <a
                  href={d.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Web Sitesi</span>
                </a>

                <button
                  type="button"
                  onClick={() => onSelectDistrictForReport(d)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Bu İlçeye Bildir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
