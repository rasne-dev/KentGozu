import React, { useState, useMemo } from 'react';
import { ISSUE_TYPES } from '../data/issueTypes';
import { normalizeTurkish } from '../utils/helpers';
import { 
  AlertTriangle, 
  Footprints, 
  Signpost, 
  ShieldAlert, 
  Lightbulb, 
  Trash2, 
  Trees, 
  TrafficCone,
  Zap,
  PawPrint,
  Dog,
  Bug,
  Construction,
  Building,
  Utensils,
  HelpCircle,
  Check,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

const iconMap = {
  AlertTriangle, 
  Footprints, 
  Signpost, 
  ShieldAlert, 
  Lightbulb, 
  Trash2, 
  Trees, 
  TrafficCone,
  Zap,
  PawPrint,
  Dog,
  Bug,
  Construction,
  Building,
  Utensils,
  HelpCircle
};

const CATEGORY_TABS = [
  { id: 'ALL', label: 'Tümü' },
  { id: 'ulasim', label: '🚗 Ulaşım & Trafik', tags: ['Ulaşım', 'Trafik', 'Trafik & Sinyal'] },
  { id: 'altyapi', label: '🏗️ Altyapı & Yaya', tags: ['Yaya Güvenliği', 'Acil Tehlike', 'Altyapı & AYKOME'] },
  { id: 'enerji', label: '⚡ Aydınlatma & Enerji', tags: ['Güvenlik', 'Hayati Tehlike'] },
  { id: 'cevre', label: '🌳 Çevre & Park', tags: ['Çevre', 'Park ve Bahçeler', 'Çevre Sağlığı'] },
  { id: 'canli', label: '🐾 Sokak Canları & Zabıta', tags: ['Acil Veterinerlik', 'Rehabilitasyon', 'Zabıta & Denetim', 'İmar & Güvenlik'] }
];

export default function IssueSelector({ selectedIssue, onSelectIssue, isInvalid = false }) {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL');

  // Filtreleme mantığı: Arama + Kategori sekmesi
  const filteredIssues = useMemo(() => {
    return ISSUE_TYPES.filter((issue) => {
      // Kategori sekmesi eşleşmesi
      if (selectedCategoryTab !== 'ALL') {
        const currentTabObj = CATEGORY_TABS.find(t => t.id === selectedCategoryTab);
        if (currentTabObj && !currentTabObj.tags.includes(issue.badge)) {
          return false;
        }
      }

      // Arama terimi eşleşmesi
      if (!searchTerm.trim()) return true;
      const cleanTerm = normalizeTurkish(searchTerm);
      const cleanTitle = normalizeTurkish(issue.title);
      const cleanBadge = normalizeTurkish(issue.badge);
      const cleanPlaceholder = normalizeTurkish(issue.placeholder);

      return (
        cleanTitle.includes(cleanTerm) ||
        cleanBadge.includes(cleanTerm) ||
        cleanPlaceholder.includes(cleanTerm)
      );
    });
  }, [searchTerm, selectedCategoryTab]);

  // Arama veya kategori seçiliyken tamamını göster, aksi halde ilk 8 veya genişletilmiş hali göster
  const isSearchingOrFiltering = searchTerm.trim().length > 0 || selectedCategoryTab !== 'ALL';
  const isSelectedInHiddenPart = selectedIssue && ISSUE_TYPES.findIndex(i => i.id === selectedIssue.id) >= 8;
  const isExpanded = showAll || isSelectedInHiddenPart || isSearchingOrFiltering;

  const displayedIssues = isExpanded ? filteredIssues : filteredIssues.slice(0, 8);

  return (
    <div 
      id="step-issue-selector" 
      className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border transition-all ${
        isInvalid 
          ? 'border-red-500 ring-2 ring-red-500/20 shadow-md' 
          : 'border-slate-200 dark:border-slate-800 shadow-xs'
      }`}
    >
      {/* Kart Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
              Adım 1: Sorun Türünü Seçin
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bildiriminizin ilgili birime (Fen İşleri, Zabıta, İSKİ vb.) yönlendirilmesini sağlar.
            </p>
          </div>
        </div>

        {selectedIssue && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="truncate max-w-[180px]">{selectedIssue.title}</span>
          </div>
        )}
      </div>

      {/* Arama Kutusu ve Kategori Çipleri */}
      <div className="space-y-2 mb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Sorun türü ara (örn: çukur, lamba, mazgal, köpek, ağaç, moloz)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Kategori Sekmeleri */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORY_TABS.map((tab) => {
            const isTabActive = selectedCategoryTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isTabActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Listesi */}
      {displayedIssues.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Aramanıza uygun sorun türü bulunamadı.</p>
          <p>Arama teriminizi değiştirebilir veya kategoriler arasından "Diğer Kentsel Aksaklık" seçebilirsiniz.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategoryTab('ALL');
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-2 inline-block cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {displayedIssues.map((issue) => {
            const IconComponent = iconMap[issue.icon] || AlertTriangle;
            const isSelected = selectedIssue?.id === issue.id;

            return (
              <button
                type="button"
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-1.5 sm:gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 shadow-xs ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate max-w-[85px] sm:max-w-none ${
                    isSelected 
                      ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 font-semibold' 
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {issue.badge}
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-tight ${isSelected ? 'text-blue-950 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                    {issue.title}
                  </h4>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Daha Fazla Göster / Gizle Butonu (Yalnızca arama/filtreleme yoksa göster) */}
      {!isSearchingOrFiltering && filteredIssues.length > 8 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Daha Az Kategori Göster</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Tüm Sorun Türlerini Göster (+{filteredIssues.length - 8} Kategori)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
