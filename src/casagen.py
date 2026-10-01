"""Casablanca, vue de haut : une vraie métropole, ses boulevards, ses quartiers, son port."""
import math, random
from shapely.geometry import Polygon, LineString, Point, box
from shapely.ops import unary_union
W,H=3200,1778
def chaikin(pts, it=3):
    for _ in range(it):
        q=[pts[0]]
        for i in range(len(pts)-1):
            p0,p1=pts[i],pts[i+1]
            q.append((0.75*p0[0]+0.25*p1[0],0.75*p0[1]+0.25*p1[1])); q.append((0.25*p0[0]+0.75*p1[0],0.25*p0[1]+0.75*p1[1]))
        q.append(pts[-1]); pts=q
    return pts
def blob(cx,cy,ax,ay,ang=0,rough=0.12,n=40,seed=1):
    r=random.Random(seed); pts=[]; ph=[r.uniform(0,6.28) for _ in range(3)]
    for i in range(n):
        a=2*math.pi*i/n; k=1+rough*(math.sin(3*a+ph[0])*.5+math.sin(5*a+ph[1])*.3+math.sin(7*a+ph[2])*.2)
        x=ax*math.cos(a)*k; y=ay*math.sin(a)*k; ca,sa=math.cos(ang),math.sin(ang)
        pts.append((cx+x*ca-y*sa, cy+x*sa+y*ca))
    return Polygon(pts)
# la côte, au nord : une fine bande d'océan seulement
COAST=chaikin([(-100,250),(300,215),(620,205),(900,230),(1180,215),(1480,200),(1600,175),(1660,150),(1700,172),(1800,205),(1950,215),(2150,200),(2400,215),(2700,190),(3000,170),(3300,150)],4)
land=Polygon(COAST+[(3300,1900),(-100,1900)])
CEN=(1900,560)
# grands axes : rayons depuis le centre et deux rocades
def ray(ang,length,bend=0.0,seed=0):
    r=random.Random(seed); pts=[CEN]
    for k in range(1,9):
        d=length*k/8; a=math.radians(ang)+bend*math.sin(k/2.5)
        pts.append((CEN[0]+d*math.cos(a)+r.uniform(-12,12), CEN[1]+d*math.sin(a)+r.uniform(-12,12)))
    return chaikin(pts,3)
RAYS=[ray(200,1900,.05,1),ray(160,1800,-.06,2),ray(130,1500,.05,3),ray(105,1400,-.04,4),ray(80,1350,.05,5),ray(55,1500,-.05,6),ray(30,1600,.04,7),ray(5,1500,.03,8),ray(-15,1400,-.03,9),ray(180,1700,.02,10),ray(220,900,.04,11)]
def ellipse_road(ax,ay,cx=CEN[0],cy=CEN[1],rot=-4,n=120,seed=0):
    r=random.Random(seed); pts=[]
    for i in range(n+1):
        a=2*math.pi*i/n; k=1+0.05*math.sin(3*a+seed)+0.03*math.sin(7*a)
        x=ax*math.cos(a)*k; y=ay*math.sin(a)*k; ca,sa=math.cos(math.radians(rot)),math.sin(math.radians(rot))
        pts.append((cx+x*ca-y*sa, cy+x*sa+y*ca))
    return pts
RING1=ellipse_road(520,300,seed=1); RING2=ellipse_road(1050,640,cy=640,seed=2); RING3=ellipse_road(1620,1000,cy=760,seed=3)
COASTROAD=chaikin([(-100,300),(400,265),(900,280),(1300,262),(1600,240),(1900,262),(2400,262),(3300,210)],3)
landi=land.buffer(-18)
def clipline(pts):
    g=LineString(pts).intersection(landi); return g
MAJOR=[(clipline(p),26) for p in [RING2,RING3]]+[(clipline(p),20) for p in RAYS]+[(clipline(RING1),18),(clipline(COASTROAD),18)]
metro=blob(1650,900,1750,1050,0,0.08,60,5).intersection(land)
urban=metro
roads=unary_union([g.buffer(w/2+4,cap_style=1) for g,w in MAJOR if not g.is_empty])
superblocks=urban.difference(roads)
# quartiers : taille des îlots (petite = dense)
DIST=[('Ancienne Médina',1780,300,11,17),('Centre',1920,520,16,34),('Gauthier',1600,470,16,30),('Maârif',1320,640,16,32),('Racine',1260,430,20,38),('Anfa',880,420,34,70),('Aïn Diab',460,330,32,64),('Casa Finance City',1000,760,34,62),('Hay Hassani',640,920,14,28),('Oulfa',560,1180,14,28),('Sidi Maârouf',1240,1300,40,80),('Bouskoura',1650,1620,60,120),('Hay Mohammadi',2460,470,12,24),('Aïn Sebaâ',2860,420,40,90),('Sidi Bernoussi',3050,700,16,32),('Ben Msik',2320,960,12,24),('Sidi Othmane',2600,1180,12,24),('Mers Sultan',2080,700,14,28),('Bourgogne',1460,330,16,30),('Californie',2000,1300,22,46)]
def district(pt):
    return min(DIST,key=lambda d:(d[1]-pt[0])**2+(d[2]-pt[1])**2)
