$server = Start-Process -FilePath "node" -ArgumentList "scripts/static_server.js" -PassThru
Start-Sleep -Seconds 2

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\Ensar\Desktop\PROJELER\KentGozu\playstore-assets"

$targets = @(
    @{ name = "screenshot_01_sorun_bildirimi.png"; url = "http://localhost:8089/" },
    @{ name = "screenshot_02_kurum_eslesmesi.png"; url = "http://localhost:8089/?mock=1" },
    @{ name = "screenshot_03_kurum_rehberi.png"; url = "http://localhost:8089/?tab=directory" },
    @{ name = "screenshot_04_dilekce_onizleme.png"; url = "http://localhost:8089/?mock=1&preview=1" }
)

foreach ($t in $targets) {
    $outFile = "$outDir\$($t.name)"
    Write-Host "Capturing $($t.name)..."
    $arg = "--headless=new --disable-gpu --no-first-run --no-default-browser-check --window-size=412,915 --force-device-scale-factor=2.625 --hide-scrollbars --virtual-time-budget=2000 --screenshot=`"$outFile`" `"$($t.url)`""
    Start-Process -FilePath $edge -ArgumentList $arg -Wait
    Write-Host "Done $($t.name)"
}

Stop-Process -Id $server.Id -Force
Write-Host "All screenshots captured successfully!"
