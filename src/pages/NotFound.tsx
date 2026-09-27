/** Page 404 : « 4 D 4 », le D du logo remplace le zéro, et son point cyan cherche son chemin. */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { tv, L } from '../i18n';
import { MARK } from '../ui';
import { Reveal } from '../ui';
import { Seo } from '../seo';

export default function NotFound() {
  const reduce = useReducedMotion();

  const links: [string, string][] = [['/', tv({ fr: 'Accueil', en: 'Home', ar: 'الرئيسية' })], ['/services', tv({ fr: 'Services', en: 'Services', ar: 'الخدمات' })], ['/realisations', tv({ fr: 'Réalisations', en: 'Our work', ar: 'أعمالنا' })], ['/contact', tv({ fr: 'Contact', en: 'Contact', ar: 'اتصل بنا' })]];
  return (
    <section className="dark relative overflow-hidden min-h-[100svh] flex items-center">
      <Seo noindex title={tv({ fr: 'Page introuvable · Digilago', en: 'Page not found · Digilago', ar: 'الصفحة غير موجودة · ديجيلاغو' })} description={tv({ fr: 'Cette page n’existe pas.', en: 'This page does not exist.', ar: 'هذه الصفحة غير موجودة.' })} />
      <div className="absolute inset-0 dotgrid opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_45%,#000,transparent)]" />
      <div className="wrap relative pt-32 pb-24 text-center">
        <div className="flex items-center justify-center gap-[2vw] font-display font-semibold leading-none text-[clamp(7rem,22vw,17rem)] tracking-[-0.06em]" dir="ltr" aria-label="404">
          <motion.span initial={reduce ? false : { y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>4</motion.span>
          <svg viewBox="8 4 50 56" className="h-[0.78em] w-auto" aria-hidden>
            <motion.path d={MARK.d} fill="none" stroke="#F4B53F" strokeWidth={6.5} strokeLinejoin="round" strokeLinecap="square" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.65, 0, 0.35, 1] }} />
            <motion.path d={MARK.wave} fill="none" stroke="#F4B53F" strokeWidth={3.9} strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 1, ease: [0.65, 0, 0.35, 1] }} />
            {/* Le point cyan cherche son chemin avant de retrouver sa place */}
            <motion.circle r={MARK.dot.r} fill="#2DD4E6" style={{ filter: 'drop-shadow(0 0 3px #2DD4E6)' }}
              initial={reduce ? false : { cx: 20, cy: 16, opacity: 0 }}
              animate={reduce ? { cx: MARK.dot.cx, cy: MARK.dot.cy } : { cx: [20, 36, 26, 48, 38, MARK.dot.cx], cy: [16, 22, 44, 40, 14, MARK.dot.cy], opacity: [0, 1, 1, 1, 1, 1] }}
              transition={{ duration: 3.2, delay: 1.3, ease: 'easeInOut', times: [0, 0.2, 0.45, 0.65, 0.85, 1] }} />
          </svg>
          <motion.span initial={reduce ? false : { y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>4</motion.span>
        </div>
        <Reveal delay={0.3}><h1 className="mt-8 text-[clamp(1.8rem,3.4vw,2.8rem)]">{tv({ fr: 'Cette page s’est perdue en chemin.', en: 'This page got lost along the way.', ar: 'يبدو أن هذه الصفحة ضلّت طريقها.' })}</h1></Reveal>
        <Reveal delay={0.45}><p className="mt-4 text-[18px] text-brume max-w-[48ch] mx-auto">{tv({ fr: 'L’adresse que vous cherchez n’existe pas ou a changé. Voici de quoi retrouver votre chemin.', en: 'The address you’re looking for doesn’t exist or has changed. Here’s how to find your way back.', ar: 'العنوان الذي تبحث عنه غير موجود أو تم تغييره. إليك ما يساعدك على العودة.' })}</p></Reveal>
        <Reveal delay={0.6} className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map(([to, label], i) => <Link key={to} to={L(to)} className={`btn ${i === 0 ? 'btn-safran' : 'btn-line'}`}>{label}{i === 0 && <ArrowUpRight size={16} />}</Link>)}
        </Reveal>
      </div>
    </section>
  );
}
