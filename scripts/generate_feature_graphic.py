import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_feature_graphic():
    W, H = 1024, 500
    canvas = Image.new('RGB', (W, H), (15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(canvas)

    # Background subtle radial/linear gradient
    for y in range(H):
        ratio = y / float(H)
        r = int(10 + (2 - 10) * ratio)
        g = int(15 + (6 - 15) * ratio)
        b = int(30 + (23 - 30) * ratio)
        for x in range(W):
            # subtle horizontal shift
            hratio = x / float(W)
            r_val = int(r + 15 * (1 - hratio))
            g_val = int(g + 25 * (1 - hratio))
            b_val = int(b + 55 * (1 - hratio))
            canvas.putpixel((x, y), (r_val, g_val, b_val))

    # Add soft blue glow circle on bottom-left and right
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([ -100, 100, 450, 650 ], fill=(37, 99, 235, 35))
    glow_draw.ellipse([ 600, -100, 1100, 400 ], fill=(30, 58, 138, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    canvas.paste(glow, (0, 0), glow)

    # Fonts
    font_title = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 46)
    font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 20)
    font_bold = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 16)
    font_badge = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 15)

    # Draw App Icon on Left
    icon_path = os.path.join('playstore-assets', 'app-icon-512x512.png')
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert('RGBA')
        # Create rounded mask for the icon preview
        mask = Image.new('L', (80, 80), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, 80, 80], radius=18, fill=255)
        small_icon = icon.resize((80, 80), Image.Resampling.LANCZOS)
        canvas.paste(small_icon, (64, 60), mask)

    draw = ImageDraw.Draw(canvas)
    # Title & Badge
    draw.text((160, 64), "KentGözü", fill=(255, 255, 255), font=font_title)
    
    # "İSTANBUL" pill badge
    badge_bg = (30, 58, 138)
    draw.rounded_rectangle([370, 78, 460, 106], radius=14, fill=badge_bg, outline=(59, 130, 246), width=1)
    draw.text((384, 82), "İSTANBUL", fill=(147, 197, 253), font=font_bold)

    # Subtitle
    draw.text((64, 155), "Kentsel Aksaklık, Çukur ve Yol Sorunlarını", fill=(226, 232, 240), font=font_sub)
    draw.text((64, 185), "Yetkili Resmi Kurumlara Tek Tıkla Bildirin", fill=(147, 197, 253), font=font_sub)

    # Feature List
    features = [
        ("📍", "GPS ve Harita ile Anında Konum Tespiti"),
        ("🏛️", "Akıllı Yetki Eşleştirme (İBB, KGM, 39 İlçe Belediyesi)"),
        ("📄", "Resmi Anayasal Dilekçe Formatında E-Posta Taslağı"),
        ("🛡️", "Sıfır Sunucu Depolaması & Yüksek Veri Gizliliği")
    ]

    y_pos = 245
    for icon_sym, text in features:
        # Checkmark/bullet container
        draw.rounded_rectangle([64, y_pos, 92, y_pos + 28], radius=8, fill=(30, 41, 59))
        draw.text((71, y_pos + 4), icon_sym, fill=(96, 165, 250), font=font_badge)
        draw.text((104, y_pos + 4), text, fill=(203, 213, 225), font=font_badge)
        y_pos += 42

    # Bottom disclaimer note (Play Store policy safe!)
    draw.text((64, 440), "Açık Kaynak Sivil Katılım Aracı • Resmi Kurum Temsili Yoktur", fill=(100, 116, 139), font=font_badge)

    # Right side: Realistic Mobile Phone Mockup showing real app screenshot
    ss_path = os.path.join('playstore-assets', 'screenshot_02_kurum_eslesmesi.png')
    if os.path.exists(ss_path):
        ss = Image.open(ss_path).convert('RGBA')
        
        # Phone dimensions in banner: width 210, height 466
        pw, ph = 210, 466
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
        sh_draw.rounded_rectangle([10, 10, pw + 30, ph + 30], radius=32, fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))

        # Paste phone on canvas
        phone_x = 730
        phone_y = 20
        canvas.paste(shadow, (phone_x - 12, phone_y - 12), shadow)
        canvas.paste(phone_canvas, (phone_x, phone_y), phone_canvas)

    out_file = os.path.join('playstore-assets', 'feature-graphic-1024x500.png')
    canvas.save(out_file, format='PNG')
    print(f"Feature Graphic saved: {out_file} (1024x500)")

    # Normalize screenshot dimensions to exact 1080x2400
    for i in range(1, 5):
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
