import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ZoomIn, ZoomOut, Move, Check, HelpCircle } from 'lucide-react';
import { DISTRICT_COORDINATES } from '../data/istanbulData';

// Özel yüksek çözünürlüklü SVG raptiye ikonu (Vite uyumlu, kırık resim yolu sorunu yaratmaz)
const createCustomPinIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); cursor: grab;">
        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border: 2.5px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);">
          <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export default function MiniMapPreview({
  latitude,
  longitude,
  districtObj,
  onPositionChange,
  isDetected = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [pinCoords, setPinCoords] = useState(null);

  // Başlangıç merkez koordinatını hesapla
  const getCenterCoords = () => {
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    if (!isNaN(latNum) && !isNaN(lngNum) && latNum > 0 && lngNum > 0) {
      return [latNum, lngNum];
    }
    if (districtObj && DISTRICT_COORDINATES[districtObj.id]) {
      return DISTRICT_COORDINATES[districtObj.id];
    }
    return [41.0082, 28.9784]; // İstanbul Genel Merkez
  };

  const hasPreciseCoords = Boolean(
    latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const center = getCenterCoords();
    const zoomLevel = hasPreciseCoords ? 16 : (districtObj ? 14 : 11);

    // Harita zaten kurulu değilse başlat
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoomLevel,
        zoomControl: false,
        scrollWheelZoom: false, // Sayfa kaydırmasını engellememek için
        attributionControl: false
      });

      // OpenStreetMap altlık katmanı
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Yakınlaştırma butonunu sağ alta yerleştir
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;

      // Harita üzerine tıklanınca iğneyi o noktaya taşı
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        updateMarkerPosition(lat, lng, true);
      });
    }

    const map = mapInstanceRef.current;

    // Koordinat varsa veya ilçe değiştiğinde haritayı odakla
    if (hasPreciseCoords) {
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(longitude);
      updateMarkerPosition(latNum, lngNum, false);
      map.setView([latNum, lngNum], 16, { animate: true });
    } else if (districtObj && DISTRICT_COORDINATES[districtObj.id]) {
      const districtCoords = DISTRICT_COORDINATES[districtObj.id];
      map.setView(districtCoords, 14, { animate: true });
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
        setPinCoords(null);
      }
    }

    // Harita boyutunu düzelt (render gecikmelerini önler)
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, [districtObj]);

  // Koordinat dışarıdan (GPS) değiştiğinde haritayı güncelle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (!isNaN(latNum) && !isNaN(lngNum) && latNum > 0 && lngNum > 0) {
      updateMarkerPosition(latNum, lngNum, false);
      mapInstanceRef.current.setView([latNum, lngNum], 16, { animate: true });
    }
  }, [latitude, longitude]);

  // İğne konumunu güncelle ve sürükleme dinleyicilerini bağla
  const updateMarkerPosition = (lat, lng, notifyParent = true) => {
    if (!mapInstanceRef.current) return;
    const fixedLat = parseFloat(lat.toFixed(6));
    const fixedLng = parseFloat(lng.toFixed(6));

    if (!markerRef.current) {
      const marker = L.marker([fixedLat, fixedLng], {
        icon: createCustomPinIcon(),
        draggable: true,
        autoPan: true
      }).addTo(mapInstanceRef.current);

      marker.on('dragend', (event) => {
        const markerPos = event.target.getLatLng();
        const newLat = parseFloat(markerPos.lat.toFixed(6));
        const newLng = parseFloat(markerPos.lng.toFixed(6));
        setPinCoords({ lat: newLat, lng: newLng });
        if (onPositionChange) {
          onPositionChange({ latitude: newLat.toString(), longitude: newLng.toString() });
        }
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng([fixedLat, fixedLng]);
    }

    setPinCoords({ lat: fixedLat, lng: fixedLng });

    if (notifyParent && onPositionChange) {
      onPositionChange({ latitude: fixedLat.toString(), longitude: fixedLng.toString() });
    }
  };

  const handleCenterOnMarker = () => {
    if (mapInstanceRef.current && pinCoords) {
      mapInstanceRef.current.setView([pinCoords.lat, pinCoords.lng], 17, { animate: true });
    }
  };

  return (
    <div className="space-y-2 mb-3">
      {/* Harita Konteyneri */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner isolate bg-slate-100 dark:bg-slate-800">
        <div
          ref={mapContainerRef}
          className="h-56 sm:h-64 w-full z-0 cursor-crosshair"
          aria-label="Kentsel sorun konum haritası"
        />

        {/* Üst Bilgi Rozeti */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 pointer-events-none flex items-center justify-between gap-2">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-[11px] text-slate-700 dark:text-slate-200 flex items-center gap-1.5 pointer-events-auto">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium hidden sm:inline">
              {pinCoords ? 'İğneyi sürükleyerek veya haritaya tıklayarak noktayı tam ayarlayın' : 'Haritaya tıklayarak sorunun tam yerini işaretleyin'}
            </span>
            <span className="font-medium sm:hidden">
              {pinCoords ? 'İğneyi sürükleyip tam konumu ayarlayın' : 'Haritadan nokta işaretleyin'}
            </span>
          </div>

          {pinCoords && (
            <button
              type="button"
              onClick={handleCenterOnMarker}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 pointer-events-auto transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="İğneye odaklan"
            >
              <Navigation className="w-3 h-3" />
              <span className="hidden xs:inline">Merkezle</span>
            </button>
          )}
        </div>

        {/* Alt Bilgi İpuçları */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[10px] font-mono pointer-events-auto shadow-xs">
            {pinCoords ? (
              <span>📍 {pinCoords.lat}, {pinCoords.lng}</span>
            ) : (
              <span>Haritadan nokta seçilmedi</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
