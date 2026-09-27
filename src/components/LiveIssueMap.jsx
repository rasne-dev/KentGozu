import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Filter, 
  Layers, 
  ExternalLink, 
  ThumbsUp, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { getStoredReports } from '../data/sampleReports';

// Kategori renkleri
const categoryColors = {
  yol_cukur: { bg: '#f59e0b', label: 'Yol Çukuru' },
  kaldirim_hasar: { bg: '#ea580c', label: 'Kaldırım' },
  tabela_levha: { bg: '#2563eb', label: 'Tabela' },
  rogar_mazgal: { bg: '#dc2626', label: 'Mazgal/Rögar' },
  aydinlatma_direk: { bg: '#eab308', label: 'Aydınlatma' },
  cop_moloz: { bg: '#059669', label: 'Çöp/Moloz' },
  diger: { bg: '#6366f1', label: 'Diğer' }
};

export default function LiveIssueMap({ onReportSimilarIssue }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [reports, setReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const list = getStoredReports();
    setReports(list);
  }, []);

  // Haritayı başlat
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // İstanbul merkezli harita
    const map = L.map(mapContainerRef.current, {
      center: [41.015, 29.02],
      zoom: 11,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filtre veya raporlar değiştiğinde pinleri güncelle
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const filtered = reports.filter((rep) => {
      if (selectedCategory === 'ALL') return true;
      return rep.issueTypeId === selectedCategory;
    });

    filtered.forEach((rep) => {
      const colorInfo = categoryColors[rep.issueTypeId] || { bg: '#2563eb', label: 'Sorun' };

      // Özel pin HTML ikonu
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${colorInfo.bg};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 13px;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedReport(rep);
      });

      markersLayer.addLayer(marker);
    });
  }, [reports, selectedCategory]);

  const handleSupport = (reportId) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, supportCount: r.supportCount + 1 } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => ({ ...prev, supportCount: prev.supportCount + 1 }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Harita Başlık Kartı */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Canlı Kentsel Aksaklık Haritası</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            İstanbul Genelinde Bildirilen Sorunlar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daha önce vatandaşlar tarafından ilgili belediyelere ve kurumlara iletilen sorunları haritada görün.
          </p>
        </div>

        {/* İstatistikler */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shrink-0">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Toplam Bildirim</span>
            <strong className="text-slate-800 dark:text-white text-sm">{reports.length} Nokta</strong>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Kapsam</span>
            <strong className="text-blue-600 dark:text-blue-400 text-sm">İstanbul 39 İlçe</strong>
          </div>
        </div>
      </div>

      {/* Kategori Filtre Butonları */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Tüm Sorunlar ({reports.length})
        </button>

        {Object.entries(categoryColors).map(([key, info]) => {
          const count = reports.filter((r) => r.issueTypeId === key).length;
          const isSelected = selectedCategory === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.bg }} />
              <span>{info.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Harita ve Seçili Sorun Paneli */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Harita */}
        <div className="lg:col-span-2 h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs relative z-10">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Seçili Bildirim Detay Kartı */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          {selectedReport ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  {selectedReport.district}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedReport.reportedAt}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedReport.issueTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{selectedReport.address}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>İletilen Kurum:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedReport.authority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Mevcut Durum:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200">
                💡 Bu sorun bölgedeki bir vatandaş tarafından ilgili idareye bildirilmiştir. Siz de aynı sorundan şikayetçiyseniz destek verebilirsiniz.
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSupport(selectedReport.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Ben de Şikayetçiyim ({selectedReport.supportCount})</span>
                </button>

                <a
                  href={`https://www.google.com/maps?q=${selectedReport.lat},${selectedReport.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Google Haritalar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Bir Bildirim Noktası Seçin
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Harita üzerindeki renkli pinlere tıklayarak daha önce bildirilmiş kentsel aksaklıkların detaylarını ve iletildiği kurumları görüntüleyebilirsiniz.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onReportSimilarIssue}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yeni Bir Sorun Bildir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
