# Genera las piezas de redes de la semana 9-15 nov 2026 (Pillow).
import os
from PIL import Image, ImageDraw, ImageFont
BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'images', 'actividades')
OUT = os.path.dirname(os.path.abspath(__file__))
FD = os.path.expanduser('~/fonts')
SKY = (14,165,233); AMBER=(245,158,11); WHITE=(255,255,255); SKY100=(224,242,254)

def font(name, size, var):
    f = ImageFont.truetype(os.path.join(FD, name), size)
    try: f.set_variation_by_name(var)
    except Exception: pass
    return f

def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur+' '+w).strip()
        if d.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines

def pieza(src, out, W, H, cx, kicker, title, sub, cta, credit):
    im = Image.open(os.path.join(BASE, src)).convert('RGB')
    iw, ih = im.size; tw = int(ih*W/H)
    x0 = max(0, min(iw-tw, int(iw*cx - tw/2)))
    im = im.crop((x0, 0, x0+tw, ih)).resize((W, H), Image.LANCZOS)
    # degradado inferior sobrio
    g = Image.new('L', (1, H))
    for y in range(H):
        t = max(0, (y - H*0.34)/(H*0.40)); g.putpixel((0,y), int(228*min(1,t)**1.1))
    shade = Image.new('RGB', (W,H), (15,23,42))
    im = Image.composite(shade, im, g.resize((W,H)))
    top = Image.new('L', (1,H))
    for y in range(H): top.putpixel((0,y), int(110*max(0,1-y/(H*0.16))))
    im = Image.composite(shade, im, top.resize((W,H)))
    d = ImageDraw.Draw(im); m = int(W*0.075); s = W/1080
    # marca
    fb = font('Inter.ttf', int(26*s), 'Bold'); txt='EXPLORASPAIN'
    bw = d.textlength(txt, font=fb)+int(36*s); bh=int(52*s)
    d.rounded_rectangle((m, m, m+bw, m+bh), radius=int(8*s), fill=SKY)
    d.text((m+int(18*s), m+bh/2), txt, font=fb, fill=WHITE, anchor='lm')
    # bloque inferior (de abajo arriba)
    fc = font('Inter.ttf', int(19*s), 'Regular')
    fcta = font('Inter.ttf', int(32*s), 'Bold')
    fsub = font('Inter.ttf', int(36*s), 'Regular')
    ft = font('Playfair.ttf', int(84*s), 'Bold')
    fk = font('Inter.ttf', int(26*s), 'SemiBold')
    y = H - int(46*s)
    d.text((W-m, y), credit, font=fc, fill=(226,232,240), anchor='rs')
    y -= int(52*s)
    cw = d.textlength(cta, font=fcta)+int(56*s); ch=int(76*s)
    d.rounded_rectangle((m, y-ch, m+cw, y), radius=int(10*s), fill=AMBER)
    d.text((m+int(28*s), y-ch/2), cta, font=fcta, fill=WHITE, anchor='lm')
    y -= ch + int(40*s)
    sl = wrap(d, sub, fsub, W-2*m)
    for line in reversed(sl):
        d.text((m, y), line, font=fsub, fill=SKY100, anchor='ls'); y -= int(50*s)
    y -= int(22*s)
    tl = wrap(d, title, ft, W-2*m)
    for line in reversed(tl):
        d.text((m, y), line, font=ft, fill=WHITE, anchor='ls'); y -= int(96*s)
    y -= int(4*s)
    d.text((m, y), kicker.upper(), font=fk, fill=SKY100, anchor='ls')
    im.save(os.path.join(OUT, out), quality=90)
    print(out, im.size)

IG=(1080,1350); PIN=(1000,1500)
P = [
 ('girona/catedral-girona/catedral-girona-02.webp','ig-jue12-girona-juego-de-tronos-1080x1350.jpg',*IG,0.45,'Guía · Girona','Girona, escenario de Juego de Tronos','La escalinata de la catedral fue el Gran Septo de Baelor. Ruta a pie, 2 horas y gratis.','Enlace en la bio','Foto: Federico Mata / Unsplash'),
 ('sevilla/kayak-guadalquivir/torre-del-oro-noche.webp','ig-sab14-navidad-sevilla-1080x1350.jpg',*IG,0.5,'Temporada · Sevilla','Navidad en Sevilla','Luces, mapping de San Francisco, Feria del Belén y Cabalgata: el calendario.','Enlace en la bio','Foto: Benjamin Smith, CC BY-SA 4.0'),
 ('girona/catedral-girona/catedral-girona-01.webp','pin-lun09-girona-juego-de-tronos-1000x1500.jpg',*PIN,0.5,'Ruta a pie · Girona','Los escenarios de Juego de Tronos en Girona','Catedral, El Call y Sant Pere de Galligants en una mañana.','Ver la ruta en exploraspain.com','Foto: Joshua Kettle / Unsplash'),
 ('tenerife/teide/teide-nevado.webp','pin-mar10-subir-al-teide-1000x1500.jpg',*PIN,0.64,'Guía · Tenerife','Cómo subir al Teide','Teleférico hasta 3.555 m, permiso para la cima y qué llevar.','Ver la guía en exploraspain.com','Foto: Kawon Kez Sel, CC0'),
 ('cordoba/mezquita/mezquita-guadalquivir.webp','pin-mie11-cordoba-en-un-dia-1000x1500.jpg',*PIN,0.42,'Ruta · Córdoba','Córdoba en un día','Mezquita a primera hora, Judería, Alcázar y Puente Romano, hora a hora.','Ver la ruta en exploraspain.com','Foto: Jose María Ligero Loarte, CC BY-SA 4.0'),
 ('ibiza/calas/cala-conta-islote.webp','pin-jue12-mejores-calas-ibiza-1000x1500.jpg',*PIN,0.4,'Guía · Ibiza','Las mejores calas de Ibiza','Cala Comte, Cala Salada, Cala d\'Hort y Benirràs, por zonas.','Ver la guía en exploraspain.com','Foto: anibal amaro, CC BY 3.0'),
 ('madrid/acueducto-segovia/acueducto-segovia-aqueduct-08-hero.webp','pin-vie13-toledo-o-segovia-1000x1500.jpg',*PIN,0.35,'Excursión desde Madrid','¿Toledo o Segovia?','Tren, tiempos, entradas y qué ver en cada una para elegir bien.','Ver la comparativa en exploraspain.com','Foto: Bernard Gagnon, CC BY-SA 3.0'),
 ('valencia/noche/plaza-ayuntamiento-noche.webp','pin-sab14-navidad-valencia-1000x1500.jpg',*PIN,0.45,'Temporada · Valencia','Navidad en Valencia','Piromusicales en la Plaza del Ayuntamiento, mercadillos y Cabalgata.','Ver el calendario en exploraspain.com','Foto: Nan Palmero, CC BY 2.0'),
 ('bilbao/casco-viejo/plaza-nueva.webp','pin-dom15-bilbao-en-un-dia-1000x1500.jpg',*PIN,0.55,'Ruta · Bilbao','Bilbao en un día','Guggenheim, Casco Viejo, pintxos en la Plaza Nueva y Artxanda.','Ver la ruta en exploraspain.com','Foto: Zarateman, CC0'),
]
for p in P: pieza(*p)
