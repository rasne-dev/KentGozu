import React, { useRef } from 'react';
import { Camera, Images, Trash2, X, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PhotoUploader({ photos = [], setPhotos }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const MAX_PHOTOS = 5;

  const processFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      alert(`En fazla ${MAX_PHOTOS} adet fotoğraf ekleyebilirsiniz.`);
      return;
    }

    const filesToProcess = Array.from(fileList).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      // Sadece resim dosyalarını kabul et
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            previewUrl: event.target.result,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2)
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
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
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const clearAllPhotos = () => {
    setPhotos([]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>3. Fotoğraf Ekle / Çek</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sorunun durumunu gösteren net fotoğraflar yetkili kurumun hızla müdahale etmesini sağlar.
          </p>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
          {photos.length > 0 ? `${photos.length}/${MAX_PHOTOS} Görsel` : 'Opsiyonel'}
        </span>
      </div>

      {/* Gizli Inputlar: Biri Galeriden Çoklu Seçim, Diğeri Doğrudan Kamera */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 1. Seçenek: Galeriden Seç (1 veya Daha Fazla) */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Images className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Galeriden / Dosyalardan Seç
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tek veya çoklu görsel seçebilirsiniz (Maks. 5)
              </p>
            </div>
          </button>

          {/* 2. Seçenek: Kamerayı Aç & Çek */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Kamera ile Fotoğraf Çek
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Anlık olarak olay yerinin fotoğrafını çekin
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
              Yüklenen Görseller ({photos.length}/{MAX_PHOTOS}):
            </span>

            <div className="flex items-center gap-1.5">
              {photos.length < MAX_PHOTOS && (
                <>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>Galeriden Ekle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Fotoğraf Çek</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={clearAllPhotos}
                className="px-2 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl font-medium transition-colors cursor-pointer"
                title="Tüm fotoğrafları kaldır"
              >
                Tümünü Sil
              </button>
            </div>
          </div>

          {/* Fotoğraf Izgarası */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xs aspect-square flex flex-col justify-between"
              >
                <img
                  src={photo.previewUrl}
                  alt={`Önizleme ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Karartma katmanı */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Sıra numarası ve Silme butonu */}
                <div className="relative z-10 p-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="p-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-xs active:scale-95"
                    title="Bu fotoğrafı kaldır"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dosya adı ve boyutu */}
                <div className="relative z-10 p-2 text-white">
                  <p className="text-[11px] font-semibold truncate leading-tight">
                    {photo.name}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {photo.size} MB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* E-posta ek hatırlatması */}
          <p className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 leading-relaxed">
            💡 <strong>Hatırlatma:</strong> Mail uygulamanız açıldığında seçtiğiniz {photos.length > 1 ? `${photos.length} adet görseli` : 'görseli'} e-postanıza <em>ek dosya (ataç / attachment)</em> olarak iliştirmeyi unutmayınız.
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
    </div>
  );
}
