package dev.rasne.kentgozu;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONException;

@CapacitorPlugin(
    name = "KentGozuNative",
    permissions = {
        @Permission(
            alias = "location",
            strings = {
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            }
        )
    }
)
public class KentGozuNativePlugin extends Plugin {

    private static final long RECENT_LOCATION_MAX_AGE_MS = 120_000L;
    private static final float GOOD_ACCURACY_METERS = 65.0f;

    private boolean hasLocationPermission() {
        Context ctx = getContext();
        if (ctx == null) return false;
        boolean fine = ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean coarse = ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        return fine || coarse || getPermissionState("location") == PermissionState.GRANTED;
    }

    @PluginMethod
    public void getCurrentPosition(PluginCall call) {
        if (!hasLocationPermission()) {
            requestPermissionForAlias("location", call, "locationPermsCallback");
            return;
        }
        resolveLocation(call);
    }

    @PermissionCallback
    private void locationPermsCallback(PluginCall call) {
        if (!hasLocationPermission()) {
            call.reject("Konum izni reddedildi.", "PERMISSION_DENIED");
            return;
        }
        resolveLocation(call);
    }

    @SuppressLint("MissingPermission")
    private void resolveLocation(PluginCall call) {
        Context ctx = getContext();
        if (ctx == null) {
            call.reject("Konum servisine ulaşılamıyor.", "POSITION_UNAVAILABLE");
            return;
        }

        LocationManager locationManager = (LocationManager) ctx.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager == null) {
            call.reject("Konum servisi kullanılamıyor.", "POSITION_UNAVAILABLE");
            return;
        }

        long now = System.currentTimeMillis();
        Location bestLastKnown = pickBetterLocation(
            safeGetLastKnown(locationManager, LocationManager.GPS_PROVIDER),
            safeGetLastKnown(locationManager, LocationManager.NETWORK_PROVIDER)
        );

        if (bestLastKnown != null && (now - bestLastKnown.getTime()) <= RECENT_LOCATION_MAX_AGE_MS && bestLastKnown.getAccuracy() <= GOOD_ACCURACY_METERS) {
            call.resolve(buildLocationResult(bestLastKnown));
            return;
        }

        boolean gpsEnabled = safeIsProviderEnabled(locationManager, LocationManager.GPS_PROVIDER);
        boolean networkEnabled = safeIsProviderEnabled(locationManager, LocationManager.NETWORK_PROVIDER);

        if (!gpsEnabled && !networkEnabled) {
            if (bestLastKnown != null) {
                call.resolve(buildLocationResult(bestLastKnown));
            } else {
                call.reject("Konum servisleri (GPS/Ağ) kapalı.", "POSITION_UNAVAILABLE");
            }
            return;
        }

        int rawTimeout = call.getInt("timeout", 12000);
        final long timeoutMs = Math.max(3000L, Math.min(20000L, rawTimeout));
        final Handler mainHandler = new Handler(Looper.getMainLooper());
        final boolean[] settled = new boolean[] { false };
        final Location fallbackLocation = bestLastKnown;
        final LocationListener[] listenerHolder = new LocationListener[1];

        final Runnable timeoutRunnable = () -> {
            if (settled[0]) return;
            settled[0] = true;
            if (listenerHolder[0] != null) {
                try {
                    locationManager.removeUpdates(listenerHolder[0]);
                } catch (Exception ignored) {}
            }
            if (fallbackLocation != null) {
                call.resolve(buildLocationResult(fallbackLocation));
            } else {
                call.reject("Konum alma isteği zaman aşımına uğradı.", "TIMEOUT");
            }
        };

        listenerHolder[0] = new LocationListener() {
            @Override
            public void onLocationChanged(@NonNull Location location) {
                if (settled[0]) return;
                settled[0] = true;
                mainHandler.removeCallbacks(timeoutRunnable);
                try {
                    locationManager.removeUpdates(this);
                } catch (Exception ignored) {}
                call.resolve(buildLocationResult(location));
            }

            @Deprecated
            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {}

            @Override
            public void onProviderEnabled(@NonNull String provider) {}

            @Override
            public void onProviderDisabled(@NonNull String provider) {}
        };