def subdivide(poly, rr, out, street):
    if poly.is_empty: return
    if poly.geom_type!='Polygon':
        for g in getattr(poly,'geoms',[]): subdivide(g,rr,out,street)
        return
    c=poly.centroid; d=district((c.x,c.y)); lim=rr.uniform(d[3],d[4])**2
    if poly.area<lim:
        b=poly.buffer(-street/2,join_style=2)
        if not b.is_empty and b.area>25: out.append((d[0],b))
        return
    mrr=poly.minimum_rotated_rectangle; cs=list(mrr.exterior.coords)
    e1=(cs[1][0]-cs[0][0],cs[1][1]-cs[0][1]); e2=(cs[2][0]-cs[1][0],cs[2][1]-cs[1][1])
    L1=math.hypot(*e1); L2=math.hypot(*e2); ax=e1 if L1>=L2 else e2; L=max(L1,L2); ux,uy=ax[0]/L,ax[1]/L
    t=rr.uniform(-.15,.15)*L; px,py=c.x+ux*t,c.y+uy*t; j=rr.uniform(-.08,.08); nx,ny=-uy+j*ux,ux+j*uy
    from shapely.ops import split
    try: parts=list(split(poly,LineString([(px-nx*3000,py-ny*3000),(px+nx*3000,py+ny*3000)])).geoms)
    except Exception: parts=[poly]
    if len(parts)<2:
        b=poly.buffer(-street/2,join_style=2)
        if not b.is_empty: out.append((d[0],b))
        return
    for g in parts: subdivide(g,rr,out,street)
BLOCKS=[]
rr=random.Random(11)
for g in getattr(superblocks,'geoms',[superblocks]):
    subdivide(g,rr,BLOCKS,7)
PARKS=[blob(1860,690,95,60,0,.2,24,21),blob(1000,560,150,70,-.1,.25,30,23),blob(1650,1640,420,160,0,.25,40,25),blob(700,640,80,50,0,.2,24,27),blob(2250,1250,90,55,0,.2,24,29),blob(2700,800,80,50,0,.2,24,31)]
def ring(c): return 'M'+' '.join(f'{x:.0f},{y:.0f}' for x,y in c)+'Z'
def polyd(g):
    d=''
    for p in getattr(g,'geoms',[g]):
        if p.geom_type=='Polygon' and not p.is_empty: d+=ring(list(p.exterior.coords)[:-1])
    return d
def lined(g):
    out=''
    for l in getattr(g,'geoms',[g]):
        if l.geom_type=='LineString' and not l.is_empty: out+='M'+' '.join(f'{x:.0f},{y:.0f}' for x,y in l.coords)
    return out
