@echo off
setlocal enabledelayedexpansion

set VERSION=1.2.0
if not "%~1"=="" set VERSION=%~1

echo [1/4] Web derlemesi yapiliyor (npm run build)...
call npm run build > nul 2>&1
if errorlevel 1 (
    echo [HATA] Web derlemesi basarisiz oldu.
    exit /b 1
)

echo [2/4] Capacitor Android senkronizasyonu yapiliyor...
call npx cap sync android > nul 2>&1
if errorlevel 1 (
    echo [HATA] Capacitor senkronizasyonu basarisiz oldu.
    exit /b 1
)

echo [3/4] Android APK ve AAB derleniyor...
cd android
call gradlew.bat assembleRelease bundleRelease > nul 2>&1
if errorlevel 1 (
    echo [HATA] Android Gradle derlemesi basarisiz oldu.
    cd ..
    exit /b 1
)
cd ..

if exist "android\app\build\outputs\apk\release\app-release.apk" (
    copy /y "android\app\build\outputs\apk\release\app-release.apk" "KentGozu-v%VERSION%.apk" > nul
    echo [BASARILI] APK: KentGozu-v%VERSION%.apk
) else (
    echo [HATA] APK cikti dosyasi bulunamadi.
    exit /b 1
)

if exist "android\app\build\outputs\bundle\release\app-release.aab" (
    copy /y "android\app\build\outputs\bundle\release\app-release.aab" "KentGozu-v%VERSION%.aab" > nul
    echo [BASARILI] AAB: KentGozu-v%VERSION%.aab
) else (
    echo [HATA] AAB cikti dosyasi bulunamadi.
    exit /b 1
)

echo [TAMAMLANDI] Surum v%VERSION% derleme basarili.
