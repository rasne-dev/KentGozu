import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ShieldAlert,
  Check,
  MapPin,
  Camera,
  Building2,
  Scale
} from 'lucide-react';
import IssueSelector from './IssueSelector';
import LocationPicker from './LocationPicker';
import PhotoUploader from './PhotoUploader';
import AuthoritySelector from './AuthoritySelector';
import MailPreviewModal from './MailPreviewModal';
import { determineResponsibleAuthorities, ISTANBUL_DISTRICTS } from '../data/istanbulData';
import { ISSUE_TYPES } from '../data/issueTypes';
import { scrollToElement } from '../utils/helpers';

export default function ReportForm({ preselectedDistrict }) {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isMock = urlParams?.get('mock') === '1';
  const isPreview = urlParams?.get('preview') === '1';

  const kadikoyDistrict = ISTANBUL_DISTRICTS.find((d) => d.id === 'kadikoy') || {
    id: 'kadikoy',
    name: 'Kadıköy Belediyesi',
    district: 'Kadıköy',
    side: 'Anadolu',
    email: 'iletisim@kadikoy.bel.tr',
    phone: '444 55 22',
    whatsapp: '0533 155 55 22',
    website: 'https://www.kadikoy.bel.tr'
  };

  // Form durumları
  const [selectedIssue, setSelectedIssue] = useState(isMock ? ISSUE_TYPES[0] : null);
  const [locationData, setLocationData] = useState({
    latitude: isMock ? '40.9632' : '',
    longitude: isMock ? '29.0768' : '',
    districtObj: preselectedDistrict || (isMock ? kadikoyDistrict : null),
    districtName: preselectedDistrict ? preselectedDistrict.district : (isMock ? 'Kadıköy' : ''),
    neighbourhood: isMock ? 'Suadiye Mah.' : '',
    road: isMock ? 'Bağdat Caddesi' : '',
    buildingNo: isMock ? 'No: 412' : '',
    landmark: isMock ? 'Şaşkınbakkal Işıklar Yakını' : '',
    fullAddress: isMock ? 'Suadiye Mah. Bağdat Caddesi No: 412, Kadıköy / İstanbul' : '',
    isDetected: isMock
  });
  const [roadType, setRoadType] = useState(isMock ? 'main_artery' : 'neighborhood');
  const [photos, setPhotos] = useState([]);
  const [userNote, setUserNote] = useState(isMock ? 'Bağdat Caddesi üzerinde sağ şeritte yaklaşık 20 cm derinliğinde, araç ve motosiklet trafiğini tehlikeye atan derin bir çukur oluşmuştur. Acilen asfalt yama yapılması gerekmektedir.' : '');
  const [userName, setUserName] = useState(() => {
    if (isMock) return 'Vatandaş Bildirimi';
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kentgozu-user-name') || '';
    }
    return '';
  });
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(isMock);
  const [districtAlertDismissed, setDistrictAlertDismissed] = useState(false);

  // Dinamik yetkililer
  const [authorities, setAuthorities] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Validasyon hata mesajı ve aktif hata adımı
  const [validationError, setValidationError] = useState(null);
  const [validationStep, setValidationStep] = useState(null);

  const clearValidation = () => {
    setValidationError(null);
    setValidationStep(null);
  };

  // Modal durumu
  const [isModalOpen, setIsModalOpen] = useState(isMock && isPreview);

  useEffect(() => {
    if (preselectedDistrict) {
      setLocationData((prev) => {
        let newFullAddress = prev.fullAddress;
        if (!prev.fullAddress || prev.fullAddress.endsWith('İstanbul')) {
          newFullAddress = `${preselectedDistrict.district} / İstanbul`;
        }
        return {
          ...prev,
          districtObj: preselectedDistrict,
          districtName: preselectedDistrict.district,
          fullAddress: newFullAddress
        };
      });
      clearValidation();
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
    clearValidation();
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
    clearValidation();
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
    clearValidation();

    if (!selectedIssue) {
      setValidationError('Lütfen bildirmek istediğiniz sorun türünü seçiniz (Adım 1).');
      setValidationStep(1);
      scrollToElement('step-issue-selector');
      return;
    }

    if (!locationData.districtObj && roadType !== 'highway') {
      setValidationError('Lütfen sorunun bulunduğu ilçeyi seçiniz veya GPS ile konumunuzu belirleyiniz (Adım 2).');
      setValidationStep(2);
      scrollToElement('step-location-picker');
      return;
    }

    if (selectedEmails.length === 0) {
      setValidationError('Lütfen en az bir yetkili kurum e-posta adresi seçiniz (Adım 5).');
      setValidationStep(5);
      scrollToElement('step-authority-selector');
      return;
    }

    if (!isDisclaimerAccepted) {
      setValidationError('Devam etmeden önce lütfen yasal sorumluluk onay kutusunu işaretleyiniz (Adım 6).');
      setValidationStep(6);
      scrollToElement('step-disclaimer');
      return;
    }

    setIsModalOpen(true);
  };

  // İlerleme adımları hesaplama
  const isStep1Done = Boolean(selectedIssue);
  const isStep2Done = Boolean(locationData.districtObj || roadType === 'highway');
  const isStep3Done = photos.length > 0;
  const isStep4Done = userNote.trim().length > 0;
  const isStep5Done = selectedEmails.length > 0;
  const isStep6Done = isDisclaimerAccepted;

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
            Yoldaki bir çukur, kırık mazgal, yanmayan sokak lambası veya kaldırım çökmesi ile mi karşılaştınız?
            Sorunu ve konumu seçin; KentGözü yetkili kurumu (39 İlçe Belediyesi, İBB, İSKİ, BEDAŞ/AYEDAŞ veya KGM) eşleştirip mevzuata uygun resmi başvuru taslağınızı hazırlasın.
          </p>
        </div>
      </div>

      {/* Kurum Rehberinden Seçilen İlçe Bilgilendirme Bandı */}
      {preselectedDistrict && !districtAlertDismissed && (
        <div className="p-3.5 sm:p-4 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                {preselectedDistrict.district} Belediyesi Seçildi
              </span>
              <p className="text-emerald-800/90 dark:text-emerald-300/90 text-[11px]">
                Rehberden seçtiğiniz ilçe forma tanımlandı. Aşağıdan sorun türünü seçerek devam edebilirsiniz.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDistrictAlertDismissed(true)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer shrink-0"
          >
            Tamam
          </button>
        </div>
      )}

      {/* Adım İlerleme Çubuğu (Stepper) */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[500px] text-xs">
          <button 
            type="button" 
            onClick={() => scrollToElement('step-issue-selector')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isStep1Done ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {isStep1Done ? '✓' : '1'}
            </span>
            <span className={`font-semibold ${isStep1Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
              Sorun Türü
            </span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">──</span>

          <button 
            type="button" 
            onClick={() => scrollToElement('step-location-picker')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isStep2Done ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {isStep2Done ? '✓' : '2'}
            </span>
            <span className={`font-semibold ${isStep2Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              Konum
            </span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">──</span>

          <button 
            type="button" 
            onClick={() => scrollToElement('step-photo-uploader')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isStep3Done ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {isStep3Done ? '✓' : '3'}
            </span>
            <span className={`font-semibold ${isStep3Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              Fotoğraf {photos.length > 0 && `(${photos.length})`}
            </span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">──</span>

          <button 
            type="button" 
            onClick={() => scrollToElement('step-description')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isStep4Done ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {isStep4Done ? '✓' : '4'}
            </span>
            <span className={`font-semibold ${isStep4Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              Açıklama
            </span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">──</span>

          <button 
            type="button" 
            onClick={() => scrollToElement('step-authority-selector')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isStep5Done ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {isStep5Done ? '✓' : '5'}
            </span>
            <span className={`font-semibold ${isStep5Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              Yetkili Kurum
            </span>
          </button>
        </div>
      </div>

      {/* Validasyon Hata Bildirimi (Inline Alert) */}
      {validationError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-red-900 dark:text-red-200">Eksik Bilgi Bulunuyor</h4>
            <p className="text-xs text-red-700 dark:text-red-300">{validationError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleOpenPreview} className="space-y-5">
        {/* Adım 1: Sorun Türü */}
        <IssueSelector
          selectedIssue={selectedIssue}
          onSelectIssue={handleSelectIssue}
          isInvalid={validationStep === 1}
        />

        {/* Adım 2: Konum ve Yol Sorumluluk Tipi */}
        <LocationPicker
          locationData={locationData}
          setLocationData={(data) => {
            setLocationData(data);
            clearValidation();
          }}
          roadType={roadType}
          setRoadType={(type) => {
            setRoadType(type);
            clearValidation();
          }}
          isInvalid={validationStep === 2}
        />

        {/* Adım 3: Fotoğraf */}
        <PhotoUploader
          photos={photos}
          setPhotos={setPhotos}
        />

        {/* Adım 4: Açıklama ve Vatandaş Bilgisi */}
        <div 
          id="step-description"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Adım 4: Sorun Açıklaması & Notunuz</span>
                </label>
              </div>

              {selectedIssue && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
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

            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              <span>{userNote.length} karakter</span>
              {selectedIssue && userNote && (
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Örnek açıklama eklendi; dilediğiniz gibi düzenleyebilirsiniz.</span>
                </span>
              )}
            </div>
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setUserName(val);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('kentgozu-user-name', val);
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Resmi dilekçe formatında imza yerine eklenir. Boş bırakabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Adım 5: Yetkili Kurumlar ve İletişim */}
        <AuthoritySelector
          authorities={authorities}
          selectedEmails={selectedEmails}
          toggleEmailSelection={toggleEmailSelection}
          onSetSelectedEmails={(emails) => {
            clearValidation();
            setSelectedEmails(emails);
          }}
          isInvalid={validationStep === 5}
        />

        {/* Adım 6: Yasal Sorumluluk & Doğruluk Onay Kutusu */}
        <div 
          id="step-disclaimer"
          className={`p-4 rounded-2xl border transition-all ${
            validationStep === 6
              ? 'bg-red-50/80 dark:bg-red-950/40 border-red-500 ring-2 ring-red-500/20'
              : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-900/60'
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDisclaimerAccepted}
              onChange={(e) => {
                setIsDisclaimerAccepted(e.target.checked);
                clearValidation();
              }}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-amber-300 dark:border-amber-700 focus:ring-blue-500 cursor-pointer shrink-0"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Adım 6: Yasal Sorumluluk ve Doğruluk Beyanı:</span>
              </span>
              <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                Gönderilen iletilerdeki ifadelerin ve fotoğrafların doğruluğu tarafıma aittir. Kasıtlı asılsız ihbar veya hakaret niteliğindeki bildirimlerin yasal yaptırıma tabi olabileceğini kabul ve beyan ederim.
              </p>
            </div>
          </label>
        </div>

        {/* Aksiyon Butonu (Sticky Bottom Action Bar) */}
        <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">
              Hazırlanan Taslak: {selectedEmails.length} Yetkili Kuruma Gönderilecek
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isDisclaimerAccepted
                ? 'E-posta istemciniz açılacak; kontrol edip tek tıkla göndereceksiniz.'
                : 'Devam etmek için lütfen Adım 6 onay kutusunu işaretleyiniz.'}
            </span>
          </div>

          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isDisclaimerAccepted
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-none'
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
        photoCount={photos.length}
      />
    </div>
  );
}
