import json,os
from PIL import Image,ImageDraw,ImageFont
E=os.path.expanduser('~/mnt/imagenes-master')
d=[o for o in json.load(open('.sync/dec3.json')) if o['tipo']=='gal']
font=ImageFont.truetype('/usr/share/fonts/truetype/lato/Lato-Medium.ttf',13)
TW,TH=320,240; C=4
sh=Image.new('RGB',(C*TW,((len(d)+C-1)//C)*(TH+34)),'white'); dr=ImageDraw.Draw(sh)
for i,o in enumerate(d):
    x=(i%C)*TW; y=(i//C)*(TH+34)
    im=Image.open(('public'+o['path']) if o['src']=='W' else os.path.join(E,o['path'])).convert('RGB'); im.thumbnail((TW-4,TH-4)); sh.paste(im,(x+2,y+2))
    dr.text((x+3,y+TH),f"g{i+1} · {o['t'][:42]}",fill='blue',font=font)
sh.save('.sync/gal3.jpg',quality=78); print(len(d))
