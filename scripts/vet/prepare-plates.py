from PIL import Image, ImageOps, ImageFilter
import numpy as np, os
SRC="full"; OUT="out"; os.makedirs(OUT, exist_ok=True)
# (crop trái, trên, phải, dưới) · san nền · cutoff autocontrast · ngưỡng alpha · lọc đốm
SPEC={
 # Tấm ngựa in trên giấy ố nặng: sau khi san nền vẫn còn đầy đốm mịn. Để nguyên
 # thì lúc chuyển sang nền trong suốt, mỗi đốm thành một chấm sáng lấm tấm khắp
 # ô ảnh. Lọc trung vị xoá đốm lẻ mà giữ nét liền, cộng ngưỡng alpha cao hơn.
 "horse":   ((0.052,0.100,0.958,0.955), True,  (0.2,1.2), 62, True),
 "cat":     ((0.145,0.245,0.870,0.588), False, (0.5,0.5), 30, False),
 "dog":     ((0.015,0.030,0.985,0.930), False, (0.3,0.6), 24, False),
 "cattle":  ((0.020,0.055,0.985,0.920), False, (0.3,0.6), 24, False),
 "pig":     ((0.010,0.020,0.990,0.980), False, (0.3,0.6), 22, False),
 "chicken": ((0.035,0.020,0.965,0.975), False, (0.4,0.8), 34, False),
}
for name,((l,t,r,b),flatten,cut,floor,despeckle) in SPEC.items():
    im=Image.open(f"{SRC}/{name}.jpg"); W,H=im.size
    im=ImageOps.grayscale(im.crop((int(l*W),int(t*H),int(r*W),int(b*H))))
    if im.width>1180: im=im.resize((1180,round(im.height*1180/im.width)), Image.LANCZOS)
    if flatten:
        # Chỉ san nền cho tấm ngựa: giấy ố nặng, vệt nâu là biến thiên tần số
        # thấp nên chia cho bản làm mờ thì bay hết mà nét khắc vẫn còn.
        # KHÔNG dùng cho tấm lợn/mèo: thân con vật ở đó vẽ bằng mảng xám nhạt,
        # cũng là tần số thấp — san nền là ăn mất cả cái bóng thân, chỉ còn xương.
        a=np.asarray(im,dtype=np.float32)
        bg=np.asarray(im.filter(ImageFilter.GaussianBlur(radius=im.width/22)),dtype=np.float32)
        im=Image.fromarray(np.clip(a/np.maximum(bg,1e-3)*235.0,0,255).astype(np.uint8))
    out=ImageOps.autocontrast(im, cutoff=cut)
    if despeckle:
        out=out.filter(ImageFilter.MedianFilter(3))

    # XUẤT PNG NỀN TRONG SUỐT, KHÔNG PHẢI JPEG NỀN GIẤY.
    #
    # Bản đầu để nguyên nền giấy rồi ở theme tối thì đảo màu bằng CSS. Kết quả:
    # ô ảnh thành một hình chữ nhật xám đen KHÁC hẳn nền panel, thấy rõ mép, và
    # mấy vệt ố còn sót bị đảo thành đốm sáng lấm tấm.
    #
    # Cách đúng: mực thành ĐỘ ĐỤC, giấy thành trong suốt. RGB để đen tuyền;
    # theme sáng dùng nguyên (mực đen trên nền kem), theme tối chỉ cần
    # `filter: invert(1)` — invert đổi RGB mà GIỮ alpha, nên mực hoá trắng còn
    # giấy vẫn trong. Hai theme cùng một tệp, không còn mép nào để lộ.
    a=np.asarray(out, dtype=np.float32)
    alpha=255.0-a                      # giấy trắng → 0, mực đen → 255
    # Nền giấy không bao giờ trắng tuyệt đối; dưới ngưỡng này là nhiễu quét và
    # vệt ố, cắt đi thì ô ảnh sạch hẳn thay vì lấm tấm. Ngưỡng đặt riêng từng
    # tấm vì mỗi bản quét một chất giấy.
    alpha=np.where(alpha < floor, 0.0, alpha)
    alpha=np.clip((alpha/255.0) ** 0.85 * 255.0, 0, 255).astype(np.uint8)
    # Mode "LA" chứ không "RGBA": ba kênh màu đều bằng 0 nên chép chúng ba lần
    # là phí — LA chỉ có độ xám + alpha, PNG ra nhẹ hơn hẳn mà hình y hệt.
    la=Image.merge("LA", (Image.new("L", out.size, 0), Image.fromarray(alpha)))
    dst=f"{OUT}/{name}.png"
    la.save(dst, optimize=True)
    print(f"{name:<9} {out.size[0]}x{out.size[1]}  {os.path.getsize(dst)//1024}KB")