        mainHandler.post(() -> {
            try {
                if (gpsEnabled) {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0L, 0f, listenerHolder[0], Looper.getMainLooper());
                }
                if (networkEnabled) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0L, 0f, listenerHolder[0], Looper.getMainLooper());
                }
                mainHandler.postDelayed(timeoutRunnable, timeoutMs);
            } catch (Exception ex) {
                if (!settled[0]) {
                    settled[0] = true;
                    mainHandler.removeCallbacks(timeoutRunnable);
                    if (fallbackLocation != null) {
                        call.resolve(buildLocationResult(fallbackLocation));
                    } else {
                        call.reject("Konum bilgisi alınamadı.", "POSITION_UNAVAILABLE", ex);
                    }
                }
            }
        });
    }

    @SuppressLint("MissingPermission")
    private Location safeGetLastKnown(LocationManager lm, String provider) {
        try {
            return lm.getLastKnownLocation(provider);
        } catch (Exception ignored) {
            return null;
        }
    }

    private boolean safeIsProviderEnabled(LocationManager lm, String provider) {
        try {
            return lm.isProviderEnabled(provider);
        } catch (Exception ignored) {
            return false;
        }
    }

    private Location pickBetterLocation(Location a, Location b) {
        if (a == null) return b;
        if (b == null) return a;
        long timeDelta = a.getTime() - b.getTime();
        if (Math.abs(timeDelta) > RECENT_LOCATION_MAX_AGE_MS) {
            return timeDelta > 0 ? a : b;
        }
        return a.getAccuracy() <= b.getAccuracy() ? a : b;
    }

    private JSObject buildLocationResult(Location location) {
        JSObject result = new JSObject();
        result.put("latitude", location.getLatitude());
        result.put("longitude", location.getLongitude());
        result.put("accuracy", location.getAccuracy());
        return result;
    }

    @PluginMethod
    public void composeEmail(PluginCall call) {
        String[] to = toStringArray(call.getArray("to"));
        String[] cc = toStringArray(call.getArray("cc"));
        String subject = call.getString("subject", "");
        String body = call.getString("body", "");

        if (getActivity() == null) {
            call.reject("Uygulama ekranı hazır değil.", "UNAVAILABLE");
            return;
        }

        try {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:"));
            if (to.length > 0) {
                intent.putExtra(Intent.EXTRA_EMAIL, to);
            }
            if (cc.length > 0) {
                intent.putExtra(Intent.EXTRA_CC, cc);
            }
            intent.putExtra(Intent.EXTRA_SUBJECT, subject);
            intent.putExtra(Intent.EXTRA_TEXT, body);

            Intent chooser = Intent.createChooser(intent, "E-Posta Uygulaması Seçin");
            getActivity().startActivity(chooser);
            call.resolve();
        } catch (ActivityNotFoundException ex) {
            call.reject("Cihazda e-posta uygulaması bulunamadı.", "NO_EMAIL_APP", ex);
        } catch (Exception ex) {
            call.reject("E-posta istemcisi açılamadı.", "EMAIL_FAILED", ex);
        }
    }

    @PluginMethod
    public void shareReport(PluginCall call) {
        String title = call.getString("title", "KentGözü Bildirimi");
        String text = call.getString("text", "");

        if (getActivity() == null) {
            call.reject("Uygulama ekranı hazır değil.", "UNAVAILABLE");
            return;
        }

        try {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, title);
            shareIntent.putExtra(Intent.EXTRA_TEXT, text);

            Intent chooser = Intent.createChooser(shareIntent, "Bildirim Taslağını Paylaş");
            getActivity().startActivity(chooser);
            call.resolve();
        } catch (Exception ex) {
            call.reject("Paylaşım ekranı açılamadı.", "SHARE_FAILED", ex);
        }
    }

    private String[] toStringArray(JSArray array) {
        if (array == null) return new String[0];
        List<String> list = new ArrayList<>();
        try {
            List<Object> raw = array.toList();
            for (Object item : raw) {
                if (item != null) {
                    String val = item.toString().trim();
                    if (!val.isEmpty()) {
                        list.add(val);
                    }
                }
            }
        } catch (JSONException ignored) {}
        return list.toArray(new String[0]);
    }
}
