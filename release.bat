@echo off
setlocal

set "LOG_FILE=%TEMP%\kentgozu_release_build.log"
if exist "%LOG_FILE%" del /f /q "%LOG_FILE%" > nul 2>&1

echo [0/4] Surum artiriliyor ve yapilandirma dosyalari senkronize ediliyor...
set "VERSION="
for /f "usebackq delims=" %%v in (`node -e "const fs=require('fs');const arg=(process.argv[1]||'').trim();const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));let v=arg;if(!v){const parts=pkg.version.split('.').map(Number);if(parts.length!==3||parts.some(Number.isNaN))process.exit(1);let [a,b,c]=parts;c+=1;if(c===10){c=0;b+=1;}if(b===10){b=0;a+=1;}v=[a,b,c].join('.');}if(!/^\d+\.\d+\.\d+$/.test(v))process.exit(1);pkg.version=v;fs.writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');let gradle=fs.readFileSync('android/app/build.gradle','utf8');gradle=gradle.replace(/versionCode\s+(\d+)/,(m,n)=>'versionCode '+(Number(n)+1)).replace(/versionName\s+\x22[^\x22]+\x22/,'versionName \x22'+v+'\x22');fs.writeFileSync('android/app/build.gradle',gradle);console.log(v);" "%~1"`) do set "VERSION=%%v"

if "%VERSION%"=="" (
    echo [HATA] Surum guncelleme veya senkronizasyon basarisiz oldu.
    exit /b 1
)
echo       Yeni surum: v%VERSION%

echo [1/4] Web derlemesi yapiliyor (npm run build)...
call npm run build > "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo [HATA] Web derlemesi basarisiz oldu. Son log satirlari:
    powershell -NoProfile -Command "Get-Content '%LOG_FILE%' -Tail 20"
    exit /b 1
)

echo [2/4] Capacitor Android senkronizasyonu yapiliyor...
call npx cap sync android >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo [HATA] Capacitor senkronizasyonu basarisiz oldu. Son log satirlari:
    powershell -NoProfile -Command "Get-Content '%LOG_FILE%' -Tail 20"
    exit /b 1
)

echo [3/4] Android APK ve AAB derleniyor...
pushd android
call gradlew.bat assembleRelease bundleRelease >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    popd
    echo [HATA] Android Gradle derlemesi basarisiz oldu. Son log satirlari:
    powershell -NoProfile -Command "Get-Content '%LOG_FILE%' -Tail 25"
    exit /b 1
)
popd

echo [4/4] Cikti dosyalari hazirlaniyor...
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

if exist "%LOG_FILE%" del /f /q "%LOG_FILE%" > nul 2>&1
echo [TAMAMLANDI] Surum v%VERSION% derleme basarili.
