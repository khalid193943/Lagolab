/**
 * Chat Digilago : remplace les boutons WhatsApp et Appeler.
 * Une bulle « Salam 👋 N9dar n3awnek? » apparaît près du logo ; au clic, une petite conversation guidée
 * (en darija sur le site français, en darija arabe sur /ar, en anglais sur /en) oriente vers
 * le contact, les réalisations ou la page société. Un message libre part directement sur WhatsApp.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Send, ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { CONTACT } from './data';
import { Mark } from './ui';
import { tv, L, lang } from './i18n';

type Action = { label: string; to?: string; href?: string; icon?: 'wa' | 'tel' };
type Msg = { from: 'bot' | 'user'; text: string; actions?: Action[] };
type Topic = { chip: string; reply: string[]; actions: Action[] };

/* Textes : darija latine (site FR), darija arabe (/ar), anglais (/en) */
const S = () => {
  const wa = CONTACT.whatsapp, tel = `tel:${CONTACT.tel}`;
  return {
    teaser: tv({ fr: 'Salam 👋 N9dar n3awnek?', en: 'Hi 👋 Can I help you?', ar: 'السلام 👋 نقدر نعاونك؟' }),
    name: 'Digilago',
    status: tv({ fr: 'Kanjawbo f nhar', en: 'Replies the same day', ar: 'كنجاوبو فنفس النهار' }),
    hello: [
      tv({ fr: 'Marhba bik f Digilago! 😊', en: 'Welcome to Digilago! 😊', ar: 'مرحبا بيك ف ديجيلاغو! 😊' }),
      tv({ fr: 'Bghiti tkoun nta bayn f l’internet? Site, fiche Google, w 7ta f ChatGPT…', en: 'Want your business to be seen online? Website, Google profile, even on ChatGPT…', ar: 'بغيتي تكون نتا باين فالأنترنيت؟ موقع، فيشة Google، وحتى فـChatGPT…' }),
      tv({ fr: 'Khtar chi haja men hna 👇', en: 'Pick an option below 👇', ar: 'ختار شي حاجة من هنا 👇' }),
    ],
    again: tv({ fr: 'Chi haja okhra? 🙂', en: 'Anything else? 🙂', ar: 'شي حاجة أخرى؟ 🙂' }),
    placeholder: tv({ fr: 'Kteb lina hna…', en: 'Type your message…', ar: 'كتب لينا هنا…' }),
    sending: tv({ fr: 'Safi! Ghadi n7ellou lik WhatsApp bach twsslna l’message dyalek 🚀', en: 'Great! Opening WhatsApp so your message reaches us 🚀', ar: 'صافي! غادي نحلّو ليك الواتساب باش يوصلنا الميساج ديالك 🚀' }),
    waPrefix: tv({ fr: 'Salam Digilago, ', en: 'Hello Digilago, ', ar: 'السلام ديجيلاغو، ' }),
    open: tv({ fr: 'Ouvrir le chat', en: 'Open chat', ar: 'حلّ الشات' }),
    close: tv({ fr: 'Fermer le chat', en: 'Close chat', ar: 'سدّ الشات' }),
    topics: [
      { chip: tv({ fr: 'Ah, bghit nban f l’internet', en: 'Yes, I want to be online', ar: 'إيه، بغيت نبان فالأنترنيت' }),
        reply: [tv({ fr: 'Mzyan bzaf! 🙌 Kansaybo lik site kamel, fiche Google w référencement.', en: 'Great! 🙌 We build your full website, Google profile and SEO.', ar: 'مزيان بزاف! 🙌 كنصاوبو ليك موقع كامل، فيشة Google والريفيرونسمون.' }),
                tv({ fr: 'L’version lwla katwsslek f 72 sa3a, w ma katkhelless walou 7ta tw9ef 3liha.', en: 'Your first version arrives in 72 hours, and you pay nothing until you approve it.', ar: 'النسخة الأولى كتوصلك فـ72 ساعة، وما كتخلّص والو حتى توافق عليها.' })],
        actions: [{ label: tv({ fr: 'Sift talab dyalek', en: 'Send your request', ar: 'صيفط الطلب ديالك' }), to: '/contact' }, { label: tv({ fr: 'Hder m3ana f WhatsApp', en: 'Chat on WhatsApp', ar: 'هضر معانا فالواتساب' }), href: wa, icon: 'wa' }] },
      { chip: tv({ fr: 'Bghit nchouf l’khedma dyalkom', en: 'Show me your work', ar: 'بغيت نشوف الخدمة ديالكم' }),
        reply: [tv({ fr: 'Hahouma chi projets li dernaha, w bzaf dyal les idées l ga3 l7iraf 👇', en: 'Here are some projects we’ve delivered, plus ideas for every trade 👇', ar: 'هاهوما شي مشاريع اللي درناها، وبزاف ديال الأفكار لكاع الحرف 👇' })],
        actions: [{ label: tv({ fr: 'Chouf les réalisations', en: 'See our work', ar: 'شوف أعمالنا' }), to: '/realisations' }] },
      { chip: tv({ fr: 'Chkoun ntouma?', en: 'Who are you?', ar: 'شكون نتوما؟' }),
        reply: [tv({ fr: '7na Digilago, charika men El Jadida 🌊', en: 'We’re Digilago, a company from El Jadida 🌊', ar: 'حنا ديجيلاغو، شركة من الجديدة 🌊' }),
                tv({ fr: '11 3am w 7na kanbniw sites, applications w e-commerce. Daba kan3awnou les entreprises ybanou f l’internet, w kandirou ta9riban kolchi blasthom.', en: 'For 11 years we’ve built websites, apps and e-commerce. Now we help businesses get seen online, and we do almost everything for them.', ar: '11 عام وحنا كنبنيو مواقع، تطبيقات وتجارة إلكترونية. دابا كنعاونو الشركات يبانو فالأنترنيت، وكنديرو تقريبا كلشي بلاصتهم.' })],
        actions: [{ label: tv({ fr: 'Chkoun 7na', en: 'About us', ar: 'شكون حنا' }), to: '/societe' }] },
      { chip: tv({ fr: 'Chhal kaykellef?', en: 'How much does it cost?', ar: 'شحال كيكلّف؟' }),
        reply: [tv({ fr: 'Taman kaytbeddel 3la 7sab chno m7taj.', en: 'The price depends on what you need.', ar: 'الثمن كيتبدّل على حساب شنو محتاج.' }),
                tv({ fr: 'L’version lwla fabor, w taman kan3tiwh lik maktoub 9bel ma nbdaw. Bla mfaja2at 👌', en: 'The first version is free, and you get the price in writing before we start. No surprises 👌', ar: 'النسخة الأولى فابور، والثمن كنعطيوه ليك مكتوب قبل ما نبداو. بلا مفاجآت 👌' })],
        actions: [{ label: tv({ fr: 'Tlob devis', en: 'Get a quote', ar: 'طلب ديفي' }), to: '/contact' }] },
      { chip: tv({ fr: 'Bghit nhder m3a chi wa7ed', en: 'I’d like to talk to someone', ar: 'بغيت نهضر مع شي واحد' }),
        reply: [tv({ fr: 'Mra7ba! Kanjawbo f nhar, men tnin 7ta sebt, men 9 d sba7 7ta 7 d l3chiya.', en: 'Of course! We reply the same day, Monday to Saturday, 9 am to 7 pm.', ar: 'مرحبا! كنجاوبو فنفس النهار، من الاثنين حتى السبت، من 9 د الصباح حتى 7 د العشية.' })],
        actions: [{ label: 'WhatsApp', href: wa, icon: 'wa' }, { label: tv({ fr: '3ayet lina', en: 'Call us', ar: 'عيّط لينا' }), href: tel, icon: 'tel' }] },
    ] as Topic[],
  };
};

