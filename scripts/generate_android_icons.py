import os
from PIL import Image, ImageDraw

def eval_bezier(p0, p1, p2, p3, steps=60):
    pts = []
    for i in range(steps + 1):
        t = i / float(steps)
        x = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
        y = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts

def get_lucide_eye_data(scale, translate):
    top1 = eval_bezier((2, 12), (5, 5), (12, 5), (12, 5))
    top2 = eval_bezier((12, 5), (19, 5), (22, 12), (22, 12))
    bot1 = eval_bezier((22, 12), (19, 19), (12, 19), (12, 19))
    bot2 = eval_bezier((12, 19), (5, 19), (2, 12), (2, 12))

    lid_points = top1 + top2[1:] + bot1[1:] + bot2[1:]
    tx, ty = translate
    transformed = [(x * scale + tx, y * scale + ty) for x, y in lid_points]
    circle_center = (12 * scale + tx, 12 * scale + ty)
    circle_r = 3.2 * scale
    return transformed, circle_center, circle_r

def draw_eye_on_canvas(draw, scale, translate, stroke_width, color):
    pts, center, r = get_lucide_eye_data(scale, translate)
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i+1]], fill=color, width=stroke_width)
    draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], fill=color)

def generate_launcher_icon(target_size, shape='rounded_rect'):
    # Supersample 4x for extreme smoothness
    FACTOR = 4
    SS = target_size * FACTOR
    img = Image.new('RGBA', (SS, SS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    blue = (37, 99, 235, 255) # #2563EB

    if shape == 'circle':
        draw.ellipse([0, 0, SS, SS], fill=blue)
    elif shape == 'rounded_rect':
        radius = int(SS * 0.22)
        draw.rounded_rectangle([0, 0, SS, SS], radius=radius, fill=blue)

    # Eye dimensions (fits in central 62% of the icon)
    eye_grid_size = SS * 0.62
    scale = eye_grid_size / 24.0
    tx = (SS - 24 * scale) / 2.0
    ty = (SS - 24 * scale) / 2.0
    stroke_w = int(2.4 * scale)

    white = (255, 255, 255, 255)
    draw_eye_on_canvas(draw, scale, (tx, ty), stroke_w, white)

    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def generate_foreground_icon(target_size):
    # Adaptive icon foreground (108dp base). Safe zone is central 66dp (~60%)
    FACTOR = 4
    SS = target_size * FACTOR
    img = Image.new('RGBA', (SS, SS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    eye_grid_size = SS * 0.50
    scale = eye_grid_size / 24.0
    tx = (SS - 24 * scale) / 2.0
    ty = (SS - 24 * scale) / 2.0
    stroke_w = int(2.5 * scale)

    white = (255, 255, 255, 255)
    draw_eye_on_canvas(draw, scale, (tx, ty), stroke_w, white)

    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def main():
    res_base = os.path.join('android', 'app', 'src', 'main', 'res')
    
    densities = {
        'mipmap-mdpi': {'launcher': 48, 'foreground': 108},
        'mipmap-hdpi': {'launcher': 72, 'foreground': 162},
        'mipmap-xhdpi': {'launcher': 96, 'foreground': 216},
        'mipmap-xxhdpi': {'launcher': 144, 'foreground': 324},
        'mipmap-xxxhdpi': {'launcher': 192, 'foreground': 432}
    }

    for folder, sizes in densities.items():
        dir_path = os.path.join(res_base, folder)
        os.makedirs(dir_path, exist_ok=True)

        l_size = sizes['launcher']
        fg_size = sizes['foreground']

        # 1. ic_launcher.png (rounded rect)
        icon = generate_launcher_icon(l_size, shape='rounded_rect')
        icon.save(os.path.join(dir_path, 'ic_launcher.png'))

        # 2. ic_launcher_round.png (circle)
        icon_round = generate_launcher_icon(l_size, shape='circle')
        icon_round.save(os.path.join(dir_path, 'ic_launcher_round.png'))

        # 3. ic_launcher_foreground.png (adaptive foreground)
        icon_fg = generate_foreground_icon(fg_size)
        icon_fg.save(os.path.join(dir_path, 'ic_launcher_foreground.png'))

        print(f"Generated icons for {folder}: launcher={l_size}px, fg={fg_size}px")

    # Update ic_launcher_background.xml to #2563EB
    bg_xml_path = os.path.join(res_base, 'values', 'ic_launcher_background.xml')
    with open(bg_xml_path, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#2563EB</color>\n</resources>\n')

    # Also update drawable/ic_launcher_background.xml
    draw_bg_xml = os.path.join(res_base, 'drawable', 'ic_launcher_background.xml')
    if os.path.exists(draw_bg_xml):
        with open(draw_bg_xml, 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="utf-8"?>\n<vector xmlns:android="http://schemas.android.com/apk/res/android"\n    android:width="108dp"\n    android:height="108dp"\n    android:viewportWidth="108"\n    android:viewportHeight="108">\n    <path\n        android:fillColor="#2563EB"\n        android:pathData="M0,0h108v108h-108z"/>\n</vector>\n')

    print("All icons and background colors generated successfully!")

if __name__ == '__main__':
    main()
