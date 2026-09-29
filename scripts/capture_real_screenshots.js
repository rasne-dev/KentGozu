import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const outDir = path.resolve(__dirname, '../playstore-assets');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 8089;
server.listen(PORT, async () => {
  console.log(`Preview server running at http://localhost:${PORT}`);

  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  const screens = [
    {
      name: 'screenshot_01_sorun_bildirimi.png',
      url: `http://localhost:${PORT}/?screenshot=1`
    },
    {
      name: 'screenshot_02_kurum_eslesmesi.png',
      url: `http://localhost:${PORT}/?screenshot=1&mock=1`
    },
    {
      name: 'screenshot_03_kurum_rehberi.png',
      url: `http://localhost:${PORT}/?screenshot=1&tab=directory`
    },
    {
      name: 'screenshot_04_dilekce_onizleme.png',
      url: `http://localhost:${PORT}/?screenshot=1&mock=1&preview=1`
    },
    {
      name: 'screenshot_05_rehber_ve_amac.png',
      url: `http://localhost:${PORT}/?screenshot=1&tour=1`
    }
  ];

  for (const screen of screens) {
    const outFile = path.resolve(outDir, screen.name);
    console.log(`Capturing: ${screen.name}...`);

    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=412,915',
      '--force-device-scale-factor=2.625',
      '--hide-scrollbars',
      '--virtual-time-budget=3000',
      `--screenshot=${outFile}`,
      screen.url
    ];

    const res = spawnSync(edgePath, args, { stdio: 'pipe' });
    if (res.error) {
      console.error(`Error capturing ${screen.name}:`, res.error);
    } else {
      console.log(`Successfully saved: ${screen.name}`);
    }
  }

  console.log('All real in-app screenshots captured successfully!');
  server.close(() => {
    process.exit(0);
  });
});
