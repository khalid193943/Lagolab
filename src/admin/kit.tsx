/** Briques visuelles de l'admin : panneaux, chiffres, badges, fenêtres, champs, graphiques SVG légers. */
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(' ');

export const Panel = ({ children, className = '', title, action, pad = true }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode; pad?: boolean }) => (
  <section className={cx('rounded-2xl bg-white/[0.035] ring-1 ring-white/[0.08] backdrop-blur-sm', className)}>
    {title && <header className="flex items-center justify-between gap-4 px-5 pt-4 pb-3"><h3 className="text-[15px] font-medium tracking-[-0.01em] text-white/90">{title}</h3>{action}</header>}
    <div className={pad ? (title ? 'px-5 pb-5' : 'p-5') : ''}>{children}</div>
  </section>
);

export const Stat = ({ label, value, sub, trend, icon, accent = '#F4B53F' }: { label: string; value: string; sub?: string; trend?: number; icon?: ReactNode; accent?: string }) => (
  <Panel className="relative overflow-hidden">
    <span className="absolute -end-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: accent }} />
    <div className="relative flex items-start justify-between"><p className="text-[13px] text-brume">{label}</p>{icon && <span className="text-white/40">{icon}</span>}</div>
    <p className="relative mt-3 font-display text-[26px] font-medium tracking-[-0.03em] tabular-nums">{value}</p>
    <p className="relative mt-1 text-[12.5px] text-brume flex items-center gap-2">{trend !== undefined && <span className={trend >= 0 ? 'text-[#34D399]' : 'text-[#FF8A7A]'}>{trend >= 0 ? '▲' : '▼'} {Math.abs(Math.round(trend))} %</span>}{sub}</p>
  </Panel>
);

const TONES: Record<string, string> = { hot: 'bg-[#FF6B4A]/15 text-[#FF9A80] ring-[#FF6B4A]/30', warm: 'bg-safran/15 text-safran ring-safran/30', cold: 'bg-white/5 text-brume ring-white/10', good: 'bg-[#34D399]/12 text-[#6EE7B7] ring-[#34D399]/25', info: 'bg-cyan/10 text-cyan ring-cyan/25', warn: 'bg-safran/15 text-safran ring-safran/30', mute: 'bg-white/5 text-white/60 ring-white/10' };
export const Badge = ({ children, tone = 'mute', dot }: { children: ReactNode; tone?: string; dot?: string }) => (
  <span className={cx('inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-medium ring-1 whitespace-nowrap', TONES[tone] || TONES.mute)}>{dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}{children}</span>
);

export const Btn = ({ children, onClick, kind = 'ghost', className = '', type = 'button', disabled, title }: { children: ReactNode; onClick?: () => void; kind?: 'primary' | 'ghost' | 'soft' | 'danger'; className?: string; type?: 'button' | 'submit'; disabled?: boolean; title?: string }) => (
  <button type={type} onClick={onClick} disabled={disabled} title={title} className={cx('inline-flex items-center justify-center gap-2 h-9 px-3.5 text-[13.5px] font-medium transition-all active:scale-[.97] disabled:opacity-40 whitespace-nowrap',
    kind === 'primary' && 'bg-safran text-nuit hover:bg-[#FFC85C] rounded-e-full rounded-s-none ps-3 pe-4',
    kind === 'ghost' && 'rounded-lg text-white/75 hover:text-white hover:bg-white/[0.06]',
    kind === 'soft' && 'rounded-lg bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.1]',
    kind === 'danger' && 'rounded-lg text-[#FF8A7A] hover:bg-[#FF6B4A]/10', className)}>{children}</button>
);

export const Field = ({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) => (
  <label className={cx('block text-[12.5px] text-brume', className)}>{label}<div className="mt-1.5">{children}</div></label>
);
export const inputCls = 'w-full h-10 rounded-lg bg-nuit/70 ring-1 ring-white/10 px-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-cyan/60 transition-shadow';
export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(inputCls, p.className)} />;
export const Select = ({ options, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: [string, string][] }) => <select {...p} className={cx(inputCls, p.className)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;
export const Area = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cx(inputCls, 'h-auto py-2.5 min-h-[96px] resize-y', p.className)} />;

export const Modal = ({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) => {
  useEffect(() => { const f = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f); }, [onClose]);
  return (
    <AnimatePresence>{open && (
      <motion.div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
        <motion.div role="dialog" aria-label={title} onMouseDown={(e) => e.stopPropagation()} initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className={cx('w-full my-6 rounded-2xl bg-[#0D1830] ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]', wide ? 'max-w-4xl' : 'max-w-xl')}>
          <header className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]"><h3 className="font-display text-[17px]">{title}</h3><button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Fermer"><X size={16} /></button></header>
          <div className="p-5">{children}</div>
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );
};

export const Drawer = ({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode }) => (
  <AnimatePresence>{open && (
    <motion.div className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.aside onMouseDown={(e) => e.stopPropagation()} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} className="absolute end-0 top-0 bottom-0 w-full max-w-[560px] bg-[#0B1528] ring-1 ring-white/10 flex flex-col">
        <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/[0.07]"><div className="min-w-0">{title}</div><button onClick={onClose} className="w-8 h-8 shrink-0 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Fermer"><X size={16} /></button></header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <footer className="px-6 py-4 border-t border-white/[0.07] flex flex-wrap gap-2 justify-end">{footer}</footer>}
      </motion.aside>
    </motion.div>
  )}</AnimatePresence>
);

