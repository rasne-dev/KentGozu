import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import IssueSelector from './IssueSelector';
import LocationPicker from './LocationPicker';
import PhotoUploader from './PhotoUploader';
import AuthoritySelector from './AuthoritySelector';
import MailPreviewModal from './MailPreviewModal';
import { determineResponsibleAuthorities } from '../data/istanbulData';
import { ISSUE_TYPES } from '../data/issueTypes';

export default function ReportForm({ preselectedDistrict }) {
  // Form durumları
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    districtObj: preselectedDistrict || null,
    districtName: preselectedDistrict ? preselectedDistrict.district : '',
    neighbourhood: '',
    road: '',
    buildingNo: '',
    landmark: '',
    fullAddress: '',
    isDetected: false
  });
  const [roadType, setRoadType] = useState('neighborhood');
  const [photoData, setPhotoData] = useState(null);
  const [userNote, setUserNote] = useState('');
  const [userName, setUserName] = useState('');
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);

  // Dinamik yetkililer
  const [authorities, setAuthorities] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Modal durumu
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (preselectedDistrict) {
      setLocationData((prev) => ({
        ...prev,
        districtObj: preselectedDistrict,
        districtName: preselectedDistrict.district
      }));
    }
  }, [preselectedDistrict]);

  useEffect(() => {
    const list = determineResponsibleAuthorities({
      districtObj: locationData.districtObj,
      roadType,
      issueTypeId: selectedIssue?.id || ''
    });

    setAuthorities(list);
    setSelectedEmails(list.map((a) => a.email));
  }, [locationData.districtObj, roadType, selectedIssue]);

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    if (issue) {
      const sample = (issue.placeholder || '').replace(/^Örn:\s*/, '');
      const sampleTexts = ISSUE_TYPES.map((i) => (i.placeholder || '').replace(/^Örn:\s*/, ''));
      const isPreviousSample = sampleTexts.includes(userNote.trim());
      if (!userNote.trim() || isPreviousSample) {
        setUserNote(sample);
      }
    }
  };

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) => {
      if (prev.includes(email)) {
        if (prev.length === 1) return prev;
        return prev.filter((e) => e !== email);
      } else {
        return [...prev, email];
      }
    });
  };

  const handleOpenPreview = (e) => {
    e.preventDefault();
    if (!selectedIssue) {
      alert('Lütfen bildirmek istediğiniz sorun türünü seçiniz.');
      return;
    }
    if (!locationData.districtObj && roadType !== 'highway') {
      alert('Lütfen ilgili ilçeyi seçiniz veya GPS ile konumunuzu belirleyiniz.');
      return;
    }
    if (selectedEmails.length === 0) {
      alert('Lütfen en az bir yetkili kurum e-posta adresi seçiniz.');
      return;
    }
    if (!isDisclaimerAccepted) {
      alert('Lütfen devam etmeden önce yasal sorumluluk onay kutusunu işaretleyiniz.');
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs relative overflow-hidden transition-colors">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Hızlı & Doğrudan Resmi Bildirim</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kentsel Aksaklığı Bildirin, Yetkili Kuruma İletelim
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Yoldaki bir çukur, kırık mazgal veya devrilmiş tabela ile mi karşılaştınız?
            Sorunu seçin; uygulama konuma göre <strong>Karayolları, İBB veya İlçe Belediyesi</strong>'ni eşleştirip resmi başvuru taslağınızı hazırlasın.
          </p>
        </div>
      </div>

      <form onSubmit={handleOpenPreview} className="space-y-5">
        {/* Adım 1: Sorun Türü */}
        <IssueSelector
          selectedIssue={selectedIssue}
          onSelectIssue={handleSelectIssue}
        />

        {/* Adım 2: Konum ve Yol Sorumluluk Tipi */}
        <LocationPicker
          locationData={locationData}
          setLocationData={setLocationData}
          roadType={roadType}
          setRoadType={setRoadType}
        />

        {/* Adım 3: Fotoğraf */}
        <PhotoUploader
          photoData={photoData}
          setPhotoData={setPhotoData}
        />

        {/* Adım 4: Açıklama ve Vatandaş Bilgisi */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Sorun Açıklaması & Notunuz</span>
              </label>

              {selectedIssue && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sample = (selectedIssue.placeholder || '').replace(/^Örn:\s*/, '');
                      setUserNote(sample);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                    title="Seçili kategoriye özel örnek açıklamayı doldur"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Örnek Metni Doldur</span>
                  </button>
                  {userNote && (
                    <button
                      type="button"
                      onClick={() => setUserNote('')}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium cursor-pointer"
                      title="Açıklamayı temizle"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              )}
            </div>

            <textarea
              rows={3}
              placeholder={
                selectedIssue?.placeholder ||
                'Sorunun tam yeri, boyutu veya trafiğe etkisine dair eklemek istediğiniz detaylar...'
              }
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
            />

            {selectedIssue && userNote && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                <span>Kategoriye özel örnek açıklama hazırlandı; dilediğiniz gibi düzenleyebilir veya detay ekleyebilirsiniz.</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Adınız Soyadınız (Opsiyonel):
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Dilekçe altında imza yerine eklenir. Boş bırakabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Adım 5: Yetkili Kurumlar ve İletişim */}
        <AuthoritySelector
          authorities={authorities}
          selectedEmails={selectedEmails}
          toggleEmailSelection={toggleEmailSelection}
        />

        {/* Adım 6: Yasal Sorumluluk & Doğruluk Onay Kutusu */}
        <div className="bg-amber-50/90 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200/90 dark:border-amber-900/60 transition-colors">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDisclaimerAccepted}
              onChange={(e) => setIsDisclaimerAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-amber-300 dark:border-amber-700 focus:ring-blue-500 cursor-pointer shrink-0"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-950 dark:text-amber-200 block">
                Yasal Sorumluluk ve Doğruluk Beyanı:
              </span>
              <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                Gönderilen iletilerdeki ifadelerin doğruluğu ve hukuki sorumluluğu tarafıma aittir. Kasıtlı asılsız ihbar veya hakaret niteliğindeki bildirimlerin yasal yaptırıma tabi olabileceğini kabul ve beyan ederim.
              </p>
            </div>
          </label>
        </div>

        {/* Aksiyon Butonu */}
        <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
              Hazırlanan Taslak: {selectedEmails.length} Yetkili Kuruma Yönlendirilecek
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isDisclaimerAccepted
                ? 'E-posta istemciniz açılacak; kontrol edip tek tıkla göndereceksiniz.'
                : 'Devam etmek için lütfen yukarıdaki onay kutusunu işaretleyiniz.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={!isDisclaimerAccepted}
            className={`w-full sm:w-auto px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isDisclaimerAccepted
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60 shadow-none'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>E-Posta Taslağını İncele ve Gönder</span>
          </button>
        </div>
      </form>

      {/* Önizleme Modalı */}
      <MailPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedIssue={selectedIssue}
        locationData={locationData}
        roadType={roadType}
        userNote={userNote}
        userName={userName}
        selectedEmails={selectedEmails}
        authorities={authorities}
        photoAttached={Boolean(photoData)}
      />
    </div>
  );
}
