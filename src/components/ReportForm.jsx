import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import IssueSelector from './IssueSelector';
import LocationPicker from './LocationPicker';
import PhotoUploader from './PhotoUploader';
import AuthoritySelector from './AuthoritySelector';
import MailPreviewModal from './MailPreviewModal';
import { determineResponsibleAuthorities } from '../data/istanbulData';

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
    fullAddress: '',
    isDetected: false
  });
  const [roadType, setRoadType] = useState('neighborhood'); // neighborhood, main_artery, highway, unknown
  const [photoData, setPhotoData] = useState(null);
  const [userNote, setUserNote] = useState('');
  const [userName, setUserName] = useState('');

  // Dinamik olarak hesaplanan yetkililer
  const [authorities, setAuthorities] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Modal durumu
  const [isModalOpen, setIsModalOpen] = useState(false);

  // preselectedDistrict değişirse güncelle
  useEffect(() => {
    if (preselectedDistrict) {
      setLocationData((prev) => ({
        ...prev,
        districtObj: preselectedDistrict,
        districtName: preselectedDistrict.district
      }));
    }
  }, [preselectedDistrict]);

  // Sorun, konum veya yol tipi değiştikçe yetkili kurumları güncelle
  useEffect(() => {
    const list = determineResponsibleAuthorities({
      districtObj: locationData.districtObj,
      roadType,
      issueTypeId: selectedIssue?.id || ''
    });

    setAuthorities(list);
    // Varsayılan olarak tüm ilgili kurumların maillerini seçili yap
    setSelectedEmails(list.map((a) => a.email));
  }, [locationData.districtObj, roadType, selectedIssue]);

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) => {
      if (prev.includes(email)) {
        if (prev.length === 1) return prev; // En az bir alıcı kalmalı
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

    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Hızlı & Doğrudan Resmi Bildirim</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Kentsel Aksaklığı Bildirin, Yetkili Kuruma İletelim
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Yoldaki bir çukur, kırık mazgal veya devrilmiş tabela ile mi karşılaştınız?
            Sorunu seçin; uygulama konuma göre <strong>Karayolları, İBB veya İlçe Belediyesi</strong>'ni eşleştirip resmi başvuru taslağınızı hazırlasın.
          </p>
        </div>
      </div>

      <form onSubmit={handleOpenPreview} className="space-y-5">
        {/* Adım 1: Sorun Türü */}
        <IssueSelector
          selectedIssue={selectedIssue}
          onSelectIssue={setSelectedIssue}
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
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Sorun Açıklaması & Notunuz
            </label>
            <textarea
              rows={3}
              placeholder={
                selectedIssue?.placeholder ||
                'Sorunun tam yeri, boyutu veya trafiğe etkisine dair eklemek istediğiniz detaylar...'
              }
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adınız Soyadınız (Opsiyonel):
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
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

        {/* Aksiyon Butonu */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-blue-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span className="font-semibold text-slate-900 block">
              Hazırlanan Taslak: {selectedEmails.length} Yetkili Kuruma Yönlendirilecek
            </span>
            <span className="text-[11px] text-slate-500">
              E-posta istemciniz açılacak; kontrol edip tek tıkla göndereceksiniz.
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
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
