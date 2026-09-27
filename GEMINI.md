# Standart Dağıtım, Sürüm Artırma ve GitHub Release Kuralları

Herhangi bir geliştirme, özellik ekleme veya hata düzeltme işlemi tamamlandıktan sonra sırasıyla şu adımları işlet:

1. **Değişiklik Tespiti ve Özet:**
   - Yapılan tüm değişiklikleri tespit et ve kullanıcıya maddeler halinde kısaca özetle.

2. **Üç Basamaklı Sürüm Artırımı:**
   - Projenin sürümünü minör/yama adımlarıyla 3 basamaklı olarak (`1.1.1`, `1.1.9`, `1.1.10`, `1.2.0` vb.) bir üst basamağa artır.
   - Sürüm bilgisini projede ilgili tüm yapılandırma dosyalarında (`package.json`, mobil projelerde `build.gradle` vb.) eşzamanlı güncelle.

3. **Türkçe Commit ve Push:**
   - Yapılan değişiklikleri özetleyen kısa ve net bir Türkçe commit mesajı yaz.
   - Değişiklikleri commit et, yeni sürüm etiketi (tag) oluştur ve ana çalışma dalına (`main` / `master`) pushla.

4. **Kullanıcı Odaklı GitHub Release:**
   - GitHub Release oluştur ve yayınla.
   - **Önemli:** Sürüm notlarında (release notes) yapılan yenilikleri detaylıca listele; ancak son kullanıcıyı ilgilendirmeyen gereksiz teknik, güvenlik ve gizlilik detaylarına kesinlikle yer verme.

5. **Derleme Çıktısının Eklenmesi:**
   - Projede derleme çıktısı varsa (Android APK, Electron exe, derlenmiş paket vb.) derlemeyi tamamla ve oluşturulan dosyayı GitHub Release varlıklarına (assets) yükle.
