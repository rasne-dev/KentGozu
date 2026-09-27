import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  Car, 
  Building2, 
  Home, 
  HelpCircle,
  CheckCircle2,
  Edit3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ISTANBUL_DISTRICTS, ROAD_TYPES, findDistrictByName } from '../data/istanbulData';

export default function LocationPicker({
  locationData,
  setLocationData,
  roadType,
  setRoadType
}) {
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isManualDetailsOpen, setIsManualDetailsOpen] = useState(false);

  // Adresi parçalardan otomatik birleştir
  const updateAddressComponent = (field, value) => {
    setLocationData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Parçalardan açık adresi derle
      const parts = [
        updated.road,
        updated.buildingNo ? `No: ${updated.buildingNo}` : '',
        updated.neighbourhood,
        updated.landmark ? `(${updated.landmark})` : '',
        updated.districtName ? `${updated.districtName} / İstanbul` : 'İstanbul'
      ].filter(Boolean);

      return {
        ...updated,
        fullAddress: parts.join(', ')
      };
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Tarayıcınız coğrafi konum servisini desteklemiyor.');
      return;
    }

    setLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'tr'
              }
            }
          );

          if (!response.ok) {
            throw new Error('Adres bilgisi çözümlenemedi.');
          }

          const data = await response.json();
          const addr = data.address || {};

          const rawDistrict = addr.county || addr.town || addr.city_district || addr.district || addr.suburb || '';
          const matchedDistrict = findDistrictByName(rawDistrict);

          const neighbourhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || '';
          const road = addr.road || addr.pedestrian || addr.street || '';
          const houseNumber = addr.house_number || '';

          const composedAddress = [
            road,
            houseNumber ? `No: ${houseNumber}` : '',
            neighbourhood,
            matchedDistrict ? `${matchedDistrict.district} / İstanbul` : (rawDistrict || 'İstanbul')
          ].filter(Boolean).join(', ');

          setLocationData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            districtObj: matchedDistrict || null,
            districtName: matchedDistrict ? matchedDistrict.district : (rawDistrict || ''),
            neighbourhood,
            road,
            buildingNo: houseNumber,
            landmark: prev.landmark || '',
            fullAddress: composedAddress || data.display_name,
            isDetected: true
          }));
        } catch (err) {
          console.error('Tersine adresleme hatası:', err);
          setLocationData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            isDetected: true,
            fullAddress: prev.fullAddress || `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Konum izni reddedildi. Lütfen tarayıcı ayarlarından konum izni verin veya ilçeyi el ile seçin.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Konum bilgisi alınamadı. Lütfen elle seçim yapınız.');
            break;
          case error.TIMEOUT:
            setGeoError('Konum alma isteği zaman aşımına uğradı. Tekrar deneyin veya elle girin.');
            break;
          default:
            setGeoError('Konum alınırken bir hata oluştu.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000
      }
    );
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const selected = ISTANBUL_DISTRICTS.find((d) => d.id === districtId) || null;
    
    setLocationData((prev) => {
      const updated = {
        ...prev,
        districtObj: selected,
        districtName: selected ? selected.district : ''
      };
      
      const parts = [
        updated.road,
        updated.buildingNo ? `No: ${updated.buildingNo}` : '',
        updated.neighbourhood,
        updated.landmark ? `(${updated.landmark})` : '',
        updated.districtName ? `${updated.districtName} / İstanbul` : 'İstanbul'
      ].filter(Boolean);

      return {
        ...updated,
        fullAddress: parts.join(', ')
      };
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            2. Konum ve Yol Yetki Alanı
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Yetkili kurum (İlçe Belediyesi, İBB veya Karayolları) konumunuza ve yol tipine göre otomatik eşleşir.
          </p>
        </div>

        <button
          type="button"
          onClick={detectLocation}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-800/80 transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Konum Alınıyor...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              <span>📍 Konumumu Otomatik Bul</span>
            </>
          )}
        </button>
      </div>

      {geoError && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{geoError}</span>
        </div>
      )}

      {locationData.latitude && locationData.longitude && (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>GPS Koordinatı:</strong> {locationData.latitude}, {locationData.longitude}
            </span>
          </div>
          <a
            href={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 hover:underline font-medium"
          >
            <span>Haritada Gör</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Ana Adres ve İlçe Satırı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* İlçe Seçimi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            İlçe (İstanbul):
          </label>
          <select
            value={locationData.districtObj?.id || ''}
            onChange={handleDistrictChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100"
          >
            <option value="">-- İlçe Seçiniz --</option>
            <optgroup label="Avrupa Yakası">
              {ISTANBUL_DISTRICTS.filter((d) => d.side === 'Avrupa').map((d) => (
                <option key={d.id} value={d.id}>
                  {d.district} Belediyesi
                </option>
              ))}
            </optgroup>
            <optgroup label="Anadolu Yakası">
              {ISTANBUL_DISTRICTS.filter((d) => d.side === 'Anadolu').map((d) => (
                <option key={d.id} value={d.id}>
                  {d.district} Belediyesi
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Açık Adres / Mahalle / Cadde */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Açık Adres / Konum Tarifi:
            </label>
            <button
              type="button"
              onClick={() => setIsManualDetailsOpen((prev) => !prev)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isManualDetailsOpen ? 'Detayları Gizle' : 'Nokta Atışı Düzelt'}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Örn: Caferağa Mah. Moda Cad. No: 24 önü"
            value={locationData.fullAddress || ''}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, fullAddress: e.target.value }))
            }
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Nokta Atışı Adres Düzeltme Paneli */}
      {isManualDetailsOpen && (
        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Nokta Atışı Adres Bilgilerini Detaylandırın
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400">
              Belediye ekiplerinin noktayı tam bulması için
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                Mahalle:
              </label>
              <input
                type="text"
                placeholder="Örn: Caferağa Mah."
                value={locationData.neighbourhood || ''}
                onChange={(e) => updateAddressComponent('neighbourhood', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                Cadde / Sokak:
              </label>
              <input
                type="text"
                placeholder="Örn: Moda Caddesi"
                value={locationData.road || ''}
                onChange={(e) => updateAddressComponent('road', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                Bina / Kapı No:
              </label>
              <input
                type="text"
                placeholder="Örn: No: 18 / 2B"
                value={locationData.buildingNo || ''}
                onChange={(e) => updateAddressComponent('buildingNo', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
              Yakınındaki Tanınmış Referans / Tarif (Opsiyonel):
            </label>
            <input
              type="text"
              placeholder="Örn: Eczanenin tam önü, otobüs durağı yanı, fırının karşısındaki çukur"
              value={locationData.landmark || ''}
              onChange={(e) => updateAddressComponent('landmark', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Yol Tipi / Yetki Alanı Seçimi */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Yol Konumu / Sorumluluk Tipi:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ROAD_TYPES.map((type) => {
            const isSelected = roadType === type.id;
            return (
              <button
                type="button"
                key={type.id}
                onClick={() => setRoadType(type.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-1 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {type.id === 'highway' && <Car className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                  {type.id === 'main_artery' && <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  {type.id === 'neighborhood' && <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  {type.id === 'unknown' && <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                    {type.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {type.authorityDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
