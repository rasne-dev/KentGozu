import React from 'react';
import { Eye, MapPin, Building2, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenLegal }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div 
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Kent<span className="text-blue-600">Gözü</span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                  İstanbul
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Kentsel Aksaklık, Çukur ve Yol Sorunlarını Yetkili Kuruma Bildirin
              </p>
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Bildirim Yap</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Kurum & İlçe Rehberi</span>
            </button>

            <button
              onClick={onOpenLegal}
              title="Yasal Haklar ve Bilgilendirme"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Yasal Haklar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
