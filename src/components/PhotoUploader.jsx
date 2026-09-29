import React, { useRef, useState } from 'react';
import { Camera, Images, Trash2, X, Plus, ShieldCheck, ZoomIn } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

export default function PhotoUploader({ photos = [], setPhotos }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const MAX_PHOTOS = 5;

  const processFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      return;
    }

    const filesToProcess = Array.from(fileList).slice(0, remainingSlots);

    const newPhotos = filesToProcess
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        sizeFormatted: formatFileSize(file.size)
      }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleGalleryChange = (e) => {
    processFiles(e.target.files);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleCameraChange = (e) => {
    processFiles(e.target.files);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAllPhotos = () => {
    photos.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    setPhotos([]);
  };

  // Drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div 
      id="step-photo-uploader" 
      className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            3
          </span>
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Adım 3: Fotoğraf Ekle / Çek</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aksaklığı gösteren fotoğraflar yetkili kurumun hızla müdahale etmesini sağlar.
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
          {photos.length > 0 ? `${photos.length}/${MAX_PHOTOS} Görsel` : 'İsteğe Bağlı'}
        </span>
      </div>

      {/* Gizli Dosya Girişleri */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
        className="hidden"
        id="gallery-input"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        className="hidden"
        id="camera-input"
      />

      {/* Seçim Seçenekleri */}
      {photos.length === 0 ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 rounded-2xl transition-all ${
            isDragging ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
          }`}
        >
          {/* Galeriden Seç */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Galeriden / Dosyalardan Seç
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Görselleri seçin veya buraya sürükleyin (Maks. 5)
              </p>
            </div>
          </button>

          {/* Kamerayı Aç & Çek */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Kamera ile Fotoğraf Çek
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cihazınızın kamerasıyla anlık fotoğraf çekin
              </p>
            </div>
          </button>
        </div>
      ) : (
        /* Fotoğraflar Listesi ve Ekleme Butonları */
        <div className="space-y-3 pt-1">
          {/* Üst İşlem Butonları */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Yüklenen Fotoğraflar ({photos.length}/{MAX_PHOTOS}):
            </span>

            <div className="flex items-center gap-1.5">
              {photos.length < MAX_PHOTOS && (
                <>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>Fotoğraf Ekle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Çek</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={clearAllPhotos}
                className="px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl font-medium transition-colors cursor-pointer"
                title="Tüm fotoğrafları kaldır"
              >
                Tümünü Sil
              </button>
            </div>
          </div>

          {/* Fotoğraf Izgarası */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xs aspect-square flex flex-col justify-between"
              >
                <img
                  src={photo.previewUrl}
                  alt={`Önizleme ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setPreviewPhoto(photo)}
                />
                
                {/* Karartma katmanı */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Sıra numarası ve Silme butonu */}
                <div className="relative z-10 p-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    #{index + 1}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(photo)}
                      className="p-1 rounded-lg bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer shadow-xs"
                      title="Büyük önizleme"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="p-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-xs active:scale-95"
                      title="Bu fotoğrafı kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dosya adı ve boyutu */}
                <div className="relative z-10 p-2 text-white">
                  <p className="text-[11px] font-semibold truncate leading-tight">
                    {photo.name}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5 font-mono">
                    {photo.sizeFormatted}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* E-posta ek hatırlatması */}
          <p className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 leading-relaxed">
            💡 <strong>Önemli Hatırlatma:</strong> Mail uygulamanız açıldığında çektiğiniz veya seçtiğiniz {photos.length > 1 ? `${photos.length} adet fotoğrafı` : 'fotoğrafı'} e-postanıza <em>ek dosya (ataç / attachment)</em> olarak iliştirmeyi unutmayınız.
          </p>
        </div>
      )}

      {/* Gizlilik Uyarısı */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Kişisel Gizlilik:</strong> Fotoğraflarda üçüncü şahısların yüzlerinin ve araç plakalarının görünmemesine özen gösteriniz.
        </span>
      </div>

      {/* Büyütülmüş Fotoğraf Önizleme Modalı */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl flex flex-col"
          >
            <div className="p-3 bg-slate-900/90 text-white flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-semibold truncate max-w-sm">{previewPhoto.name}</span>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center">
              <img 
                src={previewPhoto.previewUrl} 
                alt="Büyük Önizleme" 
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
