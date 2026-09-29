import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_feature_graphic():
    W, H = 1024, 500
    canvas = Image.new('RGB', (W, H), (15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(canvas)

    # Background subtle radial/linear gradient
    for y in range(H):
        ratio = y / float(H)
        r = int(12 + (3 - 12) * ratio)
        g = int(18 + (8 - 18) * ratio)
        b = int(36 + (28 - 36) * ratio)
        for x in range(W):
            hratio = x / float(W)
            r_val = int(r + 14 * (1 - hratio))
            g_val = int(g + 24 * (1 - hratio))
            b_val = int(b + 55 * (1 - hratio))
            canvas.putpixel((x, y), (r_val, g_val, b_val))

    # Add soft blue glow circle on bottom-left and right
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([ -100, 100, 480, 680 ], fill=(37, 99, 235, 40))
    glow_draw.ellipse([ 580, -100, 1150, 420 ], fill=(30, 58, 138, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(65))
    canvas.paste(glow, (0, 0), glow)

    # Fonts
    font_title = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 44)
    font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 19)
    font_sub_bold = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 19)
    font_badge = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 13)
    font_bullet = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 15)
    font_check = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 14)
    font_disclaimer = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 13)

    # Draw App Icon on Left
    icon_path = os.path.join('playstore-assets', 'app-icon-512x512.png')
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert('RGBA')
        mask = Image.new('L', (84, 84), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, 84, 84], radius=20, fill=255)
        small_icon = icon.resize((84, 84), Image.Resampling.LANCZOS)
        canvas.paste(small_icon, (56, 52), mask)

    draw = ImageDraw.Draw(canvas)

    # Title & Dynamic Badge position
    title_text = "KentGözü"
    title_w = int(draw.textlength(title_text, font=font_title))
    draw.text((156, 60), title_text, fill=(255, 255, 255), font=font_title)

    # "İSTANBUL" pill badge
    badge_x1 = 156 + title_w + 14
    badge_w = int(draw.textlength("İSTANBUL", font=font_badge)) + 22
    badge_x2 = badge_x1 + badge_w
    draw.rounded_rectangle([badge_x1, 74, badge_x2, 102], radius=14, fill=(30, 58, 138), outline=(59, 130, 246), width=1)
    draw.text((badge_x1 + 11, 78), "İSTANBUL", fill=(147, 197, 253), font=font_badge)

    # Subtitle
    draw.text((56, 150), "Kentsel Aksaklık, Çukur ve Yol Sorunlarını", fill=(241, 245, 249), font=font_sub_bold)
    draw.text((56, 178), "Yetkili Resmi Kurumlara Tek Tıkla Bildirin", fill=(147, 197, 253), font=font_sub)

    # Feature List
    features = [
        "Belediye İletişim Bilgisi Arama Zahmetine Son",
        "Akıllı Yetki Eşleştirme (İBB, 39 İlçe Belediyesi, İSKİ)",
        "Tek Tıkla Hazır Resmi E-Posta & Dilekçe Taslağı",
        "Resmi Kayıt Altına Alma & Sıfır Sunucu Depolaması"
    ]

    y_pos = 232
    for text in features:
        # Checkmark container and vector checkmark
        draw.rounded_rectangle([56, y_pos, 82, y_pos + 26], radius=7, fill=(37, 99, 235))
        draw.line([(63, y_pos + 13), (69, y_pos + 19)], fill=(255, 255, 255), width=2)
        draw.line([(69, y_pos + 19), (76, y_pos + 7)], fill=(255, 255, 255), width=2)
        draw.text((94, y_pos + 3), text, fill=(226, 232, 240), font=font_bullet)
        y_pos += 42

    # Bottom disclaimer note (Play Store policy safe!)
    draw.text((56, 442), "Açık Kaynak Sivil Katılım Aracı • Anayasa Md. 74 Dilekçe Hakkı Kapsamında", fill=(148, 163, 184), font=font_disclaimer)

    # Right side: Realistic Mobile Phone Mockup showing clean real app screenshot
    ss_path = os.path.join('playstore-assets', 'screenshot_01_sorun_bildirimi.png')
    if os.path.exists(ss_path):
        ss = Image.open(ss_path).convert('RGBA')
        
        pw, ph = 214, 464
        ss_resized = ss.resize((pw, ph), Image.Resampling.LANCZOS)

        # Phone frame with rounded corners
        phone_canvas = Image.new('RGBA', (pw + 16, ph + 16), (0, 0, 0, 0))
        pdraw = ImageDraw.Draw(phone_canvas)
        
        # Outer bezel
        pdraw.rounded_rectangle([0, 0, pw + 15, ph + 15], radius=28, fill=(30, 41, 59), outline=(71, 85, 105), width=2)
        
        # Screen mask
        screen_mask = Image.new('L', (pw, ph), 0)
        smdraw = ImageDraw.Draw(screen_mask)
        smdraw.rounded_rectangle([0, 0, pw, ph], radius=22, fill=255)
        
        phone_canvas.paste(ss_resized, (8, 8), screen_mask)
        
        # Soft shadow behind phone
        shadow = Image.new('RGBA', (pw + 40, ph + 40), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.rounded_rectangle([10, 10, pw + 30, ph + 30], radius=32, fill=(0, 0, 0, 130))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))

        phone_x = 734
        phone_y = 18
        canvas.paste(shadow, (phone_x - 12, phone_y - 12), shadow)
        canvas.paste(phone_canvas, (phone_x, phone_y), phone_canvas)

    out_file = os.path.join('playstore-assets', 'feature-graphic-1024x500.png')
    canvas.save(out_file, format='PNG')
    print(f"Feature Graphic saved: {out_file} (1024x500)")

    # Normalize all screenshot dimensions to exact 1080x2400
    for i in range(1, 6):
        s_name = [f for f in os.listdir('playstore-assets') if f.startswith(f"screenshot_0{i}")]
        if s_name:
            sp = os.path.join('playstore-assets', s_name[0])
            simg = Image.open(sp)
            if simg.size != (1080, 2400):
                simg = simg.resize((1080, 2400), Image.Resampling.LANCZOS)
                simg.save(sp)
                print(f"Resized {s_name[0]} to exact 1080x2400")

if __name__ == '__main__':
    create_feature_graphic()
