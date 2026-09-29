import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def generate_screenshots_16_9():
    W, H = 1920, 1080 # 16:9 Google Play Store Standard
    out_dir = 'playstore-assets'
    os.makedirs(out_dir, exist_ok=True)

    # Fonts
    font_badge = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 18)
    font_title = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 46)
    font_desc = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 23)
    font_bullet = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 20)
    font_bullet_sub = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 17)
    font_footer = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 15)

    screens_config = [
        {
            "filename": "screenshot_01_sorun_bildirimi.png",
            "source_raw": "raw_01.png",
            "badge": "KENTSEL BİLDİRİM & GÖZLEM",
            "title": "Sokağınızdaki Çukurları ve\nArızaları Kolayca Bildirin",
            "desc": "Şehrinizdeki hasarları sahipsiz bırakmayın. Fotoğrafı ekleyin,\nkonumunuzu belirleyin ve resmi başvuru sürecini başlatın.",
            "bullets": [
                ("16 Farklı Kentsel Aksaklık Kategorisi", "Çukur, kaldırım, aydınlatma, su patlağı, mazgal ve daha fazlası"),
                ("GPS ve Harita ile Nokta Atışı Konum", "Bulunduğunuz sokağı haritadan seçin veya GPS ile anında tespit edin"),
                ("Fotoğraflı Kanıt & Hızlı Bildirim", "Kamera veya galerinizden hasar fotoğrafı ekleyerek süreci hızlandırın")
            ]
        },
        {
            "filename": "screenshot_02_kurum_eslesmesi.png",
            "source_raw": "raw_02.png",
            "badge": "AKILLI YETKİLİ EŞLEŞTİRME",
            "title": "Belediye İletişim Bilgisi\nArama Zahmetine Son",
            "desc": "Hangi sokağın hangi kuruma bağlı olduğunu düşünmeyin.\nKentGözü, doğru kamu kurumunu sizin yerinize anında bulur.",
            "bullets": [
                ("39 İlçe Belediyesi Entegrasyonu", "Ara sokak, park ve ilçe yetki alanındaki tüm sorunlar için"),
                ("İBB Çözüm Merkezi Otomatik Eşleşmesi", "Ana arterler, bulvarlar, caddeler ve meydanlar için doğrudan İBB"),
                ("Altyapı Kurumları (İSKİ, BEDAŞ, KGM)", "Su, elektrik ve otoyol arızaları ilgili kuruma tek tıkla yönlendirilir")
            ]
        },
        {
            "filename": "screenshot_03_kurum_rehberi.png",
            "source_raw": "raw_03.png",
            "badge": "İSTANBUL KURUM REHBERİ",
            "title": "Tüm Belediyeler ve Kurumlar\nTek Bir Rehberde",
            "desc": "İstanbul'un 39 ilçesi ve tüm kamu idarelerinin güncel kurumsal\ne-posta, santral ve WhatsApp hatlarına dilediğiniz an ulaşın.",
            "bullets": [
                ("39 İlçe Belediyesi Resmi Kanalları", "Tüm ilçe belediyelerinin resmi iletişim adresleri elinizin altında"),
                ("Büyükşehir ve Bölge Müdürlükleri", "İBB, Karayolları 1. Bölge, İSKİ, BEDAŞ ve AYEDAŞ kurumsal hatları"),
                ("Tek Dokunuşla İletişim", "Rehberden doğrudan e-posta gönderin veya tek tıkla arayın")
            ]
        },
        {
            "filename": "screenshot_04_dilekce_onizleme.png",
            "source_raw": "raw_04.png",
            "badge": "RESMİ DİLEKÇE & KAYIT",
            "title": "Tek Tıkla Hazır Resmi\nE-Posta ve Dilekçe Taslağı",
            "desc": "Karmaşık dilekçe formatlarıyla uğraşmanıza gerek yok. Mevzuata\nuygun başvuru taslağınız tek dokunuşla e-postanıza aktarılır.",
            "bullets": [
                ("Anayasa Md. 74 ve 3071 Sayılı Kanun", "Dilekçe hakkı güvencesiyle hazırlanan kurumsal resmi şablon"),
                ("Resmi Kurumsal Kayıt Altına Alma", "Doğrudan kurumsal e-postaya iletilir, sahipsiz kalması önlenir"),
                ("30 Günlük Yasal Cevap Takibi", "Kamu kurumlarının yasal yanıt süresi güvencesiyle şeffaf süreç")
            ]
        },
        {
            "filename": "screenshot_05_kullanim_rehberi.png",
            "source_raw": "raw_05.png",
            "badge": "REHBER TURU & GİZLİLİK",
            "title": "Verileriniz Güvende,\nSüreç Tamamen Şeffaf",
            "desc": "KentGözü'nün amacını ve işleyişini anlatan interaktif rehber\nile uygulamayı saniyeler içinde öğrenin.",
            "bullets": [
                ("Sıfır Sunucu Depolaması & KVKK", "Fotoğraflarınız veya verileriniz hiçbir merkezi sunucuda saklanmaz"),
                ("Doğrudan Cihazınızdan Gönderim", "Başvuru tamamen kendi kişisel e-posta hesabınızdan iletilir"),
                ("İnteraktif Kullanım Rehberi (Nasıl Çalışır?)", "Uygulama amacını ve adımlarını dilediğiniz zaman tekrar inceleyin")
            ]
        }
    ]

    for idx, cfg in enumerate(screens_config):
        print(f"Generating 16:9 screenshot: {cfg['filename']}...")
        canvas = Image.new('RGB', (W, H), (15, 23, 42)) # Deep Slate 900
        draw = ImageDraw.Draw(canvas)

        # Background gradient
        for y in range(H):
            ratio = y / float(H)
            r = int(12 + (3 - 12) * ratio)
            g = int(18 + (7 - 18) * ratio)
            b = int(38 + (28 - 38) * ratio)
            for x in range(0, W, 4): # step 4 for fast fill
                hratio = x / float(W)
                r_val = int(r + 14 * (1 - hratio))
                g_val = int(g + 22 * (1 - hratio))
                b_val = int(b + 55 * (1 - hratio))
                for dx in range(4):
                    if x + dx < W:
                        canvas.putpixel((x + dx, y), (r_val, g_val, b_val))

        # Soft atmospheric glow
        glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        glow_draw.ellipse([ -150, 100, 700, 950 ], fill=(37, 99, 235, 38))
        glow_draw.ellipse([ 1100, -150, 2050, 800 ], fill=(30, 58, 138, 45))
        glow = glow.filter(ImageFilter.GaussianBlur(80))
        canvas.paste(glow, (0, 0), glow)

        draw = ImageDraw.Draw(canvas)

        # Left Column Layout
        left_x = 110

        # Pill Badge
        badge_text = cfg["badge"]
        badge_w = int(draw.textlength(badge_text, font=font_badge)) + 28
        draw.rounded_rectangle([left_x, 110, left_x + badge_w, 146], radius=18, fill=(30, 58, 138), outline=(59, 130, 246), width=1)
        draw.text((left_x + 14, 117), badge_text, fill=(147, 197, 253), font=font_badge)

        # Title (multi-line supported)
        y_cursor = 175
        for line in cfg["title"].split('\n'):
            draw.text((left_x, y_cursor), line, fill=(255, 255, 255), font=font_title)
            y_cursor += 62

        # Description
        y_cursor += 15
        for line in cfg["desc"].split('\n'):
            draw.text((left_x, y_cursor), line, fill=(203, 213, 225), font=font_desc)
            y_cursor += 36

        # Bullet Cards
        y_cursor += 30
        for title_b, sub_b in cfg["bullets"]:
            card_h = 76
            draw.rounded_rectangle([left_x, y_cursor, left_x + 860, y_cursor + card_h], radius=16, fill=(24, 34, 53), outline=(45, 60, 88), width=1)
            
            # Checkmark pill
            draw.rounded_rectangle([left_x + 16, y_cursor + 18, left_x + 54, y_cursor + 56], radius=10, fill=(37, 99, 235))
            draw.line([(left_x + 25, y_cursor + 37), (left_x + 33, y_cursor + 45)], fill=(255, 255, 255), width=3)
            draw.line([(left_x + 33, y_cursor + 45), (left_x + 45, y_cursor + 27)], fill=(255, 255, 255), width=3)

            # Bullet texts
            draw.text((left_x + 72, y_cursor + 13), title_b, fill=(255, 255, 255), font=font_bullet)
            draw.text((left_x + 72, y_cursor + 42), sub_b, fill=(148, 163, 184), font=font_bullet_sub)

            y_cursor += card_h + 16

        # Footer note
        draw.text((left_x, 990), "KentGözü • Açık Kaynak Sivil Katılım & Kentsel Bildirim Platformu", fill=(100, 116, 139), font=font_footer)

        # Right Column Layout: Realistic Phone Mockup
        raw_path = os.path.join(out_dir, cfg["source_raw"])
        if os.path.exists(raw_path):
            raw_img = Image.open(raw_path).convert('RGBA')

            phone_w, phone_h = 420, 933
            screen_resized = raw_img.resize((phone_w, phone_h), Image.Resampling.LANCZOS)

            bezel_canvas = Image.new('RGBA', (phone_w + 24, phone_h + 24), (0, 0, 0, 0))
            bdraw = ImageDraw.Draw(bezel_canvas)

            # Titanium / Slate phone frame
            bdraw.rounded_rectangle([0, 0, phone_w + 23, phone_h + 23], radius=44, fill=(30, 41, 59), outline=(71, 85, 105), width=3)

            # Screen mask
            screen_mask = Image.new('L', (phone_w, phone_h), 0)
            smdraw = ImageDraw.Draw(screen_mask)
            smdraw.rounded_rectangle([0, 0, phone_w, phone_h], radius=34, fill=255)

            bezel_canvas.paste(screen_resized, (12, 12), screen_mask)

            # Deep Realistic Drop Shadow
            shadow = Image.new('RGBA', (phone_w + 80, phone_h + 80), (0, 0, 0, 0))
            sh_draw = ImageDraw.Draw(shadow)
            sh_draw.rounded_rectangle([20, 20, phone_w + 60, phone_h + 60], radius=52, fill=(0, 0, 0, 160))
            shadow = shadow.filter(ImageFilter.GaussianBlur(24))

            phone_pos_x = 1260
            phone_pos_y = 65

            canvas.paste(shadow, (phone_pos_x - 20, phone_pos_y - 20), shadow)
            canvas.paste(bezel_canvas, (phone_pos_x, phone_pos_y), bezel_canvas)

        target_file = os.path.join(out_dir, cfg["filename"])
        canvas.save(target_file, format='PNG')
        print(f"Saved: {target_file} (1920x1080)")

    print("All 5 16:9 Google Play Store screenshots generated successfully!")

if __name__ == '__main__':
    generate_screenshots_16_9()
