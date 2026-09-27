import React, { useRef, useState } from 'react';
import { Camera, Image, Trash2, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PhotoUploader({ photoData, setPhotoData }) {
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fotoğraf önizleme oluştur
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoData({
        file,
        previewUrl: event.target.result,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) // MB
      });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyPhotoToClipboard = async () => {
    if (!photoData?.file) return;
    try {
      // Destekleyen modern tarayıcılarda panoya kopyalama
      const item = new ClipboardItem({ [photoData.file.type]: photoData.file });
      await navigator.clipboard.write([item]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Panoya kopyalama desteklenmiyor:', err);
      alert('Tarayıcınız doğrudan görsel kopyalamayı desteklemiyor. Lütfen mail uygulamanız açıldığında fotoğrafı galerinizden ek olarak ekleyin.');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-blue-600" />
            3. Fotoğraf Ekle / Çek
          </label>
          <p className="text-xs text-slate-500">
            Sorunun durumunu gösteren net bir fotoğraf yetkili kurumun hızla müdahale etmesini sağlar.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">Opsiyonel / Tavsiye Edilen</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="camera-input"
      />

      {!photoData ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              Fotoğraf Çek veya Galeriden Yükle
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              JPG, PNG veya WebP formatında
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col sm:flex-row items-center gap-4 p-3 text-white">
          <div className="relative w-full sm:w-36 h-36 shrink-0 rounded-lg overflow-hidden bg-black/40">
            <img
              src={photoData.previewUrl}
              alt="Sorun önizlemesi"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2 w-full text-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                  {photoData.name}
                </p>
                <p className="text-xs text-slate-400">{photoData.size} MB</p>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors cursor-pointer"
                title="Fotoğrafı Kaldır"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-amber-200/90 bg-amber-950/60 p-2 rounded-lg border border-amber-800/40">
              💡 <strong>Hatırlatma:</strong> Web tarayıcı güvenlik kuralları gereği mail uygulamanız açıldığında bu fotoğrafı e-postanıza ek dosya olarak iliştirmeyi unutmayınız.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={copyPhotoToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Panoya Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Görseli Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KVKK / Gizlilik uyarısı */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Kişisel Gizlilik:</strong> Fotoğrafta üçüncü şahısların yüzlerinin ve özel araç plakalarının görünmemesine özen gösteriniz.
        </span>
      </div>
    </div>
  );
}
