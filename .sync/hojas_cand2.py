import json,sys,os
from PIL import Image,ImageDraw,ImageFont
E=os.path.expanduser('~/mnt/imagenes-master')
rows=[r for r in json.load(open(sys.argv[1])) if r['cand']]; out=sys.argv[2]; os.makedirs(out,exist_ok=True)
TW,TH=210,158; COLS=9; RPS=8
font=ImageFont.truetype('/usr/share/fonts/truetype/lato/Lato-Medium.ttf',13)
for s in range(0,len(rows),RPS):
    chunk=rows[s:s+RPS]; sheet=Image.new('RGB',(COLS*TW,len(chunk)*(TH+40)),'white'); d=ImageDraw.Draw(sheet)
    for ri,r in enumerate(chunk):
        y=ri*(TH+40)
        d.text((3,y),f"#{r['n']} {r['c']} · {r['t'][:75]}  ({r['why'][:45]})",fill='black',font=font)
        cells=[('ACTUAL','W',r['main'])]+[(str(i+1),src,c) for i,(src,c) in enumerate(r['cand'])]
        for ci,(lab,src,u) in enumerate(cells):
            x=ci*TW
            if u.startswith('http'):
                d.rectangle([x+2,y+18,x+TW-2,y+16+TH],outline='red'); d.text((x+10,y+80),'Bókun 720x480',fill='red',font=font)
            else:
                try:
                    im=Image.open(('public'+u) if src=='W' else os.path.join(E,u)).convert('RGB'); im.thumbnail((TW-4,TH-4)); sheet.paste(im,(x+2,y+18))
                except Exception: d.text((x+10,y+80),'ERR',fill='red',font=font)
            d.text((x+3,y+16+TH),lab,fill='red' if lab=='ACTUAL' else 'blue',font=font)
    sheet.save(f'{out}/p-{s//RPS:02d}.jpg',quality=75)
print((len(rows)+RPS-1)//RPS)
