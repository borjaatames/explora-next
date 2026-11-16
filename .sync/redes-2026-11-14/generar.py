import os
from PIL import Image, ImageDraw, ImageFont
BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'images', 'actividades')
OUT = os.path.dirname(os.path.abspath(__file__))
FD = os.path.expanduser('~/fonts')
SKY=(14,165,233); AMBER=(245,158,11); WHITE=(255,255,255); SKY100=(224,242,254)

def font(name, size, var):
    f = ImageFont.truetype(os.path.join(FD, name), size)
    try: f.set_variation_by_name(var)
    except Exception: pass
    return f

def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t, font=f) <= maxw: cur=t
        else: lines.append(cur); cur=w
    lines.append(cur); return lines

def pieza(src, out, W, H, cx, kicker, title, sub, cta, credit):
    im = Image.open(os.path.join(BASE, src)).convert('RGB')
    iw, ih = im.size; tw = int(ih*W/H)
    if tw <= iw:
        x0 = max(0, min(iw-tw, int(iw*cx - tw/2))); im = im.crop((x0,0,x0+tw,ih))
    else:
        th = int(iw*H/W); im = im.crop((0,0,iw,th))
    im = im.resize((W,H), Image.LANCZOS)
    g = Image.new('L',(1,H))
    for y in range(H):
        t = max(0,(y-H*0.34)/(H*0.40)); g.putpixel((0,y), int(228*min(1,t)**1.1))
    shade = Image.new('RGB',(W,H),(15,23,42))
    im = Image.composite(shade, im, g.resize((W,H)))
    top = Image.new('L',(1,H))
    for y in range(H): top.putpixel((0,y), int(110*max(0,1-y/(H*0.16))))
    im = Image.composite(shade, im, top.resize((W,H)))
    d = ImageDraw.Draw(im); m=int(W*0.075); s=W/1080
    fb = font('Inter.ttf', int(26*s),'Bold'); txt='EXPLORASPAIN'
    bw = d.textlength(txt,font=fb)+int(36*s); bh=int(52*s)
    d.rounded_rectangle((m,m,m+bw,m+bh), radius=int(8*s), fill=SKY)
    d.text((m+int(18*s), m+bh/2), txt, font=fb, fill=WHITE, anchor='lm')
    fc = font('Inter.ttf', int(19*s),'Regular')
    fcta = font('Inter.ttf', int(32*s),'Bold')
    fsub = font('Inter.ttf', int(36*s),'Regular')
    ft = font('Playfair.ttf', int(84*s),'Bold')
    fk = font('Inter.ttf', int(26*s),'SemiBold')
    y = H-int(46*s)
    d.text((W-m,y), credit, font=fc, fill=(226,232,240), anchor='rs')
    y -= int(52*s)
    cw = d.textlength(cta,font=fcta)+int(56*s); ch=int(76*s)
    d.rounded_rectangle((m,y-ch,m+cw,y), radius=int(10*s), fill=AMBER)
    d.text((m+int(28*s), y-ch/2), cta, font=fcta, fill=WHITE, anchor='lm')
    y -= ch+int(40*s)
    for line in reversed(wrap(d,sub,fsub,W-2*m)):
        d.text((m,y), line, font=fsub, fill=SKY100, anchor='ls'); y -= int(50*s)
    y -= int(22*s)
    for line in reversed(wrap(d,title,ft,W-2*m)):
        d.text((m,y), line, font=ft, fill=WHITE, anchor='ls'); y -= int(96*s)
    y -= int(4*s)
    d.text((m,y), kicker.upper(), font=fk, fill=SKY100, anchor='ls')
    im.save(os.path.join(OUT,out), quality=90)
    print(out, im.size)

IG=(1080,1350); PIN=(1000,1500)
CAD='cadiz/centro/vista-torre-tavira.webp'
SAN='santiago-de-compostela/catedral/obradoiro.webp'
SAL='salamanca/noche/plaza-mayor-noche.webp'
P=[
 (CAD,'ig-cadiz-1080x1350.jpg',*IG,0.5,'One day · Cádiz','Cádiz in one day','The oldest city in Western Europe on foot: cathedral, Roman theatre and sunset at La Caleta.','Link in bio','Foto: SergioRuPi, CC BY-SA 4.0 (Wikimedia)'),
 (CAD,'pin-cadiz-1000x1500.jpg',*PIN,0.5,'One day · Cádiz','Cádiz in one day','The oldest city in Western Europe on foot: cathedral, Roman theatre, camera obscura and sunset at La Caleta.','See the guide on exploraspain.com','Foto: SergioRuPi, CC BY-SA 4.0 (Wikimedia)'),
 (SAN,'ig-santiago-1080x1350.jpg',*IG,0.5,'One day · Galicia','Santiago in one day','Cathedral and Obradoiro, the Mercado de Abastos and sunset in the Alameda. Guided tours from €10.','Link in bio','Foto: slideshow bob, CC BY-SA 2.0 (Wikimedia)'),
 (SAN,'pin-santiago-1000x1500.jpg',*PIN,0.5,'One day · Galicia','Santiago in one day','Cathedral and Obradoiro, the Mercado de Abastos and sunset in the Alameda. Guided tours from €10.','See the guide on exploraspain.com','Foto: slideshow bob, CC BY-SA 2.0 (Wikimedia)'),
 (SAL,'ig-salamanca-1080x1350.jpg',*IG,0.5,'One day · Salamanca','Salamanca in one day','Plaza Mayor, the University and both cathedrals, all on foot. The golden stone lit up at night.','Link in bio','Foto: Tamorlan, CC BY 3.0 (Wikimedia)'),
 (SAL,'pin-salamanca-1000x1500.jpg',*PIN,0.5,'One day · Salamanca','Salamanca in one day','Plaza Mayor, the University and both cathedrals, all on foot. The golden stone lit up at night. Guided tours from €17.','See the guide on exploraspain.com','Foto: Tamorlan, CC BY 3.0 (Wikimedia)'),
]
for p in P: pieza(*p)
