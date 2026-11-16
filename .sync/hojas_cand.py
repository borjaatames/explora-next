import json,sys,os
from PIL import Image,ImageDraw,ImageFont
rows=json.load(open(sys.argv[1])); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
TW,TH=210,158; COLS=8; RPS=8
font=ImageFont.truetype('/usr/share/fonts/truetype/lato/Lato-Medium.ttf',13)
for s in range(0,len(rows),RPS):
    chunk=rows[s:s+RPS]; sheet=Image.new('RGB',(COLS*TW,len(chunk)*(TH+40)),'white'); d=ImageDraw.Draw(sheet)
    for ri,r in enumerate(chunk):
        y=ri*(TH+40)
        d.text((3,y),f"#{r['n']} {r['c']} · {r['t'][:70]}  ({r['why'][:50]})",fill='black',font=font)
        cells=[('ACTUAL',r['main'])]+[(str(i+1),c) for i,c in enumerate(r['cand'])]
        for ci,(lab,u) in enumerate(cells):
            x=ci*TW
            if u.startswith('http'):
                d.rectangle([x+2,y+18,x+TW-2,y+18+TH-4],outline='red'); d.text((x+10,y+80),'Bókun 720x480',fill='red',font=font)
            else:
                try:
                    im=Image.open('public'+u).convert('RGB'); im.thumbnail((TW-4,TH-4)); sheet.paste(im,(x+2,y+18))
                except Exception: d.text((x+10,y+80),'ERR',fill='red',font=font)
            d.text((x+3,y+18+TH-2),lab,fill='red' if lab=='ACTUAL' else 'blue',font=font)
    sheet.save(f'{out}/cand-{s//RPS:02d}.jpg',quality=75)
print((len(rows)+RPS-1)//RPS)