export const Empty = ({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) => (
  <div className="py-14 text-center"><span className="mx-auto w-12 h-12 rounded-2xl bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center text-white/50">{icon}</span><p className="mt-4 font-display text-[16px]">{title}</p>{text && <p className="mt-1 text-[13.5px] text-brume max-w-[40ch] mx-auto">{text}</p>}{action && <div className="mt-5">{action}</div>}</div>
);

export const Tabs = ({ value, onChange, items }: { value: string; onChange: (v: any) => void; items: [string, string, number?][] }) => (
  <div className="inline-flex p-1 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] gap-1 overflow-x-auto max-w-full">{items.map(([v, l, n]) => (
    <button key={v} onClick={() => onChange(v)} className={cx('relative h-8 px-3 rounded-lg text-[13px] whitespace-nowrap transition-colors', value === v ? 'text-nuit' : 'text-white/70 hover:text-white')}>
      {value === v && <motion.span layoutId="admintab" className="absolute inset-0 rounded-lg bg-safran" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
      <span className="relative flex items-center gap-1.5">{l}{n !== undefined && <span className={cx('text-[11px] tabular-nums', value === v ? 'text-nuit/70' : 'text-white/40')}>{n}</span>}</span>
    </button>
  ))}</div>
);

export const Avatar = ({ name, color = '#F4B53F', size = 32 }: { name: string; color?: string; size?: number }) => {
  const ini = name.split(/[\s·]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return <span className="shrink-0 rounded-full flex items-center justify-center font-display font-medium text-nuit" style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, ${color}, #FFE2A6)` }}>{ini}</span>;
};

/* ---------- Graphiques SVG ---------- */
export const Bars = ({ data, h = 180, format = (n: number) => String(Math.round(n)), colors = ['#F4B53F', '#2DD4E6'], legend }: { data: { label: string; a: number; b?: number }[]; h?: number; format?: (n: number) => string; colors?: string[]; legend?: [string, string?] }) => {
  const max = Math.max(1, ...data.map((d) => Math.max(d.a, d.b || 0)));
  return (
    <div>
      {legend && <div className="flex gap-4 mb-3 text-[12px] text-brume">{legend.map((l, i) => l && <span key={l} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[i] }} />{l}</span>)}</div>}
      <div className="flex items-end gap-1.5" style={{ height: h }}>
        {data.map((d, i) => (
          <div key={i} className="group relative flex-1 h-full flex items-end justify-center gap-0.5">
            <motion.div className="w-full max-w-[18px] rounded-t-[4px]" style={{ background: colors[0] }} initial={{ height: 0 }} animate={{ height: `${(d.a / max) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }} />
            {d.b !== undefined && <motion.div className="w-full max-w-[18px] rounded-t-[4px] opacity-80" style={{ background: colors[1] }} initial={{ height: 0 }} animate={{ height: `${(d.b / max) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.03 + 0.1, ease: [0.16, 1, 0.3, 1] }} />}
            <span className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap rounded-md bg-nuit ring-1 ring-white/15 px-2 py-1 text-[11.5px] z-10">{d.label} · {format(d.a)}{d.b !== undefined ? ` / ${format(d.b)}` : ''}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">{data.map((d, i) => <span key={i} className="flex-1 text-center text-[10.5px] text-white/40 truncate">{d.label}</span>)}</div>
    </div>
  );
};

export const Donut = ({ data, size = 150, center }: { data: { label: string; value: number; color: string }[]; size?: number; center?: ReactNode }) => {
  const total = Math.max(1, data.reduce((s, d) => s + d.value, 0)); const r = 42, C = 2 * Math.PI * r; let acc = 0;
  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">{data.map((d) => { const len = (d.value / total) * C; const el = <motion.circle key={d.label} cx="50" cy="50" r={r} fill="none" stroke={d.color} strokeWidth="11" strokeDasharray={`${len} ${C}`} strokeDashoffset={-acc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />; acc += len; return el; })}</svg>
        {center && <div className="absolute inset-0 flex items-center justify-center text-center">{center}</div>}
      </div>
      <ul className="space-y-1.5 text-[12.5px] min-w-0">{data.map((d) => <li key={d.label} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} /><span className="text-white/75 truncate">{d.label}</span><span className="ms-auto ps-3 tabular-nums text-white/50">{Math.round((d.value / total) * 100)} %</span></li>)}</ul>
    </div>
  );
};

export const Spark = ({ values, color = '#2DD4E6', h = 40 }: { values: number[]; color?: string; h?: number }) => {
  const max = Math.max(1, ...values), min = Math.min(0, ...values); const w = 100; const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  return <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }} preserveAspectRatio="none"><defs><linearGradient id={`sg${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs><path d={`${d}L${w} ${h}L0 ${h}Z`} fill={`url(#sg${color.slice(1)})`} /><motion.path d={d} fill="none" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} /></svg>;
};

export const Progress = ({ value, color = '#F4B53F' }: { value: number; color?: string }) => (
  <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, value))}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} /></div>
);

export const Funnel = ({ steps }: { steps: { label: string; value: number; color: string }[] }) => {
  const max = Math.max(1, ...steps.map((s) => s.value));
  return <div className="space-y-2">{steps.map((s, i) => (
    <div key={s.label} className="flex items-center gap-3"><span className="w-28 shrink-0 text-[12.5px] text-white/70">{s.label}</span>
      <div className="flex-1 h-7 rounded-md bg-white/[0.04] overflow-hidden"><motion.div className="h-full rounded-md flex items-center justify-end pe-2 text-[12px] font-medium text-nuit" style={{ background: s.color }} initial={{ width: 0 }} animate={{ width: `${Math.max(8, (s.value / max) * 100)}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}>{s.value}</motion.div></div></div>
  ))}</div>;
};

/* Téléchargement d'un CSV (export) */
export const downloadCSV = (name: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) return; const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + [keys.join(';'), ...rows.map((r) => keys.map((k) => esc(r[k])).join(';'))].join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = name; a.click();
};
