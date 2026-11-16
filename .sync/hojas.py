import json,sys,os
from PIL import Image,ImageDraw,ImageFont
items=json.load(open(sys.argv[1]))[sys.argv[2]] if len(sys.argv)>3 else json.load(open(sys.argv[1]))
out=sys.argv[-1]; os.makedirs(out,exist_ok=True)
TW,TH,COLS,ROWS=300,225,6,4
try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
except: font=ImageFont.load_default()
per=COLS*ROWS
for s in range(0,len(items),per):
    sheet=Image.new('RGB',(COLS*TW,ROWS*(TH+36)),'white'); d=ImageDraw.Draw(sheet)
    for k,(n,c,t,u) in enumerate(items[s:s+per]):
        x=(k%COLS)*TW; y=(k//COLS)*(TH+36)
        f='public'+u
        try:
            im=Image.open(f).convert('RGB'); w,h=im.size; im.thumbnail((TW-4,TH-4)); sheet.paste(im,(x+2,y+2)); lab=f'{w}x{h}'
        except Exception as e: lab='ERR'
        col='red' if lab=='ERR' or (lab[0].isdigit() and max(map(int,lab.split('x')))<1200) else 'black'
        d.text((x+3,y+TH),f'#{n} {c} {lab}',fill=col,font=font)
        d.text((x+3,y+TH+16),t[:40],fill='black',font=font)
    sheet.save(f'{out}/hoja-{s//per:03d}.jpg',quality=72)
print('hojas',(len(items)+per-1)//per)
