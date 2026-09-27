/**
 * Chat Digilago : remplace les boutons WhatsApp et Appeler.
 * Une bulle d'accroche apparaît près du logo ; au clic, une petite conversation guidée
 * (en français, en anglais ou en arabe selon la langue du site) oriente vers
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
    teaser: tv({ fr: 'Bonjour 👋 Je peux vous aider ?', en: 'Hi 👋 Can I help you?', ar: 'مرحبًا 👋 هل يمكنني مساعدتك؟' }),
    name: 'Digilago',
    status: tv({ fr: 'Réponse le jour même', en: 'Replies the same day', ar: 'نرد في اليوم نفسه' }),
    hello: [
      tv({ fr: 'Bienvenue chez Digilago ! 😊', en: 'Welcome to Digilago! 😊', ar: 'مرحبًا بك في ديجيلاغو! 😊' }),
      tv({ fr: 'Vous voulez que votre entreprise soit visible en ligne ? Site web, fiche Google, et même dans ChatGPT…', en: 'Want your business to be seen online? Website, Google profile, even on ChatGPT…', ar: 'هل تريد أن تكون شركتك حاضرة بقوة على الإنترنت؟ موقع احترافي، ملف Google، وظهور حتى في ChatGPT…' }),
      tv({ fr: 'Choisissez une option ci-dessous 👇', en: 'Pick an option below 👇', ar: 'اختر أحد الخيارات أدناه 👇' }),
    ],
    again: tv({ fr: 'Autre chose ? 🙂', en: 'Anything else? 🙂', ar: 'هل تحتاج شيئًا آخر؟ 🙂' }),
    placeholder: tv({ fr: 'Écrivez votre message…', en: 'Type your message…', ar: 'اكتب رسالتك هنا…' }),
    sending: tv({ fr: 'Parfait ! J’ouvre WhatsApp pour que votre message nous parvienne 🚀', en: 'Great! Opening WhatsApp so your message reaches us 🚀', ar: 'ممتاز! سنفتح واتساب لتصلنا رسالتك مباشرة 🚀' }),
    waPrefix: tv({ fr: 'Bonjour Digilago, ', en: 'Hello Digilago, ', ar: 'مرحبًا ديجيلاغو، ' }),
    open: tv({ fr: 'Ouvrir le chat', en: 'Open chat', ar: 'فتح المحادثة' }),
    close: tv({ fr: 'Fermer le chat', en: 'Close chat', ar: 'إغلاق المحادثة' }),
    topics: [
      { chip: tv({ fr: 'Oui, je veux être visible en ligne', en: 'Yes, I want to be online', ar: 'نعم، أريد أن أكون حاضرًا على الإنترنت' }),
        reply: [tv({ fr: 'Excellent ! 🙌 Nous créons votre site complet, votre fiche Google et votre référencement.', en: 'Great! 🙌 We build your full website, Google profile and SEO.', ar: 'ممتاز! 🙌 نصمّم موقعك المتكامل، ونُعدّ ملفك على Google، ونحسّن ظهورك في محركات البحث.' }),
                tv({ fr: 'Votre première version arrive en 72 heures, et vous ne payez que si le résultat vous plaît.', en: 'Your first version arrives in 72 hours, and you only pay if you love the result.', ar: 'تصلك النسخة الأولى خلال 72 ساعة، ولا تدفع إلا إذا نالت النتيجة إعجابك.' })],
        actions: [{ label: tv({ fr: 'Envoyer ma demande', en: 'Send your request', ar: 'أرسل طلبك' }), to: '/contact' }, { label: tv({ fr: 'Discuter sur WhatsApp', en: 'Chat on WhatsApp', ar: 'تواصل عبر واتساب' }), href: wa, icon: 'wa' }] },
      { chip: tv({ fr: 'Je veux voir vos réalisations', en: 'Show me your work', ar: 'أريد رؤية أعمالكم' }),
        reply: [tv({ fr: 'Voici des projets que nous avons livrés, et des idées pour chaque métier 👇', en: 'Here are some projects we’ve delivered, plus ideas for every trade 👇', ar: 'إليك مشاريع أنجزناها، ونماذج مصمّمة لكل قطاع 👇' })],
        actions: [{ label: tv({ fr: 'Voir les réalisations', en: 'See our work', ar: 'استعرض أعمالنا' }), to: '/realisations' }] },
      { chip: tv({ fr: 'Qui êtes-vous ?', en: 'Who are you?', ar: 'من أنتم؟' }),
        reply: [tv({ fr: 'Nous sommes Digilago, une société basée à El Jadida 🌊', en: 'We’re Digilago, a company from El Jadida 🌊', ar: 'نحن ديجيلاغو، شركة تقنية مقرّها الجديدة 🌊' }),
                tv({ fr: 'Onze ans d’expérience en sites, applications et e-commerce. Aujourd’hui, nous aidons les entreprises à se rendre visibles en ligne, et nous faisons presque tout pour elles.', en: 'For 11 years we’ve built websites, apps and e-commerce. Now we help businesses get seen online, and we do almost everything for them.', ar: 'أحد عشر عامًا من الخبرة في تطوير المواقع والتطبيقات والتجارة الإلكترونية. واليوم نساعد الشركات على بناء حضور رقمي قوي، ونتولى عنها كل شيء تقريبًا.' })],
        actions: [{ label: tv({ fr: 'Qui sommes-nous', en: 'About us', ar: 'من نحن' }), to: '/societe' }] },
      { chip: tv({ fr: 'Combien ça coûte ?', en: 'How much does it cost?', ar: 'كم تبلغ التكلفة؟' }),
        reply: [tv({ fr: 'Le prix dépend de ce dont vous avez besoin.', en: 'The price depends on what you need.', ar: 'يعتمد السعر على احتياجاتك.' }),
                tv({ fr: 'Nous vous l’annonçons par écrit avant de commencer, et si la première version ne vous plaît pas, vous ne payez rien. Aucune surprise 👌', en: 'We confirm it in writing before we start, and if you don’t love the first version, you pay nothing. No surprises 👌', ar: 'نحدّده لك كتابيًا قبل البدء، وإن لم تنل النسخة الأولى إعجابك فلن تدفع شيئًا. دون مفاجآت 👌' })],
        actions: [{ label: tv({ fr: 'Demander un devis', en: 'Get a quote', ar: 'اطلب عرض سعر' }), to: '/contact' }] },
      { chip: tv({ fr: 'Je veux parler à quelqu’un', en: 'I’d like to talk to someone', ar: 'أريد التحدث مع أحد أعضاء الفريق' }),
        reply: [tv({ fr: 'Avec plaisir ! Nous répondons le jour même, du lundi au samedi, de 9 h à 19 h.', en: 'Of course! We reply the same day, Monday to Saturday, 9 am to 7 pm.', ar: 'بكل سرور! نرد في اليوم نفسه، من الاثنين إلى السبت، من 9 صباحًا إلى 7 مساءً.' })],
        actions: [{ label: 'WhatsApp', href: wa, icon: 'wa' }, { label: tv({ fr: 'Nous appeler', en: 'Call us', ar: 'اتصل بنا' }), href: tel, icon: 'tel' }] },
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
      <div className="fixed end-4 bottom-4 lg:end-5 lg:bottom-5 z-[56]" style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
        <Launcher open={open} onClick={() => { setOpen(!open); hideTeaser(); }} label={open ? s.close : s.open} />
      </div>

      {/* Bulle d'accroche */}
      <AnimatePresence>{teaser && !open && (
        <motion.div className="fixed z-[56] end-4 lg:end-5 bottom-[88px] lg:bottom-[96px] max-w-[270px]" initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ transformOrigin: 'bottom' }}>
          <button onClick={() => { setOpen(true); hideTeaser(); }} className="relative w-full text-start rounded-2xl rounded-ee-md bg-white text-encre px-4 py-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,.6)] ring-1 ring-black/5">
            <span className="flex items-center gap-2.5"><Avatar size="w-8 h-8" /><span><span className="block text-[12px] text-ardoise">{s.name}</span><span className="block text-[15.5px] font-medium">{s.teaser}</span></span></span>
          </button>
          <button onClick={hideTeaser} aria-label={s.close} className="absolute -top-2.5 -start-2.5 w-7 h-7 rounded-full bg-nuit text-white ring-1 ring-white/20 flex items-center justify-center"><X size={13} /></button>
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
                    <button key={a.label} onClick={() => act(a)} className={`h-10 ps-3.5 pe-4 d-shape relative overflow-hidden text-[14px] font-medium flex items-center gap-2 transition-transform active:scale-95 ${a.icon === 'wa' ? 'bg-[#25D366] text-nuit' : a.icon === 'tel' ? 'bg-white/10 ring-1 ring-white/15' : 'btn-safran'}`}>
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
