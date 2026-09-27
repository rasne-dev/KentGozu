import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import DirectoryView from './components/DirectoryView';
import LiveIssueMap from './components/LiveIssueMap';
import LegalNoticeModal from './components/LegalNoticeModal';
import CookieBanner from './components/CookieBanner';
import { Eye, Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('report');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [preselectedDistrict, setPreselectedDistrict] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('kentgozu-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kentgozu-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kentgozu-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleSelectDistrictForReport = (districtObj) => {
    setPreselectedDistrict(districtObj);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'report' && (
          <ReportForm preselectedDistrict={preselectedDistrict} />
        )}
        {activeTab === 'map' && (
          <LiveIssueMap onReportSimilarIssue={() => setActiveTab('report')} />
        )}
        {activeTab === 'directory' && (
          <DirectoryView onSelectDistrictForReport={handleSelectDistrictForReport} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">KentGözü</span>
            <span>— Açık Kaynak Sivil Katılım & Kentsel Bildirim Platformu</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLegalModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Yasal Haklar (Md. 74)</span>
            </button>
            <a
              href="https://github.com/rasne-dev/KentGozu"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            İlk etap: İstanbul Büyükşehir Belediyesi, 39 İlçe Belediyesi, Karayolları 1. Bölge, İSKİ, BEDAŞ & AYEDAŞ.
          </p>
          <p>Veriler doğrudan cihazınızdan resmi kurumsal e-posta kanallarına yönlendirilir.</p>
        </div>
      </footer>

      {/* Legal & KVKK Modal */}
      <LegalNoticeModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Cookie & Transparency Banner */}
      <CookieBanner onOpenLegal={() => setIsLegalModalOpen(true)} />
    </div>
  );
}
