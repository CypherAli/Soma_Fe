from PIL import Image, ImageOps, ImageFilter
import numpy as np, os
SRC="full"; OUT="out"; os.makedirs(OUT, exist_ok=True)
# (crop trái, trên, phải, dưới) · san nền · cutoff autocontrast
SPEC={
 "horse":   ((0.052,0.100,0.958,0.955), True,  (0.2,1.2)),
 "cat":     ((0.145,0.245,0.870,0.588), False, (0.5,0.5)),
 "dog":     ((0.015,0.030,0.985,0.930), False, (0.3,0.6)),
 "cattle":  ((0.020,0.055,0.985,0.920), False, (0.3,0.6)),
 "pig":     ((0.010,0.020,0.990,0.980), False, (0.3,0.6)),
 "chicken": ((0.035,0.020,0.965,0.975), False, (0.4,0.8)),
}
for name,((l,t,r,b),flatten,cut) in SPEC.items():
    im=Image.open(f"{SRC}/{name}.jpg"); W,H=im.size
    im=ImageOps.grayscale(im.crop((int(l*W),int(t*H),int(r*W),int(b*H))))
    if im.width>1500: im=im.resize((1500,round(im.height*1500/im.width)), Image.LANCZOS)
    if flatten:
        # Chỉ san nền cho tấm ngựa: giấy ố nặng, vệt nâu là biến thiên tần số
        # thấp nên chia cho bản làm mờ thì bay hết mà nét khắc vẫn còn.
        # KHÔNG dùng cho tấm lợn/mèo: thân con vật ở đó vẽ bằng mảng xám nhạt,
        # cũng là tần số thấp — san nền là ăn mất cả cái bóng thân, chỉ còn xương.
        a=np.asarray(im,dtype=np.float32)
        bg=np.asarray(im.filter(ImageFilter.GaussianBlur(radius=im.width/22)),dtype=np.float32)
        im=Image.fromarray(np.clip(a/np.maximum(bg,1e-3)*235.0,0,255).astype(np.uint8))
    out=ImageOps.autocontrast(im, cutoff=cut)
    out.save(f"{OUT}/{name}.jpg", quality=86, optimize=True, progressive=True)
    print(f"{name:<9} {out.size[0]}x{out.size[1]}  {os.path.getsize(f'{OUT}/{name}.jpg')//1024}KB")
