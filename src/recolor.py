import re, colorsys
def hsl(hexs):
    r,g,b=[int(hexs[i:i+2],16)/255 for i in (0,2,4)]
    h,l,s=colorsys.rgb_to_hls(r,g,b); return h*360,s,l
def tohex(h,s,l):
    r,g,b=colorsys.hls_to_rgb(h/360,l,s); return '%02X%02X%02X'%(round(r*255),round(g*255),round(b*255))
def maprgb(r,g,b):
    h,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255); h*=360
    if 68<=h<=200:
        nh=208+(h-68)*(226-208)/(200-68)
        ns=min(1,s*1.04) if s>0.5 else s
        nl=l
        if l<0.22 and s>0.2:
            # les bleus nuit : plus profonds, plus lumineux, jamais noirs
            nh=222; ns=0.7; nl=0.12+l*0.75
        r2,g2,b2=colorsys.hls_to_rgb(nh/360,nl,ns)
        return round(r2*255),round(g2*255),round(b2*255)
    return r,g,b
KEEP={'4ADE80','25D366','0EA5E9','16A34A','E11D48','EA7A1A','8B5A2B','7C3AED','DB2777','C98A2E','15803D','0F766E','475569','A16207','334155','1F57C7','1E40AF','BE185D'}
def maphex(hx):
    if hx.upper() in KEEP: return hx
    r,g,b=[int(hx[i:i+2],16) for i in (0,2,4)]
    r2,g2,b2=maprgb(r,g,b)
    out='%02X%02X%02X'%(r2,g2,b2)
    return out if hx.isupper() else out
def recolor(html):
    # protéger les palettes propres aux métiers (cartes et mini-sites)
    keep={}
    def stash(m):
        k=f'@@K{len(keep)}@@'; keep[k]=m.group(0); return k
    html=re.sub(r'style="--bg:[^"]*"',stash,html)
    html=re.sub(r'#([0-9a-fA-F]{6})\b',lambda m:'#'+maphex(m.group(1)),html)
    html=re.sub(r'%23([0-9a-fA-F]{6})',lambda m:'%23'+maphex(m.group(1)),html)
    def rgba(m):
        r,g,b=int(m.group(1)),int(m.group(2)),int(m.group(3)); r2,g2,b2=maprgb(r,g,b)
        return f'rgba({r2},{g2},{b2},'
    html=re.sub(r'rgba\((\d+),\s*(\d+),\s*(\d+),',rgba,html)
    for k,v in keep.items(): html=html.replace(k,v)
    return html
if __name__=='__main__':
    for c in ['64F662','072021','1FA34A','178A4A','0B6B5C','3E9A22','C8FF3C','CEE0CA','F2F6F1','5B706C','DCE6DF','9BFF96','0F3336','184549','DDE6E6']:
        print(c,'->',maphex(c))
