import subprocess,random,re,yaml,os,json
from PIL import Image,ImageDraw,ImageFont
files=[l[3:] for l in subprocess.run(['git','status','-s','content/actividades/es'],capture_output=True,text=True).stdout.splitlines() if l.startswith(' M')]
random.seed(7); files=random.sample(files,min(16,len(files)))
font=ImageFont.truetype('/usr/share/fonts/truetype/lato/Lato-Medium.ttf',13)
TW,TH=200,150
sheet=Image.new('RGB',(8*TW,len(files)*(TH+20)),'white'); d=ImageDraw.Draw(sheet)
for r,p in enumerate(files):
    s=open(p,encoding='utf-8').read(); fm=yaml.safe_load(s[3:s.index('\n---',3)])
    imgs=[fm['imagen']]+[g['src'] for g in fm.get('galeria') or []]
    y=r*(TH+20); d.text((3,y),fm['titulo'][:110],fill='black',font=font)
    for c,u in enumerate(imgs[:8]):
        if str(u).startswith('http'): d.text((c*TW+20,y+70),'Bókun',fill='red',font=font); continue
        try: im=Image.open('public'+u).convert('RGB'); im.thumbnail((TW-4,TH-4)); sheet.paste(im,(c*TW+2,y+18))
        except: pass
sheet.save('.sync/muestra8.jpg',quality=70)
print(len(files))
