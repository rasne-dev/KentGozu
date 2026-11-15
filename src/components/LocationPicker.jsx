import React, { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  Sparkles,
  Info,
  Map,
  Search,
  X
} from 'lucide-react';
import { ISTANBUL_DISTRICTS, ROAD_TYPES, findDistrictByName } from '../data/istanbulData';
import { normalizeTurkish, composeTurkishAddress } from '../utils/helpers';
import { getDeviceLocation } from '../utils/nativeBridge';
import MiniMapPreview from './MiniMapPreview';

function resolveDistrictFromNominatim(data) {
  const addr = data?.address || {};
  const rawDistrict = addr.county || addr.city_district || addr.town || addr.district || addr.municipality || '';
  let matchedDistrict = findDistrictByName(rawDistrict);
  if (!matchedDistrict && data?.display_name) {
    const cleanDisplay = normalizeTurkish(data.display_name);
    const sortedByLength = [...ISTANBUL_DISTRICTS].sort((a, b) => b.district.length - a.district.length);
    for (const d of sortedByLength) {
      if (cleanDisplay.includes(normalizeTurkish(d.district))) {
        matchedDistrict = d;
        break;
      }
    }
  }
  return { matchedDistrict, rawDistrict };
}

export default function LocationPicker({
  locationData,
  setLocationData,
  roadType,
  setRoadType,
  isInvalid = false
}) {
  const [loading, setLoading] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isManualDetailsOpen, setIsManualDetailsOpen] = useState(false);
  const [showMap, setShowMap] = useState(() => Boolean(locationData.latitude && locationData.longitude));
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [addressSearchResults, setAddressSearchResults] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const reverseAbortRef = useRef(null);
  const searchAbortRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const searchContainerRef = useRef(null);
  const skipNextSearchRef = useRef(false);

  // Unmount anında askıdaki istekleri ve zamanlayıcıları iptal et
  useEffect(() => {
    return () => {
      if (reverseAbortRef.current) {
        reverseAbortRef.current.abort();
      }
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Arama açılır listesi dışına tıklandığında kapat
  useEffect(() => {
    if (!showSearchDropdown) return;
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchDropdown]);

  // İstanbul sınırlarına kısıtlı Forward Geocoding adres araması
  const performAddressSearch = async (rawQuery) => {
    const trimmed = rawQuery.trim();
    if (trimmed.length < 3) {
      setAddressSearchResults([]);
      setAddressSearchError(null);
      setShowSearchDropdown(false);
      return;
    }

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    setIsSearchingAddress(true);
    setAddressSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=tr&viewbox=27.95,41.60,29.95,40.75&bounded=1&q=${encodeURIComponent(trimmed)}`,
        {
          headers: { 'Accept-Language': 'tr' },
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error('Adres arama servisi yanıt vermedi.');
      }

      const data = await response.json();
      const results = Array.isArray(data) ? data : [];
      setAddressSearchResults(results);
      setShowSearchDropdown(true);
      if (results.length === 0) {
        setAddressSearchError('İstanbul sınırları içinde eşleşen adres veya sokak bulunamadı.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setAddressSearchResults([]);
        setShowSearchDropdown(true);
        setAddressSearchError('Adres araması şu anda yapılamıyor. Lütfen tekrar deneyin veya haritadan seçin.');
      }
    } finally {
      clearTimeout(timeoutId);
      if (searchAbortRef.current === controller) {
        setIsSearchingAddress(false);
      }
    }
  };

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const trimmed = addressSearchQuery.trim();
    if (trimmed.length < 3) {
      setAddressSearchResults([]);
      setAddressSearchError(null);
      setShowSearchDropdown(false);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      performAddressSearch(trimmed);
    }, 400);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [addressSearchQuery]);

  const handleSelectSearchResult = (item) => {
    const latNum = parseFloat(item.lat);
    const lonNum = parseFloat(item.lon);
    if (isNaN(latNum) || isNaN(lonNum)) return;

    const addr = item.address || {};
    const { matchedDistrict, rawDistrict } = resolveDistrictFromNominatim(item);
    const neighbourhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || '';
    const road = addr.road || addr.pedestrian || addr.street || '';
    const houseNumber = addr.house_number || '';

    skipNextSearchRef.current = true;
    setAddressSearchQuery(item.display_name?.split(',').slice(0, 2).join(', ') || '');
    setShowSearchDropdown(false);
    setAddressSearchError(null);
    setGeoError(null);

    setLocationData((prev) => {
      const currentDistrict = matchedDistrict || prev.districtObj;
      const districtName = currentDistrict ? currentDistrict.district : (rawDistrict || prev.districtName);
      const composedAddress = composeTurkishAddress({
        neighbourhood,
        road,
        buildingNo: houseNumber,
        landmark: prev.landmark,
        districtName
      });

      return {
        ...prev,
        latitude: latNum.toFixed(6),
        longitude: lonNum.toFixed(6),
        districtObj: currentDistrict,
        districtName,
        neighbourhood,
        road,
        buildingNo: houseNumber,
        fullAddress: composedAddress || item.display_name,
        isDetected: true
      };
    });

    setShowMap(true);
  };

  // Haritadan iğne sürüklendiğinde veya tıklandığında konumu güncelle (Yarış durumunu engelle)
  const handleMapPositionChange = async ({ latitude, longitude }) => {
    setLocationData((prev) => ({
      ...prev,
      latitude,
      longitude,
      isDetected: true
    }));

    // Önceki tersine adresleme isteğini iptal et
    if (reverseAbortRef.current) {
      reverseAbortRef.current.abort();
    }
    const controller = new AbortController();
    reverseAbortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    setIsReverseGeocoding(true);

    // Taşınan noktanın cadde ve mahallesini arka planda tersine sorgula
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { 
          headers: { 'Accept-Language': 'tr' },
          signal: controller.signal
        }
      );
      if (response.ok) {
        const data = await response.json();
        const addr = data.address || {};
        const { matchedDistrict, rawDistrict } = resolveDistrictFromNominatim(data);
        const neighbourhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || '';
        const road = addr.road || addr.pedestrian || addr.street || '';
        const houseNumber = addr.house_number || '';

        const province = addr.province || addr.state || addr.city || '';
        if (province && !normalizeTurkish(province).includes('istanbul') && !matchedDistrict) {
          setGeoError(`Seçilen konum İstanbul dışında (${province}) görünüyor. KentGözü şu anda İstanbul genelinde hizmet vermektedir. Lütfen aşağıdaki listeden İstanbul ilçenizi seçiniz.`);
        } else {
          setGeoError(null);
        }

        setLocationData((prev) => {
          const currentDistrict = matchedDistrict || prev.districtObj;
          const districtName = currentDistrict ? currentDistrict.district : (rawDistrict || prev.districtName);
          const composedAddress = composeTurkishAddress({
            neighbourhood,
            road,
            buildingNo: houseNumber,
            landmark: prev.landmark,
            districtName
          });

          return {
            ...prev,
            latitude,
            longitude,
            districtObj: currentDistrict,
            districtName,
            neighbourhood,
            road,
            buildingNo: houseNumber,
            fullAddress: composedAddress || data.display_name || prev.fullAddress
          };
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Ağ hatasında koordinatı koru
      }
    } finally {
      clearTimeout(timeoutId);
      if (reverseAbortRef.current === controller) {
        setIsReverseGeocoding(false);
      }
    }
  };

  // Adresi parçalardan otomatik birleştir (Resmi Türk adresi hiyerarşisi: Mahalle, Cadde/Sokak, No, Tarif, İlçe)
  const updateAddressComponent = (field, value) => {
    setLocationData((prev) => {
      const updated = { ...prev, [field]: value };
      return {
        ...updated,
        fullAddress: composeTurkishAddress(updated)
      };
    });
  };

  const detectLocation = async () => {
    setLoading(true);
    setGeoError(null);

    let coords;
    try {
      coords = await getDeviceLocation({ timeout: 12000 });
    } catch (error) {
      setLoading(false);
      switch (error?.code) {
        case 'GEOLOCATION_UNSUPPORTED':
          setGeoError('Cihazınız veya tarayıcınız coğrafi konum servisini desteklemiyor.');
          break;
        case 'PERMISSION_DENIED':
          setGeoError('Konum izni reddedildi. Lütfen uygulama veya tarayıcı ayarlarından izin verin ya da ilçenizi aşağıdan seçin.');
          break;
        case 'TIMEOUT':
          setGeoError('Konum alma isteği zaman aşımına uğradı. Tekrar deneyin veya adres arayarak seçin.');
          break;
        default:
          setGeoError('Konum bilgisi alınamadı. Lütfen adres arayarak veya elle seçim yapınız.');
      }
      return;
    }

    const { latitude, longitude } = coords;
    if (reverseAbortRef.current) {
      reverseAbortRef.current.abort();
    }
    const controller = new AbortController();
    reverseAbortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'tr'
          },
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error('Adres bilgisi çözümlenemedi.');
      }

      const data = await response.json();
      const addr = data.address || {};
      const { matchedDistrict, rawDistrict } = resolveDistrictFromNominatim(data);

      const province = addr.province || addr.state || addr.city || '';
      if (province && !normalizeTurkish(province).includes('istanbul') && !matchedDistrict) {
        setGeoError(`Alınan konum İstanbul dışında (${province}) görünüyor. KentGözü şu anda İstanbul genelinde hizmet vermektedir. Lütfen aşağıdaki listeden İstanbul ilçenizi seçiniz.`);
      }

      const neighbourhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || '';
      const road = addr.road || addr.pedestrian || addr.street || '';
      const houseNumber = addr.house_number || '';

      setLocationData((prev) => {
        const districtName = matchedDistrict ? matchedDistrict.district : (rawDistrict || '');
        const composedAddress = composeTurkishAddress({
          neighbourhood,
          road,
          buildingNo: houseNumber,
          landmark: prev.landmark || '',
          districtName
        });

        return {
          ...prev,
          latitude: Number(latitude).toFixed(6),
          longitude: Number(longitude).toFixed(6),
          districtObj: matchedDistrict || null,
          districtName,
          neighbourhood,
          road,
          buildingNo: houseNumber,
          landmark: prev.landmark || '',
          fullAddress: composedAddress || data.display_name,
          isDetected: true
        };
      });
      setShowMap(true);
    } catch (err) {
      console.error('Tersine adresleme hatası:', err);
      setLocationData((prev) => ({
        ...prev,
        latitude: Number(latitude).toFixed(6),
        longitude: Number(longitude).toFixed(6),
        isDetected: true,
        fullAddress: prev.fullAddress || `Koordinat: ${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`
      }));
      setShowMap(true);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
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
      
      const hasDetailedFields = Boolean(updated.road || updated.neighbourhood || updated.buildingNo || updated.landmark);
      let newFullAddress = prev.fullAddress;

      if (hasDetailedFields) {
        newFullAddress = composeTurkishAddress(updated);
      } else if (prev.fullAddress) {
        if (prev.districtName && prev.fullAddress.includes(prev.districtName)) {
          newFullAddress = prev.fullAddress.replace(prev.districtName, updated.districtName || '');
        } else if (!prev.districtName && updated.districtName) {
          newFullAddress = `${prev.fullAddress}, ${updated.districtName} / İstanbul`;
        }
      } else if (updated.districtName) {
        newFullAddress = `${updated.districtName} / İstanbul`;
      }

      return {
        ...updated,
        fullAddress: newFullAddress
      };
    });
  };

  const handleResetLocation = () => {
    setLocationData({
      latitude: '',
      longitude: '',
      districtObj: null,
      districtName: '',
      neighbourhood: '',
      road: '',
      buildingNo: '',
      landmark: '',
      fullAddress: '',
      isDetected: false
    });
      setShowMap(false);
    setGeoError(null);
    setAddressSearchQuery('');
    setAddressSearchResults([]);
    setAddressSearchError(null);
    setShowSearchDropdown(false);
  };

  return (
    <div 
      id="step-location-picker" 
      className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border transition-all ${
        isInvalid 
          ? 'border-red-500 ring-2 ring-red-500/20 shadow-md' 
          : 'border-slate-200 dark:border-slate-800 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
              Adım 2: Konum ve Yol Yetki Alanı
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Doğru yetkili kurum (İlçe Belediyesi, İBB veya Karayolları) konum ve yol tipine göre belirlenir.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={detectLocation}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-800 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Konum Alınıyor...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Konumumu Bul</span>
              </>
            )}
          </button>

          {/* Mini Harita Önizleme Aç / Kapat Butonu */}
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer shadow-2xs ${
              showMap
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Harita önizlemesini aç / kapat"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{showMap ? 'Haritayı Gizle' : 'Haritada İğnele'}</span>
          </button>

          {(locationData.latitude || locationData.fullAddress || locationData.districtName) && (
            <button
              type="button"
              onClick={handleResetLocation}
              title="Konum bilgilerini sıfırla"
              aria-label="Konum bilgilerini sıfırla"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Sıfırla</span>
            </button>
          )}
        </div>
      </div>

      {/* Adres / Sokak Arama (Forward Geocoding) */}
      <div className="relative mb-3" ref={searchContainerRef}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              aria-label="İstanbul içinde sokak, mahalle veya adres ara"
              placeholder="Sokak, mahalle veya cadde ara (örn: Bağdat Caddesi Kadıköy)..."
              value={addressSearchQuery}
              onChange={(e) => setAddressSearchQuery(e.target.value)}
              onFocus={() => {
                if (addressSearchResults.length > 0 || addressSearchError) {
                  setShowSearchDropdown(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                  performAddressSearch(addressSearchQuery);
                } else if (e.key === 'Escape') {
                  setShowSearchDropdown(false);
                }
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {addressSearchQuery && (
              <button
                type="button"
                aria-label="Adres aramasını temizle"
                onClick={() => {
                  setAddressSearchQuery('');
                  setAddressSearchResults([]);
                  setAddressSearchError(null);
                  setShowSearchDropdown(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2 top-1.5 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
              performAddressSearch(addressSearchQuery);
            }}
            disabled={isSearchingAddress || addressSearchQuery.trim().length < 3}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isSearchingAddress ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Aranıyor...</span>
              </>
            ) : (
              <span>Haritada Bul</span>
            )}
          </button>
        </div>

        {showSearchDropdown && (addressSearchResults.length > 0 || addressSearchError) && (
          <div
            role="listbox"
            aria-label="Adres arama sonuçları"
            className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in duration-100"
          >
            {addressSearchError ? (
              <div className="p-3 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{addressSearchError}</span>
              </div>
            ) : (
              addressSearchResults.map((item) => {
                const { matchedDistrict } = resolveDistrictFromNominatim(item);
                const shortLabel = item.name || item.address?.road || item.display_name?.split(',')[0] || 'Konum';
                return (
                  <button
                    type="button"
                    role="option"
                    key={`${item.place_id}-${item.lat}-${item.lon}`}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 border-b last:border-b-0 border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate">
                          {shortLabel}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                          {item.display_name}
                        </span>
                      </div>
                    </div>
                    {matchedDistrict && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                        {matchedDistrict.district}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {geoError && (
        <div className="flex items-start gap-2 p-3 mb-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-200" role="alert">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{geoError}</span>
        </div>
      )}

      {locationData.latitude && locationData.longitude && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 mb-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 flex-wrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>GPS Koordinatı Alındı:</strong> {locationData.latitude}, {locationData.longitude}
            </span>
            {isReverseGeocoding && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Adres çözümleniyor...</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMap((prev) => !prev)}
              className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 hover:underline font-semibold cursor-pointer"
            >
              <Map className="w-3 h-3" />
              <span>{showMap ? 'Haritayı Kapat' : 'Haritada Ayarla'}</span>
            </button>
            <span className="text-emerald-300 dark:text-emerald-700">|</span>
            <a
              href={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 hover:underline font-semibold"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Mini Harita Önizleme Bileşeni (İğne Sürükleme ve Tıklama Destekli) */}
      {showMap && (
        <MiniMapPreview
          latitude={locationData.latitude}
          longitude={locationData.longitude}
          districtObj={locationData.districtObj}
          onPositionChange={handleMapPositionChange}
          isDetected={locationData.isDetected}
        />
      )}

      {/* GPS Çözümlendi ancak İlçe Eşleşmediyse Bildirim */}
      {locationData.latitude && !locationData.districtObj && roadType !== 'highway' && (
        <div className="flex items-center gap-2 p-2.5 mb-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-150">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Koordinat alındı ancak ilçe otomatik çözümlenemedi. Lütfen açılır listeden ilgili <strong>ilçenizi seçiniz</strong>.</span>
        </div>
      )}

      {/* Ana Adres ve İlçe Satırı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* İlçe Seçimi */}
        <div>
          <label htmlFor="location-district-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            İlçe (İstanbul): {roadType !== 'highway' ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-slate-400 font-normal text-[11px] ml-1">(Otoyollar için opsiyonel)</span>
            )}
          </label>
          <select
            id="location-district-select"
            value={locationData.districtObj?.id || ''}
            onChange={handleDistrictChange}
            className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 ${
              isInvalid && !locationData.districtObj 
                ? 'border-red-500 ring-1 ring-red-500' 
                : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
            }`}
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
            <label htmlFor="location-full-address-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Açık Adres / Konum Tarifi:
            </label>
            <button
              type="button"
              onClick={() => setIsManualDetailsOpen((prev) => !prev)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isManualDetailsOpen ? 'Detayları Kapat' : 'Adresi Detaylandır'}</span>
            </button>
          </div>
          <input
            id="location-full-address-input"
            type="text"
            placeholder="Örn: Caferağa Mah. Moda Cad. No: 24 önü"
            value={locationData.fullAddress || ''}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, fullAddress: e.target.value }))
            }
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Konumu Düzelt / Detaylandırma Paneli */}
      {isManualDetailsOpen && (
        <div className="p-3.5 mb-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Mahalle, Sokak ve Kapı No Detayları
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400">
              Belediye ekiplerinin noktayı tam bulması için
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label htmlFor="location-neighbourhood-input" className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                Mahalle:
              </label>
              <input
                id="location-neighbourhood-input"
                type="text"
                placeholder="Örn: Caferağa Mah."
                value={locationData.neighbourhood || ''}
                onChange={(e) => updateAddressComponent('neighbourhood', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location-road-input" className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                Cadde / Sokak:
              </label>
              <input
                id="location-road-input"
                type="text"
                placeholder="Örn: Moda Caddesi"
                value={locationData.road || ''}
                onChange={(e) => updateAddressComponent('road', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location-building-input" className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                Bina / Kapı No:
              </label>
              <input
                id="location-building-input"
                type="text"
                placeholder="Örn: No: 18 / 2B"
                value={locationData.buildingNo || ''}
                onChange={(e) => updateAddressComponent('buildingNo', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location-landmark-input" className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
              Yakınındaki Tanınmış Referans / Tarif (Opsiyonel):
            </label>
            <input
              id="location-landmark-input"
              type="text"
              placeholder="Örn: Eczanenin tam önü, otobüs durağı yanı, fırının karşısındaki çukur"
              value={locationData.landmark || ''}
              onChange={(e) => updateAddressComponent('landmark', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                aria-pressed={isSelected}
                onClick={() => setRoadType(type.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/25 shadow-xs'
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
