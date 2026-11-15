import { Capacitor, registerPlugin } from '@capacitor/core';

const KentGozuNative = registerPlugin('KentGozuNative');

function normalizeLocationError(err) {
  const code = err?.code;
  const msg = (err?.message || '').toLowerCase();

  if (code === 'PERMISSION_DENIED' || code === 1 || msg.includes('denied') || msg.includes('izin')) {
    const error = new Error('PERMISSION_DENIED');
    error.code = 'PERMISSION_DENIED';
    return error;
  }
  if (code === 'TIMEOUT' || code === 3 || msg.includes('timeout') || msg.includes('zaman')) {
    const error = new Error('TIMEOUT');
    error.code = 'TIMEOUT';
    return error;
  }
  const error = new Error('POSITION_UNAVAILABLE');
  error.code = 'POSITION_UNAVAILABLE';
  return error;
}

function getWebPosition(timeout = 12000) {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const err = new Error('GEOLOCATION_UNSUPPORTED');
      err.code = 'GEOLOCATION_UNSUPPORTED';
      reject(err);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (geoErr) => {
        reject(normalizeLocationError(geoErr));
      },
      {
        enableHighAccuracy: true,
        timeout,
        maximumAge: 10000
      }
    );
  });
}

/**
 * Native Android ortamında Capacitor eklentisiyle, web ortamında Geolocation API ile konum alır.
 */
export async function getDeviceLocation({ timeout = 12000 } = {}) {
  if (Capacitor.isNativePlatform()) {
    try {
      return await KentGozuNative.getCurrentPosition({ timeout });
    } catch (nativeErr) {
      const normalized = normalizeLocationError(nativeErr);
      if (normalized.code === 'PERMISSION_DENIED') {
        throw normalized;
      }
      // Native sağlayıcı başarısız olursa WebView geolocation yedeğini dene
      try {
        return await getWebPosition(timeout);
      } catch {
        throw normalized;
      }
    }
  }

  return getWebPosition(timeout);
}

/**
 * Native Android ortamında mailto URI uzunluk sınırını aşmayan ACTION_SENDTO intent'i açar;
 * web ortamında veya fallback durumunda standart mailto bağlantısını tetikler.
 */
export async function openNativeOrWebMail({ toList = [], ccList = [], subject = '', body = '', fallbackMailtoUrl = '' }) {
  if (Capacitor.isNativePlatform()) {
    try {
      await KentGozuNative.composeEmail({
        to: toList,
        cc: ccList,
        subject,
        body
      });
      return true;
    } catch {
      // Fallback: mailto URL
    }
  }

  if (fallbackMailtoUrl && typeof window !== 'undefined') {
    window.location.href = fallbackMailtoUrl;
    return true;
  }
  return false;
}

export function canUseSystemShare() {
  if (Capacitor.isNativePlatform()) return true;
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Bildirim taslağını Android sistem paylaşım menüsü veya Web Share API üzerinden paylaşır.
 */
export async function shareReportContent({ title, text }) {
  if (Capacitor.isNativePlatform()) {
    await KentGozuNative.shareReport({ title, text });
    return true;
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    await navigator.share({ title, text });
    return true;
  }

  return false;
}