TONE={'Ancienne Médina':'#CAD7EC','Centre':'#D5E0F1','Aïn Sebaâ':'#D2DBE8','Sidi Maârouf':'#D9E2EF','Anfa':'#E1E9F4','Aïn Diab':'#E3EAF5','Casa Finance City':'#D8E2F1','Bouskoura':'#E2EAF4'}
def build():
    s=[f'<svg class="citymap" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">']
    s.append('<defs><linearGradient id="kSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFD8F4"/><stop offset="1" stop-color="#D6E7FA"/></linearGradient></defs>')
    s.append(f'<rect width="{W}" height="{H}" fill="url(#kSea)"/>')
    for k,off in enumerate([40,95]):
        c=LineString(COAST).parallel_offset(off,'left',join_style=1)
        s.append(f'<path d="{lined(c)}" fill="none" stroke="rgba(255,255,255,{.6-k*.25:.2f})" stroke-width="2" stroke-dasharray="8 12"/>')
    s.append(f'<path d="{polyd(land)}" fill="#EEF2F8"/>')
    s.append(f'<path d="{polyd(urban)}" fill="#FFFFFF"/>')
    groups={}
    for n,b in BLOCKS: groups.setdefault(TONE.get(n,'#DDE6F3'),[]).append(polyd(b))
    for col,ds in groups.items(): s.append(f'<path d="{"".join(ds)}" fill="{col}"/>')
    for p in PARKS: s.append(f'<path d="{polyd(p.intersection(urban))}" fill="#D8ECE2"/>')
    # boulevards et rocades
    for g,w in MAJOR:
        s.append(f'<path d="{lined(g)}" fill="none" stroke="#C9D7EC" stroke-width="{w+6}" stroke-linecap="round" stroke-linejoin="round"/>')
    for g,w in MAJOR:
        s.append(f'<path d="{lined(g)}" fill="none" stroke="#FFFFFF" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')
    # autoroute urbaine
    A=clipline(chaikin([(3300,300),(2900,360),(2600,450),(2350,650),(2180,920),(1900,1150),(1400,1360),(900,1560),(-100,1900)],3))
    s.append(f'<path d="{lined(A)}" fill="none" stroke="#E8D9A8" stroke-width="40" stroke-linecap="round"/><path d="{lined(A)}" fill="none" stroke="#FFF6DE" stroke-width="32" stroke-linecap="round"/>')
    # tramway : deux lignes
    T1=clipline(chaikin([(560,1250),(760,1000),(1050,820),(1400,660),(1700,560),(1900,540),(2200,520),(2600,560),(3000,720)],3))
    T2=clipline(chaikin([(1300,1450),(1450,1150),(1650,900),(1850,720),(1950,560),(2000,380),(2150,300),(2500,320),(2900,400)],3))
    for T,c in [(T1,'#2F6BFF'),(T2,'#E0892B')]:
        s.append(f'<path d="{lined(T)}" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/><path d="{lined(T)}" fill="none" stroke="{c}" stroke-width="6" stroke-linecap="round" opacity=".75"/>')
    # voie ferrée
    Rl=clipline(chaikin([(3300,480),(2900,470),(2500,500),(2300,560),(2150,450),(2000,330)],3))
    s.append(f'<path d="{lined(Rl)}" fill="none" stroke="#9FB2CE" stroke-width="5"/><path d="{lined(Rl)}" fill="none" stroke="#EEF2F8" stroke-width="2.5" stroke-dasharray="12 12"/>')
    # port et mosquée
    s.append('<path d="M1960 200 L2000 90 L2260 70 M2150 205 L2200 120 L2380 110" fill="none" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>')
    s.append('<path d="M1640 160 L1660 128 L1690 160 Z" fill="#FFFFFF"/><rect x="1655" y="96" width="8" height="46" rx="2" fill="#9FB2CE"/>')
    L=[(1720,860,'Casablanca','city'),(300,110,'Océan Atlantique','sea'),(1780,300,'Ancienne Médina','q'),(2140,640,'Centre-ville','q'),(1330,700,'Maârif','q'),(1560,430,'Gauthier','q'),(860,470,'Anfa','q'),(460,370,'Aïn Diab','q'),(1000,780,'Casa Finance City','q'),(640,960,'Hay Hassani','q'),(1240,1330,'Sidi Maârouf','q'),(2460,520,'Hay Mohammadi','q'),(2880,460,'Aïn Sebaâ','q'),(3020,740,'Sidi Bernoussi','q'),(2320,1000,'Ben Msik','q'),(2600,1220,'Sidi Othmane','q'),(1660,1640,'Bouskoura','q'),(1660,95,'Mosquée Hassan II','d'),(2250,50,'Port','d'),(2950,300,'Autoroute A3 →','d')]
    global LABELS; LABELS=L
    s.append('</svg>')
    return ''.join(s)
if __name__=='__main__':
    svg=build(); print(len(svg)//1024,'KB',len(BLOCKS),'blocks')
    open('casa.svg','w').write(svg.replace('class="citymap"','class="citymap" xmlns="http://www.w3.org/2000/svg" width="3200" height="1778"').replace('class="ml city"','font-family="serif" font-style="italic" font-size="96" fill="#274A86" class="ml city"').replace('class="ml sea"','font-family="serif" font-style="italic" font-size="44" fill="#7FA3CE" class="ml sea"').replace('class="ml q"','font-size="30" font-weight="600" fill="#5F7AA3" class="ml q"').replace('class="ml d"','font-size="26" fill="#8FA3C2" class="ml d"'))
