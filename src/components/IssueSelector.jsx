import React, { useState } from 'react';
import { ISSUE_TYPES } from '../data/issueTypes';
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
  ChevronDown,
  ChevronUp
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

export default function IssueSelector({ selectedIssue, onSelectIssue }) {
  const [showAll, setShowAll] = useState(false);

  // İlk 8 popüler sorun veya tüm 16 sorun
  // Eğer seçilen sorun ilk 8 dışındaysa kullanıcı görmeye devam etsin
  const isSelectedInHiddenPart = selectedIssue && ISSUE_TYPES.findIndex(i => i.id === selectedIssue.id) >= 8;
  const isExpanded = showAll || isSelectedInHiddenPart;

  const displayedIssues = isExpanded ? ISSUE_TYPES : ISSUE_TYPES.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
          1. Bildirmek İstediğiniz Sorun Türünü Seçin
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Zorunlu</span>
      </div>

      {/* 2'li Mobilde, 2'li Tablette, 4'lü Geniş Ekranda Tam Simetrik Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {displayedIssues.map((issue) => {
          const IconComponent = iconMap[issue.icon] || AlertTriangle;
          const isSelected = selectedIssue?.id === issue.id;

          return (
            <button
              type="button"
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-1.5 sm:gap-2 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs ring-2 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[90px] sm:max-w-none ${
                  isSelected 
                    ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 font-semibold' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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

      {/* Daha Fazla Göster / Gizle Butonu */}
      <div className="text-center pt-1">
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
              <span>Tüm Sorun Türlerini Göster (+8 Kategori)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
