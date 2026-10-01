import re
def soften(html, k=0.68):
    def fix_decl(m):
        return re.sub(r'calc\((\d+(?:\.\d+)?) \* var\(--u\)\)', lambda c: f'calc({max(2, round(float(c.group(1))*k,1))} * var(--u))', m.group(0))
    return re.sub(r'border-radius:[^;}"]*', fix_decl, html)
