# 👁️ KentGözü

> **Vatandaş Odaklı Kentsel Sorun, Yol Bozukluğu ve Aksaklık Bildirim Platformu**  
> *Sivil katılımı artıran, konuma ve yetki alanına göre doğru kamu kurumuna (Karayolları, İBB, İlçe Belediyeleri) otomatik taslak hazırlayan açık kaynaklı web uygulaması.*

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue?style=flat-square&logo=github)](https://rasne-dev.github.io/KentGozu/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

---

## 🚀 Projenin Amacı ve İşleyişi

Vatandaşların sokakta karşılaştığı **yol çukurları, kırık kaldırımlar, açık mazgallar, devrilmiş tabelalar veya yanmayan sokak lambaları** gibi sorunları dakikalar içinde ilgili resmi makamlara iletmesini sağlar.

1. **Sorun Türünü Seç:** Yol çukuru, kaldırım hasarı, mazgal, tabela, aydınlatma direği vb.
2. **Konumunu Belirle:** Tek tıkla GPS koordinatı alınır; OpenStreetMap ile mahalle, cadde ve ilçe otomatik tespit edilir.
3. **Akıllı Yetki Eşleştirme:**
   * **Otoyol / TEM / E-5 (D-100):** ➡️ **Karayolları Genel Müdürlüğü (KGM 1. Bölge)**
   * **Ana Cadde / Bulvar / Meydan:** ➡️ **İstanbul Büyükşehir Belediyesi (İBB Beyaz Masa 153)**
   * **Mahalle İçi / Ara Sokak:** ➡️ **39 İlçe Belediyesi Fen İşleri / Çözüm Merkezi**
   * **Mazgal / Rögar / Su Altyapısı:** ➡️ **İSKİ (185)**
   * **Sokak Lambası / Elektrik:** ➡️ **BEDAŞ (Avrupa) / AYEDAŞ (Anadolu) (186)**
4. **Fotoğraf Ekle:** Akıllı telefon kamerasıyla çekilir veya galeriden seçilir.
5. **E-posta İstemcisine Yönlendirme:** Resmi dilekçe formatında konu, detay, koordinatlar ve harita linkiyle birlikte kullanıcının varsayılan e-posta istemcisine (Gmail, Apple Mail, Outlook) aktarılır. Kullanıcıya yalnızca inceleyip göndermek kalır.

---

## ⚖️ Yasal Dayanak ve KVKK Güvencesi

* **Anayasal Dilekçe Hakkı (Md. 74 & 3071 Sayılı Kanun):** Her vatandaşın idari aksaklıkları yetkili kurumlara şikayet ve ihbar etme hakkı anayasal güvence altındadır. İdareler kanun gereği en geç 30 gün içinde yanıt vermekle yükümlüdür.
* **Sıfır Sunucu Depolaması:** KentGözü merkezi bir sunucuda kullanıcı verisi, e-posta veya fotoğraf **depolamaz**. Her şey istemci (tarayıcı) tarafında gerçekleşir ve kullanıcının kendi e-posta hesabından gönderilir.
* **KVKK Önerisi:** Fotoğraflarda üçüncü kişilerin yüzlerinin ve araç plakalarının görünmemesine özen gösterilmelidir.

---

## 🛠️ Teknoloji Yığını

* **Frontend:** React 19 + Vite 6
* **Stil:** Tailwind CSS v4
* **İkonlar:** Lucide React
* **Coğrafi Kodlama:** HTML5 Geolocation API + OpenStreetMap Nominatim
* **Hosting:** GitHub Pages (Statik Dağıtım & GitHub Actions)

---

## 💻 Yerel Geliştirme (Local Development)

```bash
# Depoyu klonlayın
git clone https://github.com/rasne-dev/KentGozu.git
cd KentGozu

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim derlemesi (Build)
npm run build
```

---

## 📦 GitHub Pages'e Dağıtım

Proje içerisinde `.github/workflows/deploy.yml` dosyası hazırdır. Depoyu GitHub'a yükledikten sonra:
1. GitHub deponuzun **Settings > Pages** sekmesine gidin.
2. **Build and deployment > Source** seçeneğini **GitHub Actions** olarak ayarlayın.
3. Her `main` dalı commit'inde siteniz otomatik olarak `https://rasne-dev.github.io/KentGozu/` adresinde yayına girecektir.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
