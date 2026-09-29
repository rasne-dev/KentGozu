import os
from PIL import Image, ImageDraw, ImageFont

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

def generate_play_store_icon(target_size=512):
    FACTOR = 4
    SS = target_size * FACTOR
    img = Image.new('RGB', (SS, SS), (37, 99, 235)) # #2563EB solid primary blue for full-bleed Play Store icon
    
    # Add subtle modern vertical gradient to top-right (blue-600 to indigo-600 #4f46e5)
    for y in range(SS):
        ratio = y / float(SS)
        r = int(37 + (30 - 37) * ratio)
        g = int(99 + (58 - 99) * ratio)
        b = int(235 + (210 - 235) * ratio)
        for x in range(0, SS, 4):
            img.putpixel((x, y), (r, g, b))
    # Quick blur/smooth
    img = img.resize((SS // 4, SS // 4), Image.Resampling.BILINEAR).resize((SS, SS), Image.Resampling.BICUBIC)
    
    draw = ImageDraw.Draw(img)

    # Eye safe zone (centered in middle 60% of icon)
    eye_grid_size = SS * 0.58
    scale = eye_grid_size / 24.0
    tx = (SS - 24 * scale) / 2.0
    ty = (SS - 24 * scale) / 2.0
    stroke_w = int(2.4 * scale)

    white = (255, 255, 255)
    draw_eye_on_canvas(draw, scale, (tx, ty), stroke_w, white)

    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def main():
    out_dir = os.path.join(os.getcwd(), 'playstore-assets')
    os.makedirs(out_dir, exist_ok=True)
    
    # 512x512 Google Play Icon
    icon = generate_play_store_icon(512)
    icon_path = os.path.join(out_dir, 'app-icon-512x512.png')
    icon.save(icon_path, format='PNG')
    print(f"Play Store Icon saved: {icon_path} (512x512)")

if __name__ == '__main__':
    main()