/* Ouvrir le chat depuis n'importe où (ex. barre mobile) */
export const openChat = () => window.dispatchEvent(new Event('dg-chat-open'));

const Typing = () => (
  <span className="inline-flex gap-1 items-center h-5" aria-label="…">{[0, 1, 2].map((i) => <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-brume" animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}</span>
);

const Avatar = ({ size = 'w-9 h-9' }: { size?: string }) => (
  <span className={`${size} shrink-0 rounded-full bg-nuit ring-1 ring-safran/40 flex items-center justify-center`}><Mark className="w-[55%] h-[60%]" /></span>
);

export const ChatBot = () => {
  const s = S(); const nav = useNavigate(); const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState(false);
  const [text, setText] = useState('');
  const started = useRef(false); const list = useRef<HTMLDivElement>(null); const timers = useRef<number[]>([]);
  const rtl = lang() === 'ar';

  /* La bulle d'accroche : une fois par visite */
  useEffect(() => {
    let seen = false; try { seen = !!sessionStorage.getItem('dg-chat-teaser'); } catch { /* */ }
    if (seen) return;
    const id = window.setTimeout(() => setTeaser(true), 4200); return () => window.clearTimeout(id);
  }, []);
  const hideTeaser = () => { setTeaser(false); try { sessionStorage.setItem('dg-chat-teaser', '1'); } catch { /* */ } };
  useEffect(() => { const f = () => { setOpen(true); hideTeaser(); }; window.addEventListener('dg-chat-open', f); return () => window.removeEventListener('dg-chat-open', f); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* Le bot écrit ses messages un par un, avec « en train d'écrire » */
  const say = (texts: string[], actions?: Action[], then?: () => void) => {
    setChips(false);
    let delay = 250;
    texts.forEach((tx, i) => {
      timers.current.push(window.setTimeout(() => setTyping(true), delay));
      delay += reduce ? 150 : Math.min(1400, 450 + tx.length * 12);
      const last = i === texts.length - 1;
      timers.current.push(window.setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { from: 'bot', text: tx, actions: last ? actions : undefined }]); }, delay));
      delay += 220;
    });
    timers.current.push(window.setTimeout(() => { then?.(); setChips(true); }, delay + 150));
  };
  useEffect(() => { if (open && !started.current) { started.current = true; say(s.hello); } }, [open]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing, chips]);

  const pick = (tp: Topic) => { setMsgs((m) => [...m, { from: 'user', text: tp.chip }]); say(tp.reply, tp.actions); };
  const act = (a: Action) => { if (a.to) { setOpen(false); nav(L(a.to)); } else if (a.href) window.open(a.href, a.href.startsWith('http') ? '_blank' : '_self'); };
  const send = (e: React.FormEvent) => {
    e.preventDefault(); const v = text.trim(); if (!v) return;
    setMsgs((m) => [...m, { from: 'user', text: v }]); setText('');
    say([s.sending], undefined, () => window.open(`https://wa.me/${CONTACT.tel.replace('+', '')}?text=${encodeURIComponent(s.waPrefix + v)}`, '_blank'));
  };

  return (
    <>
      {/* Bouton flottant (ordinateur) */}
      <div className="hidden lg:block fixed end-5 bottom-5 z-[56]">
        <Launcher open={open} onClick={() => { setOpen(!open); hideTeaser(); }} label={open ? s.close : s.open} />
      </div>

      {/* Bulle d'accroche */}
      <AnimatePresence>{teaser && !open && (
        <motion.div className="fixed z-[56] start-4 lg:start-auto lg:end-5 bottom-[92px] lg:bottom-[96px] max-w-[270px]" initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ transformOrigin: 'bottom' }}>
          <button onClick={() => { setOpen(true); hideTeaser(); }} className="relative w-full text-start rounded-2xl rounded-es-md lg:rounded-es-2xl lg:rounded-ee-md bg-white text-encre px-4 py-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,.6)] ring-1 ring-black/5">
            <span className="flex items-center gap-2.5"><Avatar size="w-8 h-8" /><span><span className="block text-[12px] text-ardoise">{s.name}</span><span className="block text-[15.5px] font-medium">{s.teaser}</span></span></span>
          </button>
          <button onClick={hideTeaser} aria-label={s.close} className="absolute -top-2.5 -end-2.5 lg:end-auto lg:-start-2.5 w-7 h-7 rounded-full bg-nuit text-white ring-1 ring-white/20 flex items-center justify-center"><X size={13} /></button>
        </motion.div>
      )}</AnimatePresence>

      {/* Fenêtre du chat */}
      <AnimatePresence>{open && (
        <motion.section role="dialog" aria-label={s.name} className="fixed z-[70] inset-x-3 bottom-3 lg:inset-x-auto lg:end-5 lg:bottom-[96px] lg:w-[390px] h-[min(78svh,620px)] lg:h-[min(72vh,600px)] rounded-[26px] overflow-hidden bg-nuit ring-1 ring-white/12 shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)] flex flex-col"
          style={{ transformOrigin: rtl ? 'bottom left' : 'bottom right', marginBottom: 'env(safe-area-inset-bottom)' }}
          initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
          {/* En-tête */}
          <header className="relative flex items-center gap-3 px-4 py-3.5 bg-nuit-2 border-b border-white/10">
            <span className="relative"><Avatar size="w-11 h-11" /><span className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-[#34D399] ring-2 ring-nuit-2" /></span>
            <span className="flex-1 min-w-0"><span className="block font-display text-[17px] leading-tight">Digilago</span><span className="block text-[12.5px] text-brume">{s.status}</span></span>
            <button onClick={() => setOpen(false)} aria-label={s.close} className="w-10 h-10 rounded-full ring-1 ring-white/15 flex items-center justify-center hover:bg-white/5"><X size={17} /></button>
          </header>

          {/* Messages */}
          <div ref={list} className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-3 dotgrid">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {m.from === 'bot' && <Avatar size="w-7 h-7" />}
                <div className="max-w-[82%]">
                  <p dir="auto" className={`px-4 py-2.5 text-[15px] leading-relaxed ${m.from === 'user' ? 'bg-safran text-nuit rounded-2xl rounded-ee-md font-medium' : 'bg-nuit-2 ring-1 ring-white/8 text-white/92 rounded-2xl rounded-es-md'}`}>{m.text}</p>
                  {m.actions && <div className="mt-2 flex flex-wrap gap-2">{m.actions.map((a) => (
                    <button key={a.label} onClick={() => act(a)} className={`h-10 px-4 rounded-full text-[14px] font-medium flex items-center gap-2 transition-transform active:scale-95 ${a.icon === 'wa' ? 'bg-[#25D366] text-nuit' : a.icon === 'tel' ? 'bg-white/10 ring-1 ring-white/15' : 'btn-safran'}`}>
                      {a.icon === 'wa' ? <MessageCircle size={16} /> : a.icon === 'tel' ? <Phone size={15} /> : null}{a.label}{a.to && <ArrowUpRight size={15} />}
                    </button>
                  ))}</div>}
                </div>
              </motion.div>
            ))}
            {typing && <div className="flex gap-2"><Avatar size="w-7 h-7" /><span className="px-4 py-2.5 rounded-2xl rounded-es-md bg-nuit-2 ring-1 ring-white/8"><Typing /></span></div>}
            {chips && (
              <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                {msgs.some((m) => m.from === 'user') && <p className="text-[12.5px] text-brume mb-2 ps-9">{s.again}</p>}
                <div className="flex flex-col items-end gap-2">{s.topics.map((tp, i) => (
                  <motion.button key={tp.chip} initial={reduce ? false : { opacity: 0, x: rtl ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} onClick={() => pick(tp)} dir="auto"
                    className="max-w-[88%] text-start px-4 py-2.5 rounded-2xl rounded-ee-md ring-1 ring-safran/50 text-safran text-[14.5px] hover:bg-safran hover:text-nuit transition-colors">{tp.chip}</motion.button>
                ))}</div>
              </motion.div>
            )}
          </div>

          {/* Message libre → WhatsApp */}
          <form onSubmit={send} className="flex items-center gap-2 p-3 bg-nuit-2 border-t border-white/10">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={s.placeholder} dir="auto" className="flex-1 h-12 rounded-full bg-nuit ring-1 ring-white/10 px-4 text-[15px] placeholder:text-white/35 focus:outline-none focus:ring-cyan" />
            <button aria-label="WhatsApp" className="w-12 h-12 rounded-full bg-safran text-nuit flex items-center justify-center active:scale-95 transition-transform"><Send size={18} className="rtl:-scale-x-100" /></button>
          </form>
        </motion.section>
      )}</AnimatePresence>
    </>
  );
};

/* Le bouton rond : le D du logo, un halo qui respire, un point cyan « nouveau message » */
export const Launcher = ({ open, onClick, label, small = false }: { open?: boolean; onClick: () => void; label: string; small?: boolean }) => (
  <button onClick={onClick} aria-label={label} className={`group relative ${small ? 'w-12 h-12' : 'w-[62px] h-[62px]'} rounded-full bg-nuit ring-1 ring-safran/50 flex items-center justify-center shadow-[0_18px_40px_-14px_rgba(0,0,0,.8)] active:scale-95 transition-transform`}>
    <span className="absolute inset-0 rounded-full chat-pulse" aria-hidden />
    <AnimatePresence mode="wait" initial={false}>
      {open ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={small ? 18 : 22} /></motion.span>
        : <motion.span key="d" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Mark className={small ? 'w-6 h-7' : 'w-8 h-9'} /></motion.span>}
    </AnimatePresence>
    {!open && <span className="absolute top-0.5 end-0.5 w-3 h-3 rounded-full bg-cyan ring-2 ring-nuit shadow-[0_0_10px_#2DD4E6]" />}
  </button>
);
